import { useState, useEffect } from 'react'

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
  display: {
    showFilters: boolean
    showSorting: boolean
    defaultSort: string
    itemsPerPage: number
    showPagination: boolean
    showLoadMore: boolean
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  subcategories?: Category[]
}

export function useCategories(activeOnly: boolean = true) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/categories?activeOnly=${activeOnly}`)
        
        if (!response.ok) {
          throw new Error('Falha ao carregar categorias')
        }
        
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Erro ao buscar categorias:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [activeOnly])

  return { categories, loading, error }
} 