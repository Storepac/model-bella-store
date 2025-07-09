import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Configuração do banco

    
    // Formatar dados para o frontend
    const formattedProducts = (products as any[]).map(product => ({
      ...product,
      slug: product.slug || `produto-${product.id}`, // Gerar slug se não existir
      images: product.images ? product.images.split(',') : [],
      price: `R$ ${parseFloat(product.price).toFixed(2)}`,
      original_price: product.original_price ? `R$ ${parseFloat(product.original_price).toFixed(2)}` : null,
      createdAt: new Date(product.createdAt).toLocaleDateString('pt-BR'),
      status: product.status === 'ativo' ? 'active' : 'inactive',
      category: product.category_name || 'Sem categoria',
      subcategory: product.subcategory_name || '',
      brand: product.brand_name || '',
      brandId: product.brandId || null
    }));
    
    return NextResponse.json({
      success: true,
      products: formattedProducts,
      total: formattedProducts.length
    });
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Receber dados do produto
    const productData = await request.json()
    // Pegar storeId do body, default 1
    const storeId = productData.storeId ? Number(productData.storeId) : 1;
    
    // Gerar slug baseado no nome
    const baseSlug = generateSlug(productData.name)
    let slug = baseSlug
    let counter = 1
    
    // Verificar se slug já existe e criar um único
    while (true) {
      const [existingSlug] = await pool.query('SELECT id FROM products WHERE slug = ? AND storeId = ?', [slug, storeId])
      if ((existingSlug as any[]).length === 0) {
        break
      }
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
    // --- CHECAGEM DE LIMITE DE PRODUTOS ---
    // Buscar limite do plano na tabela settings
    const settingsRows = await pool.query('SELECT limite_produtos FROM settings WHERE storeId = ?', [storeId]);
    const settings = settingsRows[0][0];
    const productsLimit = settings && settings.limite_produtos ? Number(settings.limite_produtos) : 5;
    // Contar produtos já cadastrados
    const countRows = await pool.query('SELECT COUNT(*) as total FROM products WHERE storeId = ?', [storeId]);
    const totalProducts = countRows[0][0].total;
    if (totalProducts >= productsLimit) {
      return NextResponse.json({
        success: false,
        error: 'Limite de produtos atingido para seu plano.'
      }, { status: 403 });
    }
    // --- FIM CHECAGEM DE LIMITE ---

    // Verificar SKU duplicado se informado
    if (productData.sku) {
      const [skuCheck] = await pool.query('SELECT id FROM products WHERE sku = ?', [productData.sku])
      if ((skuCheck as any[]).length > 0) {
        return NextResponse.json({
          success: false,
          error: 'SKU já cadastrado. Escolha outro código.'
        }, { status: 409 })
      }
    }

    // Inserir produto com slug
    const [result] = await pool.query(`
      INSERT INTO products (
        name, description, sku, slug, price, original_price, 
        categoryId, brandId, status, isFeatured, isPromotion, 
        isLaunch, isNew, isActive, stock, storeId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      productData.name,
      productData.description,
      productData.sku || null,
      slug,
      productData.price,
      productData.original_price,
      productData.categoryId,
      productData.brandId || null,
      productData.status || 'ativo',
      productData.isFeatured || false,
      productData.isPromotion || false,
      productData.isLaunch || false,
      productData.isNew || false,
      productData.isActive !== undefined ? productData.isActive : true,
      productData.stock || 0,
      storeId
    ])
    const productId = (result as any).insertId

    // Se não informou SKU, atualizar para o próprio ID
    if (!productData.sku) {
      await pool.query('UPDATE products SET sku = ? WHERE id = ?', [String(productId), productId])
    }

    // Se tiver imagens, inserir na tabela product_media
    if (productData.images && productData.images.length > 0) {
      for (let i = 0; i < productData.images.length; i++) {
        await pool.query(`
          INSERT INTO product_media (productId, url, type, isMain, \`order\`)
          VALUES (?, ?, 'image', ?, ?)
        `, [
          productId,
          productData.images[i],
          i === 0, // primeira imagem é main
          i
        ])
      }
    }

    // --- VARIANTES ---
    // Se vierem variantes, salvar combinações (preço, estoque, ativo) ou usar padrão do produto
    if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
      for (const variant of productData.variants) {
        // variant: { id, options: [op1, op2], price, stock, isActive }
        await pool.query(`
          INSERT INTO product_variants (productId, variantId, options, price, stock, isActive)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          productId,
          variant.id,
          JSON.stringify(variant.options || []),
          variant.price !== undefined ? variant.price : productData.price,
          variant.stock !== undefined ? variant.stock : productData.stock,
          variant.isActive !== undefined ? variant.isActive : true
        ])
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Produto cadastrado com sucesso',
      product: {
        id: productId,
        ...productData,
        slug: slug,
        sku: productData.sku || String(productId),
        storeId,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const productIndex = products.findIndex(p => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    products[productIndex] = {
      ...products[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(products[productIndex])
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Remover do banco de dados
    await pool.query('DELETE FROM products WHERE id = ?', [id])
    // Opcional: remover variantes e mídias associadas, se necessário

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}