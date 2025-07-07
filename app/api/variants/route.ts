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

// GET: listar variantes da loja (pegar storeId da query string)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    
    const [variants] = await pool.query(`
      SELECT 
        v.id,
        v.name,
        v.description,
        v.type,
        v.isActive,
        v.created_at,
        v.updated_at,
        GROUP_CONCAT(vo.value ORDER BY vo.sort_order ASC) as options
      FROM variants v
      LEFT JOIN variant_options vo ON v.id = vo.variant_id
      WHERE v.storeId = ?
      GROUP BY v.id
      ORDER BY v.name ASC
    `, [storeId])
    
    // Processar opções como array
    const processedVariants = (variants as any[]).map(variant => ({
      ...variant,
      options: variant.options ? variant.options.split(',') : []
    }))
    
    return NextResponse.json({ success: true, variants: processedVariants })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar variantes', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST: criar nova variante (usar storeId do body)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    const [result] = await pool.query(`
      INSERT INTO variants (
        name, description, type, isActive, 
        storeId, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      body.name,
      body.description || null,
      body.type || 'text',
      body.isActive !== undefined ? body.isActive : true,
      storeId
    ])
    
    const variantId = (result as any).insertId
    
    // Adicionar opções da variante se fornecidas
    if (body.options && body.options.length > 0) {
      for (let i = 0; i < body.options.length; i++) {
        await pool.query(`
          INSERT INTO variant_options (variant_id, value, sort_order)
          VALUES (?, ?, ?)
        `, [variantId, body.options[i], i + 1])
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      id: variantId 
    }, { status: 201 })
  } catch (error: any) {
    console.error('ERRO AO CRIAR VARIANTE:', error, error?.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar variante', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar variante (validar se pertence à loja)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId, options, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se a variante pertence à loja
    const [variantCheck] = await pool.query('SELECT id FROM variants WHERE id = ? AND storeId = ?', [id, storeId])
    if ((variantCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Variante não encontrada ou não pertence à sua loja.'
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
      UPDATE variants 
      SET ${fields.join(', ')}, updated_at = NOW() 
      WHERE id = ? AND storeId = ?
    `, values)
    
    // Atualizar opções se fornecidas
    if (options) {
      // Remover opções antigas
      await pool.query('DELETE FROM variant_options WHERE variant_id = ?', [id])
      
      // Adicionar novas opções
      for (let i = 0; i < options.length; i++) {
        await pool.query(`
          INSERT INTO variant_options (variant_id, value, sort_order)
          VALUES (?, ?, ?)
        `, [id, options[i], i + 1])
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao atualizar variante', 
      details: error.message 
    }, { status: 500 })
  }
}

// DELETE: deletar variante (validar se pertence à loja)
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
    
    // Verificar se a variante pertence à loja
    const [variantCheck] = await pool.query('SELECT id FROM variants WHERE id = ? AND storeId = ?', [id, storeId])
    if ((variantCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Variante não encontrada ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    // Deletar opções da variante primeiro
    await pool.query('DELETE FROM variant_options WHERE variant_id = ?', [id])
    // Deletar a variante
    await pool.query('DELETE FROM variants WHERE id = ? AND storeId = ?', [id, storeId])
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao deletar variante', 
      details: error.message 
    }, { status: 500 })
  }
} 
 
 
 