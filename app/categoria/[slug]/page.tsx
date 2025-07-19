"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Filter, Grid, List, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { resolveStoreIdClient } from '@/lib/store-id'

interface Category {
  id: string
  name: string
  description: string
  slug: string
  image: string
  productCount: number
  isActive: boolean
  order: number
  parentId: string | null
  level: number
  subcategories?: Category[]
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew?: boolean
  isSale?: boolean
  discount?: number
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [mainCategory, setMainCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [storeId, setStoreId] = useState<number | null>(null)

  // Função para buscar a categoria raiz (nível 0)
  async function fetchRootCategory(cat: Category, storeId: number): Promise<Category> {
    let current = cat
    while (current.parentId) {
      const resp = await fetch(`/api/categories?slug=${current.parentId}&storeId=${storeId}`)
      if (resp.ok) {
        current = await resp.json()
      } else {
        break
      }
    }
    return current
  }

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true)
      try {
        const resolvedStoreId = await resolveStoreIdClient()
        setStoreId(resolvedStoreId)
        
        const response = await fetch(`/api/categories?slug=${slug}&storeId=${resolvedStoreId}`)
        if (response.ok) {
          const data = await response.json()
          setCategory(data)

          // Buscar a categoria principal (nível 0)
          const root = await fetchRootCategory(data, resolvedStoreId)
          setMainCategory(root)

          // Buscar produtos reais da API para a categoria atual
          const prodResp = await fetch(`/api/products?categoryId=${data.id}&storeId=${resolvedStoreId}`)
          if (prodResp.ok) {
            const prodData = await prodResp.json()
            setProducts(prodData.products || [])
          } else {
            setProducts([])
          }
        }
      } catch (error) {
        console.error('Erro ao carregar categoria:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategory()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Categoria não encontrada</h1>
          <p className="text-gray-600">A categoria que você está procurando não existe.</p>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner da Categoria Principal */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-purple-50"></div>
        {mainCategory?.image && (
          <Image
            src={mainCategory.image}
            alt={mainCategory.name}
            fill
            className="object-cover opacity-20"
          />
        )}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">
              {mainCategory?.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              {mainCategory?.description}
            </p>
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {mainCategory?.productCount?.toLocaleString('pt-BR') || 0} produtos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Se houver subcategorias, mostra elas. Senão, mostra produtos */}
        {category?.subcategories && category.subcategories.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Subcategorias</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.subcategories.map((subcat) => (
                <Card key={subcat.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <Image
                      src={subcat.image}
                      alt={subcat.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{subcat.name}</h3>
                    <p className="text-gray-600 mb-2">{subcat.description}</p>
                    <Button asChild variant="outline" className="w-full">
                      <a href={`/categoria/${subcat.slug}`}>Ver {subcat.name}</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Produtos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-40">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-pink-600 font-bold mb-2">{formatPrice(product.price)}</p>
                    <Button variant="outline" className="w-full">Ver detalhes</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {products.length === 0 && (!category?.subcategories || category.subcategories.length === 0) ? (
          <div className="text-center text-gray-500 py-8">Nenhum produto encontrado para esta categoria.</div>
        ) : null}
      </div>
    </div>
  )
} 