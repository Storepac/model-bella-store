"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useCategories } from "@/hooks/use-categories"
import { useFeaturedProducts } from '@/hooks/use-featured-products'

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

export function CategoryMenu() {
  const { categories, loading } = useCategories(true)

  if (loading) {
    return (
      <Button variant="ghost" disabled>
        Categorias...
      </Button>
    )
  }

  // Filtrar apenas categorias principais (nível 0)
  const mainCategories = categories.filter(cat => cat.level === 0)

  const renderCategoryItem = (category: Category) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0

    if (hasSubcategories) {
      return (
        <DropdownMenuSub key={category.id}>
          <DropdownMenuSubTrigger className="flex items-center justify-between">
            <span>{category.name}</span>
            <ChevronRight className="h-4 w-4" />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            {category.subcategories?.map((subcategory) => (
              <DropdownMenuItem key={subcategory.id} asChild>
                <Link href={`/categoria/${subcategory.slug}`} className="flex items-center justify-between">
                  <span>{subcategory.name}</span>
                  {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem key={category.id} asChild>
        <Link href={`/categoria/${category.slug}`}>
          <span>{category.name}</span>
        </Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          Categorias
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {mainCategories.map((category) => renderCategoryItem(category))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/categorias" className="text-center">
            Ver Todas as Categorias
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente para mobile (drawer/sheet)
export function CategoryMenuMobile() {
  const { categories, loading } = useCategories(true)
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  if (loading) {
    return <div className="p-4 text-center">Carregando categorias...</div>
  }

  // Filtrar apenas categorias principais (nível 0)
  const mainCategories = categories.filter(cat => cat.level === 0)

  const renderCategoryMobile = (category: Category, level: number = 0) => {
    const hasSubcategories = category.subcategories && category.subcategories.length > 0
    const isOpen = openCategories.includes(category.id)
    const indent = level * 16

    // Produtos em destaque para subcategorias de nível 1
    const { products: featuredProducts, loading: loadingFeatured } = useFeaturedProducts(category.slug)

    return (
      <div key={category.id}>
        <div 
          className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
          style={{ paddingLeft: `${12 + indent}px` }}
        >
          <Link 
            href={`/categoria/${category.slug}`}
            className="flex items-center flex-1"
          >
            <div className="flex-1">
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-gray-500">{category.productCount.toLocaleString('pt-BR')} produtos</div>
            </div>
          </Link>
          {hasSubcategories && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleCategory(category.id)}
              className="p-1"
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        {hasSubcategories && isOpen && (
          <div className="border-l border-gray-200 ml-4">
            {category.subcategories?.map((subcategory) => 
              renderCategoryMobile(subcategory, level + 1)
            )}
          </div>
        )}
        {/* Produtos em destaque para subcategorias de nível 1 */}
        {isOpen && !hasSubcategories && (
          <div className="pl-6 py-2">
            <div className="font-semibold text-gray-900 mb-1">Destaques</div>
            {loadingFeatured ? (
              <div className="text-gray-400 text-sm">Carregando...</div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(prod => (
                <Link key={prod.id} href={`/produto/${prod.id}`} className="flex items-center gap-2 py-1">
                  <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    {prod.images?.[0] && (
                      <img src={prod.images[0]} alt={prod.name} className="object-cover w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{prod.name}</div>
                    <div className="text-xs text-pink-600 font-bold">R$ {prod.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-gray-400 text-sm">Nenhum produto em destaque</div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="px-4 py-2 font-semibold text-gray-700 border-b">
        Categorias
      </div>
      {mainCategories.map((category) => renderCategoryMobile(category))}
    </div>
  )
} 