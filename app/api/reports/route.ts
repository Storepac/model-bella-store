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
    
    // Relatórios filtrados por loja
    const [vendasResult] = await pool.query('SELECT SUM(total_amount) as totalVendas FROM orders WHERE storeId = ?', [storeId])
    const [clientesResult] = await pool.query('SELECT COUNT(*) as totalClientes FROM clients WHERE storeId = ?', [storeId])
    const [produtosResult] = await pool.query('SELECT COUNT(*) as totalProdutos FROM products WHERE storeId = ?', [storeId])
    const [pedidosResult] = await pool.query('SELECT COUNT(*) as totalPedidos FROM orders WHERE storeId = ?', [storeId])
    const [categoriasResult] = await pool.query('SELECT COUNT(*) as totalCategorias FROM categories WHERE storeId = ?', [storeId])
    const [bannersResult] = await pool.query('SELECT COUNT(*) as totalBanners FROM banners WHERE storeId = ?', [storeId])
    const [cuponsResult] = await pool.query('SELECT COUNT(*) as totalCupons FROM coupons WHERE storeId = ?', [storeId])
    
    const totalVendas = (vendasResult as any[])[0]?.totalVendas || 0
    const totalClientes = (clientesResult as any[])[0]?.totalClientes || 0
    const totalProdutos = (produtosResult as any[])[0]?.totalProdutos || 0
    const totalPedidos = (pedidosResult as any[])[0]?.totalPedidos || 0
    const totalCategorias = (categoriasResult as any[])[0]?.totalCategorias || 0
    const totalBanners = (bannersResult as any[])[0]?.totalBanners || 0
    const totalCupons = (cuponsResult as any[])[0]?.totalCupons || 0
    
    return NextResponse.json({ 
      reports: { 
        totalVendas, 
        totalClientes, 
        totalProdutos, 
        totalPedidos, 
        totalCategorias, 
        totalBanners, 
        totalCupons 
      } 
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro ao buscar relatórios', details: error.message }, { status: 500 })
  }
} 