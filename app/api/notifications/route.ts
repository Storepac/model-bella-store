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

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY enviado_em DESC')
    return NextResponse.json({ notifications: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar notificações', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const [result] = await pool.query(
      'INSERT INTO notifications (storeId, clientId, whatsapp, arquivo, mensagem, enviado_em, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [body.storeId || 1, body.clientId || null, body.whatsapp, body.arquivo, body.mensagem, body.enviado_em || new Date(), body.status || null]
    )
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar notificação', details: error.message }, { status: 500 })
  }
} 