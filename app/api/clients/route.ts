import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function GET(request: NextRequest) {
  try {
    // Pegar storeId da query string, default 1
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    
    const [rows] = await pool.query('SELECT * FROM clients WHERE storeId = ? ORDER BY createdAt DESC', [storeId])
    return NextResponse.json({ clients: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar clientes', details: error.message }, { status: 500 })
  }
}

// POST: criar novo cliente (usar storeId do body)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    const [result] = await pool.query(`
      INSERT INTO clients (
        name, email, phone, cpf, birth_date, 
        address, city, state, zip_code, storeId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      body.name,
      body.email,
      body.phone,
      body.cpf,
      body.birth_date,
      body.address,
      body.city,
      body.state,
      body.zip_code,
      storeId
    ])
    
    return NextResponse.json({ 
      success: true, 
      id: (result as any).insertId 
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar cliente', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar cliente (validar se pertence à loja)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se o cliente pertence à loja
    const [clientCheck] = await pool.query('SELECT id FROM clients WHERE id = ? AND storeId = ?', [id, storeId])
    if ((clientCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Cliente não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    const fields = []
    const values = []
    for (const key in updateData) {
      fields.push(`\`${key}\` = ?`)
      values.push(updateData[key])
    }
    values.push(id)
    values.push(storeId)
    
    await pool.query(`
      UPDATE clients 
      SET ${fields.join(', ')}, updatedAt = NOW() 
      WHERE id = ? AND storeId = ?
    `, values)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar cliente', details: error.message }, { status: 500 })
  }
}

// DELETE: deletar cliente (validar se pertence à loja)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID é obrigatório' 
      }, { status: 400 })
    }
    
    // Verificar se o cliente pertence à loja
    const [clientCheck] = await pool.query('SELECT id FROM clients WHERE id = ? AND storeId = ?', [id, storeId])
    if ((clientCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Cliente não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    await pool.query('DELETE FROM clients WHERE id = ? AND storeId = ?', [id, storeId])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao deletar cliente', details: error.message }, { status: 500 })
  }
} 