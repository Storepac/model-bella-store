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
    const { searchParams } = new URL(request.url)
    const storeId = Number(searchParams.get('storeId') || 1)

    // total de produtos
    const [[{ totalProducts = 0 } = {}]]: any = await pool.query(
      'SELECT COUNT(*) AS totalProducts FROM products WHERE storeId = ?',
      [storeId]
    )

    // total de imagens
    const [[{ totalPhotos = 0 } = {}]]: any = await pool.query(
      'SELECT COUNT(*) AS totalPhotos FROM product_media pm JOIN products p ON p.id = pm.productId WHERE p.storeId = ? AND pm.type = "image"',
      [storeId]
    )

    // total de vídeos
    const [[{ totalVideos = 0 } = {}]]: any = await pool.query(
      'SELECT COUNT(*) AS totalVideos FROM product_media pm JOIN products p ON p.id = pm.productId WHERE p.storeId = ? AND pm.type = "video"',
      [storeId]
    )

    // plano mock
    const plan = {
      name: 'Premium',
      limits: {
        products: 'Ilimitado',
        photosPerProduct: 10,
        video: true,
      },
    }

    return NextResponse.json({
      totalProducts,
      totalPhotos,
      totalVideos,
      plan,
    })
  } catch (error: any) {
    console.error('Error fetching overview:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 