import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const host = searchParams.get('host')
    if (!host) {
      return NextResponse.json({ success: false, error: 'Host não informado' }, { status: 400 })
    }

    // Buscar loja pelo domínio ou subdomínio
    const [rows] = await pool.query(
      'SELECT id, name, domain, subdomain FROM stores WHERE domain = ? OR subdomain = ? LIMIT 1',
      [host, host]
    )
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ success: false, error: 'Loja não encontrada para este domínio' }, { status: 404 })
    }
    const store = (rows as any[])[0]
    return NextResponse.json({ success: true, storeId: store.id, store })
  } catch (error) {
    console.error('Erro ao resolver storeId:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
} 