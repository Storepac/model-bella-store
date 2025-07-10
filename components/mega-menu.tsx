import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useCategories } from '@/hooks/use-categories'
import { useFeaturedProducts } from '@/hooks/use-featured-products'
import { usePathname } from 'next/navigation'

interface MegaMenuProps {
  categorySlug: string
  label: string
}

export function MegaMenu({ categorySlug, label }: MegaMenuProps) {
  const { categories, loading } = useCategories(true)
  const [open, setOpen] = useState(false)
  const [hoveredSub, setHoveredSub] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Detectar se está na demo
  const isDemo = pathname?.startsWith('/demo')
  const basePath = isDemo ? '/demo/categoria' : '/categoria'

  // Verificar se categories é um array antes de usar .find()
  const categoriesArray = Array.isArray(categories) ? categories : []
  
  // Calcular hoveredSlug de forma segura, mesmo se category ainda não existir
  let hoveredSlug = ''
  let hoveredSubcat: any = null
  const category = categoriesArray.find(cat => cat.slug === categorySlug)
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
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 w-[800px] max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex p-6 gap-8">
          {/* Colunas de subcategorias */}
          {category.subcategories && category.subcategories.length > 0 && (
            <div className="flex gap-8 flex-1">
              {category.subcategories.map((subcat) => (
                <div key={subcat.id} className="min-w-[160px]">
                  <h4
                    className="font-semibold text-gray-900 mb-3 cursor-pointer hover:text-pink-500 transition-colors"
                    onMouseEnter={() => setHoveredSub(subcat.id)}
                  >
                    {subcat.name}
                  </h4>
                  {subcat.subcategories && subcat.subcategories.length > 0 && (
                    <ul className="space-y-2">
                      {subcat.subcategories.map((subsub) => (
                        <li key={subsub.id}>
                          <Link 
                            href={`${basePath}/${subsub.slug}`} 
                            className="text-gray-700 hover:text-pink-500 text-sm transition-colors block py-1"
                          >
                            {subsub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link 
                    href={`${basePath}/${subcat.slug}`} 
                    className="block mt-3 text-xs text-pink-600 hover:text-pink-700 hover:underline font-medium"
                  >
                    Ver tudo de {subcat.name} →
                  </Link>
                </div>
              ))}
            </div>
          )}
          {/* Espaço para produtos em destaque */}
          <div className="w-72 border-l border-gray-100 pl-6 flex flex-col">
            <span className="font-semibold text-gray-900 mb-3 text-sm">Destaques</span>
            <div className="flex-1 flex flex-col gap-3 justify-center items-center text-gray-700 text-sm">
              {hoveredSubcat ? (
                loadingFeatured ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                  </div>
                ) : featuredProducts.length > 0 ? (
                  featuredProducts.slice(0, 3).map(prod => (
                    <Link 
                      key={prod.id} 
                      href={`${isDemo ? '/demo/produto' : '/produto'}/${prod.id}`} 
                      className="flex items-center gap-3 w-full hover:bg-gray-50 rounded-lg p-3 transition-colors group"
                    >
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {prod.images?.[0] ? (
                          <img 
                            src={prod.images[0]} 
                            alt={prod.name} 
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">IMG</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate text-sm">{prod.name}</div>
                        <div className="text-xs text-pink-600 font-bold mt-1">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-20 text-gray-400">
                    <span className="text-sm">Nenhum produto em destaque</span>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-20 text-gray-400">
                  <span className="text-sm">Passe o mouse em uma subcategoria</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 