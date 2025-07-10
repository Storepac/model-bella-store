import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  rating: number
  reviews: number
}

// Dados mockados para demos
const demoFeaturedProducts: Record<string, Product[]> = {
  "vestidos": [
    {
      id: "1",
      name: "Vestido Floral Elegante",
      price: 89.90,
      originalPrice: 129.90,
      images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300"],
      category: "vestidos",
      rating: 4.8,
      reviews: 24
    },
    {
      id: "2",
      name: "Vestido Longo de Festa",
      price: 159.90,
      originalPrice: 199.90,
      images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300"],
      category: "vestidos",
      rating: 4.9,
      reviews: 18
    },
    {
      id: "3",
      name: "Vestido Casual Estampado",
      price: 69.90,
      images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300"],
      category: "vestidos",
      rating: 4.6,
      reviews: 31
    }
  ],
  "blusas": [
    {
      id: "4",
      name: "Blusa de Seda Premium",
      price: 79.90,
      originalPrice: 99.90,
      images: ["https://images.unsplash.com/photo-1564257631407-3deb25e9c8e0?w=300"],
      category: "blusas",
      rating: 4.7,
      reviews: 22
    },
    {
      id: "5",
      name: "Blusa Casual Básica",
      price: 49.90,
      images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300"],
      category: "blusas",
      rating: 4.5,
      reviews: 45
    }
  ],
  "calcas": [
    {
      id: "6",
      name: "Calça Jeans Skinny",
      price: 89.90,
      originalPrice: 119.90,
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=300"],
      category: "calcas",
      rating: 4.8,
      reviews: 67
    },
    {
      id: "7",
      name: "Calça Social Elegante",
      price: 129.90,
      images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300"],
      category: "calcas",
      rating: 4.9,
      reviews: 28
    }
  ],
  "camisetas": [
    {
      id: "8",
      name: "Camiseta Básica Masculina",
      price: 39.90,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"],
      category: "camisetas",
      rating: 4.6,
      reviews: 89
    },
    {
      id: "9",
      name: "Camiseta Estampada",
      price: 49.90,
      originalPrice: 59.90,
      images: ["https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300"],
      category: "camisetas",
      rating: 4.7,
      reviews: 56
    }
  ],
  "meninas": [
    {
      id: "10",
      name: "Vestido Infantil Floral",
      price: 59.90,
      originalPrice: 79.90,
      images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300"],
      category: "meninas",
      rating: 4.8,
      reviews: 34
    }
  ],
  "meninos": [
    {
      id: "11",
      name: "Camiseta Infantil Super-Herói",
      price: 39.90,
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"],
      category: "meninos",
      rating: 4.9,
      reviews: 42
    }
  ]
}

// Dados mockados para demo2 (eletrônicos)
const demo2FeaturedProducts: Record<string, Product[]> = {
  "smartphones": [
    {
      id: "1",
      name: "iPhone 15 Pro Max",
      price: 8999.90,
      originalPrice: 9999.90,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"],
      category: "smartphones",
      rating: 4.9,
      reviews: 156
    },
    {
      id: "2",
      name: "Samsung Galaxy S24 Ultra",
      price: 7999.90,
      originalPrice: 8999.90,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"],
      category: "smartphones",
      rating: 4.8,
      reviews: 89
    }
  ],
  "notebooks": [
    {
      id: "3",
      name: "MacBook Air M2",
      price: 7999.90,
      originalPrice: 8999.90,
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300"],
      category: "notebooks",
      rating: 4.8,
      reviews: 89
    },
    {
      id: "4",
      name: "Dell XPS 13",
      price: 6999.90,
      originalPrice: 7999.90,
      images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300"],
      category: "notebooks",
      rating: 4.7,
      reviews: 67
    }
  ],
  "fones": [
    {
      id: "5",
      name: "AirPods Pro 2",
      price: 1899.90,
      originalPrice: 2299.90,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"],
      category: "fones",
      rating: 4.7,
      reviews: 234
    },
    {
      id: "6",
      name: "Sony WH-1000XM5",
      price: 2499.90,
      originalPrice: 2999.90,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300"],
      category: "fones",
      rating: 4.9,
      reviews: 178
    }
  ],
  "iphone": [
    {
      id: "7",
      name: "iPhone 15 Pro",
      price: 7999.90,
      originalPrice: 8999.90,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"],
      category: "iphone",
      rating: 4.9,
      reviews: 123
    }
  ],
  "samsung": [
    {
      id: "8",
      name: "Samsung Galaxy S24",
      price: 5999.90,
      originalPrice: 6999.90,
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300"],
      category: "samsung",
      rating: 4.8,
      reviews: 95
    }
  ]
}

export function useFeaturedProducts(categorySlug: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Detectar se está na demo
  const isDemo = pathname?.startsWith('/demo')
  const isDemo2 = pathname?.startsWith('/demo2')

  useEffect(() => {
    if (!categorySlug) {
      setProducts([])
      setLoading(false)
      return
    }
    
    setLoading(true)
    setError(null)
    
    // Se está na demo, usar dados mockados
    if (isDemo || isDemo2) {
      const demoData = isDemo2 ? demo2FeaturedProducts : demoFeaturedProducts
      const demoProducts = demoData[categorySlug] || []
      setProducts(demoProducts)
      setLoading(false)
      return
    }
    
    // Se não está na demo, buscar dados reais
    fetch(`/api/featured-products?category=${categorySlug}`)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError('Erro ao buscar produtos em destaque')
        setLoading(false)
      })
  }, [categorySlug, isDemo, isDemo2])

  return { products, loading, error }
} 