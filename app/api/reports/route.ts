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
    // Exemplo de relatório simples
    const [[{ totalVendas = 0 } = {}]] = await pool.query('SELECT SUM(valor_total) as totalVendas FROM orders')
    const [[{ totalClientes = 0 } = {}]] = await pool.query('SELECT COUNT(*) as totalClientes FROM clients')
    const [[{ totalProdutos = 0 } = {}]] = await pool.query('SELECT COUNT(*) as totalProdutos FROM products')
    return NextResponse.json({ reports: { totalVendas, totalClientes, totalProdutos } })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar relatórios', details: error.message }, { status: 500 })
  }
} 