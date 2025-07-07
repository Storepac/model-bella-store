import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Configuração do banco
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    
    // Buscar produto específico
    const [products] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.sku,
        p.price,
        p.original_price,
        p.categoryId,
        p.brand,
        p.status,
        p.isFeatured,
        p.isPromotion,
        p.isLaunch,
        p.stock,
        p.storeId,
        p.createdAt,
        p.updatedAt,
        p.video,
        GROUP_CONCAT(pm.url) as images,
        c.name as category_name
      FROM products p
      LEFT JOIN product_media pm ON p.id = pm.product_id
      LEFT JOIN categories c ON p.categoryId = c.id
      WHERE p.id = ? AND p.status = 'ativo'
      GROUP BY p.id
    `, [productId])
    
    if (!products || (products as any[]).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Produto não encontrado' 
      }, { status: 404 })
    }
    
    const product = (products as any[])[0]
    
    // Buscar variantes do produto
    const [variants] = await pool.query(`
      SELECT type, value 
      FROM product_variants 
      WHERE product_id = ?
    `, [productId])
    
    // Organizar variantes por tipo
    const sizes: string[] = []
    const colors: string[] = []
    
    ;(variants as any[]).forEach(variant => {
      if (variant.type === 'size') {
        sizes.push(variant.value)
      } else if (variant.type === 'color') {
        colors.push(variant.value)
      }
    })
    
    // Formatar dados para o frontend
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description || "Produto sem descrição",
      sku: product.sku,
      price: parseFloat(product.price),
      original_price: product.original_price ? parseFloat(product.original_price) : null,
      category: product.category_name || 'Sem categoria',
      brand: product.brand,
      status: product.status,
      stock: product.stock || 0,
      images: product.images ? product.images.split(',') : ['/placeholder.svg'],
      video: product.video || null,
      sizes: sizes.length > 0 ? sizes : [],
      colors: colors.length > 0 ? colors : [],
      rating: 4.5, // Mock por enquanto
      reviews: 0,  // Mock por enquanto
      isNew: product.isLaunch,
      isFeatured: product.isFeatured,
      isPromotion: product.isPromotion,
      features: [
        product.brand ? `Marca: ${product.brand}` : null,
        `Estoque: ${product.stock || 0} unidades`,
        product.sku ? `SKU: ${product.sku}` : null
      ].filter(Boolean),
      createdAt: product.createdAt
    }
    
    return NextResponse.json({
      success: true,
      product: formattedProduct
    })
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const updateData = await request.json()
    
    // Pegar storeId do body, default 1
    const storeId = updateData.storeId ? Number(updateData.storeId) : 1;
    
    // Não permitir SKU vazio
    if (!updateData.sku) {
      return NextResponse.json({
        success: false,
        error: 'SKU não pode ser vazio.'
      }, { status: 400 })
    }

    // Verificar se o produto pertence à loja antes de editar
    const [productCheck] = await pool.query('SELECT id FROM products WHERE id = ? AND storeId = ?', [productId, storeId])
    if ((productCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Produto não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }

    // Verificar SKU duplicado (exceto para o próprio produto) na mesma loja
    const [skuCheck] = await pool.query('SELECT id FROM products WHERE sku = ? AND id != ? AND storeId = ?', [updateData.sku, productId, storeId])
    if ((skuCheck as any[]).length > 0) {
      return NextResponse.json({
        success: false,
        error: 'SKU já cadastrado em outro produto.'
      }, { status: 409 })
    }

    // Atualizar produto no banco (só da loja correta)
    await pool.query(`
      UPDATE products 
      SET 
        name = ?,
        description = ?,
        price = ?,
        original_price = ?,
        stock = ?,
        sku = ?,
        status = ?,
        updatedAt = NOW()
      WHERE id = ? AND storeId = ?
    `, [
      updateData.name,
      updateData.description,
      updateData.price,
      updateData.original_price || null,
      updateData.stock,
      updateData.sku,
      updateData.status,
      productId,
      storeId
    ])
    
    return NextResponse.json({
      success: true,
      message: 'Produto atualizado com sucesso'
    })
    
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const updateData = await request.json()
    
    // Pegar storeId do body, default 1
    const storeId = updateData.storeId ? Number(updateData.storeId) : 1;
    
    // Verificar se o produto pertence à loja antes de editar
    const [productCheck] = await pool.query('SELECT id FROM products WHERE id = ? AND storeId = ?', [productId, storeId])
    if ((productCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Produto não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }
    
    // Atualizar produto no banco (só da loja correta)
    await pool.query(`
      UPDATE products 
      SET status = ?, updatedAt = NOW()
      WHERE id = ? AND storeId = ?
    `, [updateData.status, productId, storeId])
    
    return NextResponse.json({
      success: true,
      message: 'Produto atualizado com sucesso'
    })
    
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId') ? Number(searchParams.get('storeId')) : 1
    
    // Buscar a(s) categoria(s) do produto antes de excluir
    const [catRows] = await pool.query('SELECT categoryId FROM products WHERE id = ?', [productId])
    const categoryIds = (catRows as any[]).map(c => c.categoryId).filter(Boolean)

    // Verificar se o produto pertence à loja antes de excluir
    const [productCheck] = await pool.query('SELECT id FROM products WHERE id = ? AND storeId = ?', [productId, storeId])
    if ((productCheck as any[]).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Produto não encontrado ou não pertence à sua loja.'
      }, { status: 404 })
    }

    // Excluir mídia do produto primeiro (se existir)
    await pool.query('DELETE FROM product_media WHERE productId = ?', [productId])
    
    // Buscar todos os ids das variantes do produto
    const [variantRows] = await pool.query('SELECT id FROM product_variants WHERE productId = ?', [productId])
    const variantIds = (variantRows as any[]).map(v => v.id)
    if (variantIds.length > 0) {
      // Excluir opções de variantes relacionadas
      await pool.query(`DELETE FROM variant_options WHERE variant_id IN (${variantIds.map(() => '?').join(',')})`, variantIds)
    }
    
    // Excluir variantes do produto (se existir)
    await pool.query('DELETE FROM product_variants WHERE productId = ?', [productId])
    
    // Excluir o produto
    await pool.query('DELETE FROM products WHERE id = ? AND storeId = ?', [productId, storeId])

    // Atualizar a contagem de produtos nas categorias relacionadas
    for (const categoryId of categoryIds) {
      if (categoryId) {
        const [countRows] = await pool.query('SELECT COUNT(*) as count FROM products WHERE categoryId = ? AND storeId = ?', [categoryId, storeId])
        const count = (countRows as any[])[0]?.count || 0
        await pool.query('UPDATE categories SET productCount = ? WHERE id = ?', [count, categoryId])
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Produto excluído com sucesso'
    })
    
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 