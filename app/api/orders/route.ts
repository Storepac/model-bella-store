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

// GET: listar pedidos da loja (pegar storeId da query string)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    
    const [orders] = await pool.query(`
      SELECT 
        o.id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.status,
        o.total_amount,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as total_items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.storeId = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `, [storeId])
    
    return NextResponse.json({ success: true, orders })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar pedidos', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST: criar novo pedido (usar storeId do body)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    const [result] = await pool.query(`
      INSERT INTO orders (
        customer_name, customer_email, customer_phone, 
        status, total_amount, storeId, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      body.customer_name,
      body.customer_email,
      body.customer_phone,
      body.status || 'pendente',
      body.total_amount,
      storeId
    ])
    
    return NextResponse.json({ 
      success: true, 
      id: (result as any).insertId 
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar pedido', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar pedido (validar se pertence à loja)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se o pedido pertence à loja
    const [orderCheck] = await pool.query('SELECT id FROM orders WHERE id = ? AND storeId = ?', [id, storeId])
    if ((orderCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Pedido não encontrado ou não pertence à sua loja.'
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
      UPDATE orders 
      SET ${fields.join(', ')}, updated_at = NOW() 
      WHERE id = ? AND storeId = ?
    `, values)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao atualizar pedido', 
      details: error.message 
    }, { status: 500 })
  }
}

// DELETE: deletar pedido (validar se pertence à loja)
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
    
    // Verificar se o pedido pertence à loja
    const [orderCheck] = await pool.query('SELECT id FROM orders WHERE id = ? AND storeId = ?', [id, storeId])
    if ((orderCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Pedido não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    // Deletar itens do pedido primeiro
    await pool.query('DELETE FROM order_items WHERE order_id = ?', [id])
    // Deletar o pedido
    await pool.query('DELETE FROM orders WHERE id = ? AND storeId = ?', [id, storeId])
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao deletar pedido', 
      details: error.message 
    }, { status: 500 })
  }
} 
 
 
 