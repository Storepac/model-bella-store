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

// GET: buscar configurações de aparência da loja (pegar storeId da query string)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    
    const [appearance] = await pool.query(`
      SELECT 
        id,
        cor_primaria,
        cor_secundaria,
        cor_botoes,
        cor_texto,
        fonte,
        logo,
        favicon,
        banner_principal,
        layout_tipo,
        mostrar_preco,
        mostrar_estoque,
        mostrar_marca,
        tema_escuro,
        storeId,
        created_at,
        updated_at
      FROM appearance 
      WHERE storeId = ?
      LIMIT 1
    `, [storeId])
    
    return NextResponse.json({ 
      success: true, 
      appearance: (appearance as any[])[0] || null 
    })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao buscar configurações de aparência', 
      details: error.message 
    }, { status: 500 })
  }
}

// POST: criar configurações de aparência (usar storeId do body)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    // Verificar se já existe configuração para esta loja
    const [existing] = await pool.query('SELECT id FROM appearance WHERE storeId = ?', [storeId])
    if ((existing as any[]).length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Configuração de aparência já existe para esta loja. Use PUT para atualizar.'
      }, { status: 409 })
    }
    
    const [result] = await pool.query(`
      INSERT INTO appearance (
        cor_primaria, cor_secundaria, cor_botoes, cor_texto,
        fonte, logo, favicon, banner_principal, layout_tipo,
        mostrar_preco, mostrar_estoque, mostrar_marca, tema_escuro,
        storeId, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      body.cor_primaria || '#000000',
      body.cor_secundaria || '#ffffff',
      body.cor_botoes || '#007bff',
      body.cor_texto || '#333333',
      body.fonte || 'Arial',
      body.logo || null,
      body.favicon || null,
      body.banner_principal || null,
      body.layout_tipo || 'grid',
      body.mostrar_preco !== undefined ? body.mostrar_preco : true,
      body.mostrar_estoque !== undefined ? body.mostrar_estoque : true,
      body.mostrar_marca !== undefined ? body.mostrar_marca : true,
      body.tema_escuro !== undefined ? body.tema_escuro : false,
      storeId
    ])
    
    return NextResponse.json({ 
      success: true, 
      id: (result as any).insertId 
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar configurações de aparência', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar configurações de aparência (validar se pertence à loja)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId: bodyStoreId, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se existe configuração para esta loja
    const [appearanceCheck] = await pool.query('SELECT id FROM appearance WHERE storeId = ?', [storeId])
    if ((appearanceCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Configuração de aparência não encontrada para esta loja.'
      }, { status: 404 })
    }
    
    const fields = []
    const values = []
    for (const key in updateData) {
      fields.push(`\`${key}\` = ?`)
      values.push(updateData[key])
    }
    values.push(storeId)
    
    await pool.query(`
      UPDATE appearance 
      SET ${fields.join(', ')}, updated_at = NOW() 
      WHERE storeId = ?
    `, values)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao atualizar configurações de aparência', 
      details: error.message 
    }, { status: 500 })
  }
}

// DELETE: deletar configurações de aparência (validar se pertence à loja)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId: bodyStoreId } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se existe configuração para esta loja
    const [appearanceCheck] = await pool.query('SELECT id FROM appearance WHERE storeId = ?', [storeId])
    if ((appearanceCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Configuração de aparência não encontrada para esta loja.'
      }, { status: 404 })
    }
    
    await pool.query('DELETE FROM appearance WHERE storeId = ?', [storeId])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao deletar configurações de aparência', 
      details: error.message 
    }, { status: 500 })
  }
} 
 
 
 