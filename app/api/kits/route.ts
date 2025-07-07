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

// GET: listar kits da loja (pegar storeId da query string)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    
    const [kits] = await pool.query(`
      SELECT 
        k.id,
        k.name,
        k.description,
        k.image,
        k.price,
        k.original_price,
        k.discount_percentage,
        k.isActive,
        k.created_at,
        k.updated_at,
        COUNT(ki.product_id) as total_products
      FROM kits k
      LEFT JOIN kit_items ki ON k.id = ki.kit_id
      WHERE k.storeId = ?
      GROUP BY k.id
      ORDER BY k.created_at DESC
    `, [storeId])
    
    return NextResponse.json({ success: true, kits })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar kits', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST: criar novo kit (usar storeId do body)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    const [result] = await pool.query(`
      INSERT INTO kits (
        name, description, image, price, original_price, 
        discount_percentage, isActive, storeId, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      body.name,
      body.description,
      body.image,
      body.price,
      body.original_price,
      body.discount_percentage,
      body.isActive !== undefined ? body.isActive : true,
      storeId
    ])
    
    const kitId = (result as any).insertId
    
    // Adicionar produtos ao kit se fornecidos
    if (body.products && body.products.length > 0) {
      for (const product of body.products) {
        await pool.query(`
          INSERT INTO kit_items (kit_id, product_id, quantity)
          VALUES (?, ?, ?)
        `, [kitId, product.id, product.quantity || 1])
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      id: kitId 
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar kit', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar kit (validar se pertence à loja)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId, products, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se o kit pertence à loja
    const [kitCheck] = await pool.query('SELECT id FROM kits WHERE id = ? AND storeId = ?', [id, storeId])
    if ((kitCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Kit não encontrado ou não pertence à sua loja.'
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
      UPDATE kits 
      SET ${fields.join(', ')}, updated_at = NOW() 
      WHERE id = ? AND storeId = ?
    `, values)
    
    // Atualizar produtos do kit se fornecidos
    if (products) {
      // Remover produtos antigos
      await pool.query('DELETE FROM kit_items WHERE kit_id = ?', [id])
      
      // Adicionar novos produtos
      for (const product of products) {
        await pool.query(`
          INSERT INTO kit_items (kit_id, product_id, quantity)
          VALUES (?, ?, ?)
        `, [id, product.id, product.quantity || 1])
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao atualizar kit', 
      details: error.message 
    }, { status: 500 })
  }
}

// DELETE: deletar kit (validar se pertence à loja)
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
    
    // Verificar se o kit pertence à loja
    const [kitCheck] = await pool.query('SELECT id FROM kits WHERE id = ? AND storeId = ?', [id, storeId])
    if ((kitCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Kit não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    // Deletar itens do kit primeiro
    await pool.query('DELETE FROM kit_items WHERE kit_id = ?', [id])
    // Deletar o kit
    await pool.query('DELETE FROM kits WHERE id = ? AND storeId = ?', [id, storeId])
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao deletar kit', 
      details: error.message 
    }, { status: 500 })
  }
} 
 
 
 