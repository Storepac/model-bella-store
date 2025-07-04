import { NextRequest, NextResponse } from 'next/server'

// Mock data - em produção isso viria do banco de dados
let products = [
  {
    id: "1",
    name: "Vestido Floral Elegante",
    description: "Vestido floral elegante para ocasiões especiais",
    price: 129.90,
    originalPrice: 159.90,
    images: [
      "/api/images?filename=img_1.jpg",
      "/api/images?filename=img_2.jpg"
    ],
    categoryId: "1-1-1", // Vestidos de Festa
    categorySlug: "vestidos-festa",
    brand: "Zara",
    sizes: ["P", "M", "G"],
    colors: ["Azul", "Rosa"],
    stock: 15,
    isActive: true,
    isFeatured: true,
    isOnSale: true,
    tags: ["vestido", "floral", "elegante", "festa"],
    specifications: {
      material: "Poliester",
      care: "Lavar a mão",
      origin: "Brasil"
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Blusa Básica Casual",
    description: "Blusa básica casual para o dia a dia",
    price: 49.90,
    originalPrice: 49.90,
    images: [
      "/api/images?filename=img_3.jpg"
    ],
    categoryId: "1-2", // Blusas
    categorySlug: "blusas",
    brand: "H&M",
    sizes: ["PP", "P", "M", "G", "GG"],
    colors: ["Branco", "Preto", "Azul"],
    stock: 25,
    isActive: true,
    isFeatured: false,
    isOnSale: false,
    tags: ["blusa", "básica", "casual"],
    specifications: {
      material: "Algodão",
      care: "Lavar na máquina",
      origin: "Brasil"
    },
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const categoryId = searchParams.get('categoryId')
  const categorySlug = searchParams.get('categorySlug')
  const activeOnly = searchParams.get('activeOnly') === 'true'
  const featured = searchParams.get('featured') === 'true'
  const onSale = searchParams.get('onSale') === 'true'
  const limit = parseInt(searchParams.get('limit') || '20')
  const page = parseInt(searchParams.get('page') || '1')

  try {
    let result = products

    // Filtrar por ID específico
    if (id) {
      const product = products.find(p => p.id === id)
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      return NextResponse.json(product)
    }

    // Filtrar por categoria
    if (categoryId) {
      result = result.filter(p => p.categoryId === categoryId)
    }

    if (categorySlug) {
      result = result.filter(p => p.categorySlug === categorySlug)
    }

    // Filtrar por status
    if (activeOnly) {
      result = result.filter(p => p.isActive)
    }

    if (featured) {
      result = result.filter(p => p.isFeatured)
    }

    if (onSale) {
      result = result.filter(p => p.isOnSale)
    }

    // Paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedResult = result.slice(startIndex, endIndex)

    return NextResponse.json({
      products: paginatedResult,
      pagination: {
        page,
        limit,
        total: result.length,
        totalPages: Math.ceil(result.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newProduct = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    products.push(newProduct)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    const productIndex = products.findIndex(p => p.id === id)
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    products.splice(productIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 