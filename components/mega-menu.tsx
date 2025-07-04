import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useCategories } from '@/hooks/use-categories'
import { useFeaturedProducts } from '@/hooks/use-featured-products'

interface MegaMenuProps {
  categorySlug: string
  label: string
}

export function MegaMenu({ categorySlug, label }: MegaMenuProps) {
  const { categories, loading } = useCategories(true)
  const [open, setOpen] = useState(false)
  const [hoveredSub, setHoveredSub] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calcular hoveredSlug de forma segura, mesmo se category ainda não existir
  let hoveredSlug = ''
  let hoveredSubcat: any = null
  const category = categories.find(cat => cat.slug === categorySlug)
  if (category) {
    hoveredSubcat = category.subcategories?.find(s => s.id === hoveredSub)
    hoveredSlug = hoveredSubcat?.slug || ''
  }
  // O hook é chamado sempre, mesmo se hoveredSlug for vazio
  const { products: featuredProducts, loading: loadingFeatured } = useFeaturedProducts(hoveredSlug)

  if (loading) return (
    <span className="text-sm font-medium text-gray-400">{label}</span>
  )

  if (!category) return null

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setOpen(true), 100)
  }
  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setOpen(false)
      setHoveredSub(null)
    }, 180)
  }

  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="text-sm font-medium hover:text-pink-500 transition-colors px-2 py-1">
        {label}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 w-[700px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex p-6 gap-8">
          {/* Colunas de subcategorias */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex gap-8 flex-1">
              {category.subcategories.map((subcat) => (
                <div key={subcat.id} className="min-w-[140px]">
                  <h4
                    className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-pink-500"
                    onMouseEnter={() => setHoveredSub(subcat.id)}
                  >
                    {subcat.name}
                  </h4>
                  {subcat.subcategories && subcat.subcategories.length > 0 && (
                    <ul className="space-y-1">
                      {subcat.subcategories.map((subsub) => (
                        <li key={subsub.id}>
                          <Link href={`/categoria/${subsub.slug}`} className="text-gray-700 hover:text-pink-500 text-sm">
                            {subsub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link href={`/categoria/${subcat.slug}`} className="block mt-2 text-xs text-pink-600 hover:underline">
                    Ver tudo de {subcat.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
          {/* Espaço para produtos em destaque */}
          <div className="w-64 border-l pl-6 flex flex-col">
            <span className="font-semibold text-gray-900 mb-2">Destaques</span>
            <div className="flex-1 flex flex-col gap-2 justify-center items-center text-gray-700 text-sm">
              {hoveredSubcat ? (
                loadingFeatured ? (
                  <span className="text-gray-400">Carregando...</span>
                ) : featuredProducts.length > 0 ? (
                  featuredProducts.map(prod => (
                    <Link key={prod.id} href={`/produto/${prod.id}`} className="flex items-center gap-2 w-full hover:bg-gray-50 rounded p-2">
                      <div className="w-12 h-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
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
                  <span className="text-gray-400">Nenhum produto em destaque</span>
                )
              ) : (
                <span className="text-gray-400">Passe o mouse em uma subcategoria</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 