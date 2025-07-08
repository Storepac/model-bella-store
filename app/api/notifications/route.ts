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
    
    const [rows] = await pool.query('SELECT * FROM notifications WHERE storeId = ? ORDER BY enviado_em DESC', [storeId])
    return NextResponse.json({ notifications: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar notificações', details: error.message }, { status: 500 })
  }
}

// POST: criar nova notificação (usar storeId do body)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const storeId = body.storeId ? Number(body.storeId) : 1
    
    const [result] = await pool.query(`
      INSERT INTO notifications (
        titulo, mensagem, tipo, destinatario, 
        canal, status, enviado_em, storeId
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
    `, [
      body.titulo,
      body.mensagem,
      body.tipo || 'info',
      body.destinatario,
      body.canal || 'email',
      body.status || 'enviado',
      storeId
    ])
    
    return NextResponse.json({ 
      success: true, 
      id: (result as any).insertId 
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao criar notificação', 
      details: error.message 
    }, { status: 500 })
  }
}

// PUT: atualizar notificação (validar se pertence à loja)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId: bodyStoreId, ...updateData } = body
    const storeId = bodyStoreId ? Number(bodyStoreId) : 1
    
    // Verificar se a notificação pertence à loja
    const [notificationCheck] = await pool.query('SELECT id FROM notifications WHERE id = ? AND storeId = ?', [id, storeId])
    if ((notificationCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Notificação não encontrada ou não pertence à sua loja.'
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
      UPDATE notifications 
      SET ${fields.join(', ')} 
      WHERE id = ? AND storeId = ?
    `, values)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao atualizar notificação', details: error.message }, { status: 500 })
  }
}

// DELETE: deletar notificação (validar se pertence à loja)
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
    
    // Verificar se a notificação pertence à loja
    const [notificationCheck] = await pool.query('SELECT id FROM notifications WHERE id = ? AND storeId = ?', [id, storeId])
    if ((notificationCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Notificação não encontrada ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    await pool.query('DELETE FROM notifications WHERE id = ? AND storeId = ?', [id, storeId])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao deletar notificação', details: error.message }, { status: 500 })
  }
} 