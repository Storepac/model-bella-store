import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1
    
    // Buscar produto por slug
    const [products] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.sku,
        p.slug,
        p.price,
        p.original_price,
        p.categoryId,
        c.name as category_name,
        c.slug as category_slug,
        c2.name as subcategory_name,
        p.brandId,
        b.name as brand_name,
        p.status,
        p.isFeatured,
        p.isPromotion,
        p.isLaunch,
        p.isNew,
        p.isActive,
        p.stock,
        p.storeId,
        p.createdAt,
        p.updatedAt,
        GROUP_CONCAT(pm.url) as images
      FROM products p
      LEFT JOIN product_media pm ON p.id = pm.productId
      LEFT JOIN categories c ON p.categoryId = c.id
      LEFT JOIN categories c2 ON c.parentId = c2.id
      LEFT JOIN brands b ON p.brandId = b.id
      WHERE p.slug = ? AND p.storeId = ? AND p.isActive = 1
      GROUP BY p.id
    `, [params.slug, storeId])
    
    if ((products as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Produto não encontrado'
      }, { status: 404 })
    }
    
    const product = (products as any[])[0]
    
    // Buscar variantes do produto
    const [variants] = await pool.query(`
      SELECT variantId, options, price, stock, isActive
      FROM product_variants 
      WHERE productId = ? AND isActive = 1
    `, [product.id])
    
    // Formatar dados para o frontend
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      slug: product.slug,
      price: parseFloat(product.price),
      originalPrice: product.original_price ? parseFloat(product.original_price) : null,
      images: product.images ? product.images.split(',') : ['/placeholder.svg'],
      category: {
        id: product.categoryId,
        name: product.category_name || 'Sem categoria',
        slug: product.category_slug || 'sem-categoria'
      },
      subcategory: product.subcategory_name || '',
      brand: {
        id: product.brandId,
        name: product.brand_name || ''
      },
      status: product.status,
      isFeatured: Boolean(product.isFeatured),
      isPromotion: Boolean(product.isPromotion),
      isLaunch: Boolean(product.isLaunch),
      isNew: Boolean(product.isNew),
      stock: product.stock,
      variants: (variants as any[]).map(v => ({
        id: v.variantId,
        options: JSON.parse(v.options || '[]'),
        price: parseFloat(v.price),
        stock: v.stock,
        isActive: Boolean(v.isActive)
      })),
      rating: 4.5, // Temporário - implementar sistema de avaliações
      reviewCount: 12, // Temporário
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }
    
    return NextResponse.json({
      success: true,
      product: formattedProduct
    })
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
} 