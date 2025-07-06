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
    const [rows] = await pool.query('SELECT * FROM coupons ORDER BY createdAt DESC')
    return NextResponse.json({ coupons: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar cupons', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const [result] = await pool.query(
      'INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_uses, expires_at, isActive, storeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [body.code, body.description, body.discount_type, body.discount_value, body.min_order_value, body.max_uses, body.expires_at, body.isActive !== undefined ? body.isActive : true, body.storeId || 1]
    )
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar cupom', details: error.message }, { status: 500 })
  }
} 