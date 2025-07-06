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
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY createdAt DESC')
    return NextResponse.json({ clients: rows })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar clientes', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const [result] = await pool.query(
      'INSERT INTO clients (id, name, whatsapp, email, endereco, cnpj, cep, rua, numero, bairro, cidade, uf, telefoneFixo, countryCode, plan, planPrice, createdAt, storeId) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
      [
        body.name,
        body.whatsapp,
        body.email,
        body.endereco || null,
        body.cnpj || null,
        body.cep || null,
        body.rua || null,
        body.numero || null,
        body.bairro || null,
        body.cidade || null,
        body.uf || null,
        body.telefoneFixo || null,
        body.countryCode || '+55',
        body.plan || 'Start',
        body.planPrice || 39.9,
        body.storeId || null,
      ]
    )
    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao criar cliente', details: error.message }, { status: 500 })
  }
} 