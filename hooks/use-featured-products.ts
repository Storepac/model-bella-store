import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: string
  categorySlug: string
  isFeatured?: boolean
  isOnSale?: boolean
}

export function useFeaturedProducts(categorySlug: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categorySlug) return
    setLoading(true)
    fetch(`/api/products?categorySlug=${categorySlug}&activeOnly=true&limit=3&featured=true`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao buscar produtos em destaque')
        setLoading(false)
      })
  }, [categorySlug])

  return { products, loading, error }
} 