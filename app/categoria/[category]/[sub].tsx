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
  images: string[]
  categoryId: string
  categorySlug: string
  isFeatured?: boolean
  isOnSale?: boolean
}

export default function SubcategoryPage() {
  const params = useParams() as { category: string; sub: string }
  const { category, sub } = params

  const [mainCategory, setMainCategory] = useState<Category | null>(null)
  const [subCategory, setSubCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Buscar categoria principal
        const mainRes = await fetch(`/api/categories?slug=${category}`)
        const mainData = mainRes.ok ? await mainRes.json() : null
        setMainCategory(mainData)

        // Buscar subcategoria
        let foundSub: Category | null = null
        if (mainData && mainData.subcategories) {
          foundSub = mainData.subcategories.find((s: Category) => s.slug === sub) || null
        }
        setSubCategory(foundSub)

        // Buscar produtos da subcategoria
        const prodRes = await fetch(`/api/products?categorySlug=${sub}&activeOnly=true&limit=40`)
        const prodData = prodRes.ok ? await prodRes.json() : { products: [] }
        setProducts(prodData.products || [])
      } catch (e) {
        setMainCategory(null)
        setSubCategory(null)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    if (category && sub) fetchData()
  }, [category, sub])

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

  if (!mainCategory || !subCategory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Categoria não encontrada</h1>
          <p className="text-gray-600">A categoria ou subcategoria que você está procurando não existe.</p>
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
              {subCategory.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              {subCategory.description}
            </p>
            <div className="mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {products.length} produtos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Header com Filtros e Ordenação */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {subCategory.name}
            </h2>
            <p className="text-gray-600">
              {products.length} produtos encontrados
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Botão de Filtros */}
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            
            {/* Ordenação */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  Ordenar por
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy('relevance')}>
                  Relevância
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-asc')}>
                  Menor Preço
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-desc')}>
                  Maior Preço
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('name')}>
                  Nome A-Z
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Modo de Visualização */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Grid de Produtos */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button className="w-full">
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 