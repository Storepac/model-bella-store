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
    const [rows] = await pool.query('SELECT * FROM banners ORDER BY createdAt DESC')
    return NextResponse.json({ banners: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar banners', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const [result] = await pool.query(
      'INSERT INTO banners (title, description, image, link, buttonText, position, isActive, categoryId, storeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [body.title, body.description, body.image, body.link, body.buttonText, body.position, body.isActive !== undefined ? body.isActive : true, body.categoryId || null, body.storeId || 1]
    )
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar banner', details: error.message }, { status: 500 })
  }
} 