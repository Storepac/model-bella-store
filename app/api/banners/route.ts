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
    
    const [rows] = await pool.query('SELECT * FROM banners WHERE storeId = ? ORDER BY createdAt DESC', [storeId])
    return NextResponse.json({ banners: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar banners', details: error.message }, { status: 500 })
  }
}

// POST: criar novo banner (usar storeId do body)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    const [result] = await pool.query(`
      INSERT INTO banners (
        title, description, image, link, 
        isActive, \`order\`, storeId, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      body.title,
      body.description,
      body.image,
      body.link,
      body.isActive !== undefined ? body.isActive : true,
      body.order || 0,
      storeId
    ])
    
    return NextResponse.json({ 
      success: true, 
      id: (result as any).insertId 
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar banner', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar banner (validar se pertence à loja)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se o banner pertence à loja
    const [bannerCheck] = await pool.query('SELECT id FROM banners WHERE id = ? AND storeId = ?', [id, storeId])
    if ((bannerCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Banner não encontrado ou não pertence à sua loja.'
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
      UPDATE banners 
      SET ${fields.join(', ')}, updatedAt = NOW() 
      WHERE id = ? AND storeId = ?
    `, values)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar banner', details: error.message }, { status: 500 })
  }
}

// DELETE: deletar banner (validar se pertence à loja)
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
    
    // Verificar se o banner pertence à loja
    const [bannerCheck] = await pool.query('SELECT id FROM banners WHERE id = ? AND storeId = ?', [id, storeId])
    if ((bannerCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Banner não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    await pool.query('DELETE FROM banners WHERE id = ? AND storeId = ?', [id, storeId])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao deletar banner', details: error.message }, { status: 500 })
  }
} 