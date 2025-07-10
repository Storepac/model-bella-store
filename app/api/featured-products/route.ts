import { NextRequest, NextResponse } from 'next/server'

// Produtos em destaque mockados para cada categoria
const featuredProducts = {
  'vestidos-festa': [
    {
      id: '1',
      name: 'Vestido Longo Elegante',
      price: 159.90,
      originalPrice: 199.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg'],
      category: 'Vestidos de Festa',
      rating: 4.8,
      reviews: 24
    },
    {
      id: '2',
      name: 'Vestido Floral Primavera',
      price: 89.90,
      originalPrice: 129.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg'],
      category: 'Vestidos de Festa',
      rating: 4.6,
      reviews: 18
    }
  ],
  'vestidos-casuais': [
    {
      id: '3',
      name: 'Vestido Casual Verão',
      price: 69.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg'],
      category: 'Vestidos Casuais',
      rating: 4.4,
      reviews: 16
    },
    {
      id: '4',
      name: 'Vestido Midi Estampado',
      price: 79.90,
      originalPrice: 99.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg'],
      category: 'Vestidos Casuais',
      rating: 4.7,
      reviews: 22
    }
  ],
  'blusas-basicas': [
    {
      id: '5',
      name: 'Blusa Básica Algodão',
      price: 45.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg'],
      category: 'Blusas Básicas',
      rating: 4.5,
      reviews: 18
    },
    {
      id: '6',
      name: 'Blusa Social Elegante',
      price: 55.90,
      originalPrice: 75.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg'],
      category: 'Blusas Básicas',
      rating: 4.7,
      reviews: 22
    }
  ],
  'blusas-estampadas': [
    {
      id: '7',
      name: 'Blusa Transparente',
      price: 35.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg'],
      category: 'Blusas Estampadas',
      rating: 4.3,
      reviews: 15
    },
    {
      id: '8',
      name: 'Blusa Floral Verão',
      price: 42.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg'],
      category: 'Blusas Estampadas',
      rating: 4.6,
      reviews: 19
    }
  ],
  'calcas': [
    {
      id: '9',
      name: 'Calça Jeans Skinny',
      price: 79.90,
      originalPrice: 99.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg'],
      category: 'Calças',
      rating: 4.9,
      reviews: 31
    },
    {
      id: '10',
      name: 'Calça Social Preta',
      price: 89.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg'],
      category: 'Calças',
      rating: 4.6,
      reviews: 19
    }
  ],
  'camisetas': [
    {
      id: '11',
      name: 'Camiseta Básica Masculina',
      price: 29.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg'],
      category: 'Camisetas',
      rating: 4.4,
      reviews: 12
    },
    {
      id: '12',
      name: 'Camiseta Estampada',
      price: 34.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg'],
      category: 'Camisetas',
      rating: 4.5,
      reviews: 16
    }
  ],
  'calcas-jeans': [
    {
      id: '13',
      name: 'Calça Jeans Masculina',
      price: 89.90,
      originalPrice: 119.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg'],
      category: 'Calças Jeans',
      rating: 4.7,
      reviews: 25
    },
    {
      id: '14',
      name: 'Calça Jeans Slim',
      price: 79.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg'],
      category: 'Calças Jeans',
      rating: 4.6,
      reviews: 18
    }
  ],
  'meninas': [
    {
      id: '15',
      name: 'Vestido Infantil Floral',
      price: 49.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg'],
      category: 'Meninas',
      rating: 4.8,
      reviews: 8
    },
    {
      id: '16',
      name: 'Blusa Infantil Colorida',
      price: 29.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg'],
      category: 'Meninas',
      rating: 4.5,
      reviews: 6
    }
  ],
  'meninos': [
    {
      id: '17',
      name: 'Camiseta Infantil Masculina',
      price: 24.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg'],
      category: 'Meninos',
      rating: 4.6,
      reviews: 7
    },
    {
      id: '18',
      name: 'Calça Infantil Jeans',
      price: 39.90,
      images: ['https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg'],
      category: 'Meninos',
      rating: 4.7,
      reviews: 9
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    
    if (!categorySlug) {
      return NextResponse.json([])
    }
    
    // Retornar produtos da categoria específica ou array vazio
    const products = featuredProducts[categorySlug as keyof typeof featuredProducts] || []
    
    return NextResponse.json(products)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 