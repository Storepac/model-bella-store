import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'


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
 
 
 