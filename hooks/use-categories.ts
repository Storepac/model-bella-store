import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

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

// Dados mockados para demos
const demoCategories: Category[] = [
  {
    id: "1",
    name: "Feminino",
    description: "Moda feminina com as melhores tendências",
    slug: "feminino",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    productCount: 45,
    isActive: true,
    order: 1,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "newest",
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: "Moda Feminina - Bella Store",
      description: "Descubra as melhores peças femininas",
      keywords: ["moda", "feminina", "roupas", "mulher"]
    },
    subcategories: [
      {
        id: "1-1",
        name: "Vestidos",
        description: "Vestidos elegantes para todas as ocasiões",
        slug: "vestidos",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        productCount: 15,
        isActive: true,
        order: 1,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Vestidos Femininos",
          description: "Vestidos elegantes e modernos",
          keywords: ["vestidos", "feminino", "elegante"]
        },
        subcategories: [
          {
            id: "1-1-1",
            name: "Vestidos de Festa",
            description: "Vestidos especiais para festas",
            slug: "vestidos-festa",
            image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
            productCount: 8,
            isActive: true,
            order: 1,
            parentId: "1-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "newest",
              itemsPerPage: 12,
              showPagination: true,
              showLoadMore: false
            },
            seo: {
              title: "Vestidos de Festa",
              description: "Vestidos elegantes para festas",
              keywords: ["vestidos", "festa", "elegante"]
            }
          },
          {
            id: "1-1-2",
            name: "Vestidos Casuais",
            description: "Vestidos confortáveis para o dia a dia",
            slug: "vestidos-casuais",
            image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400",
            productCount: 7,
            isActive: true,
            order: 2,
            parentId: "1-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "newest",
              itemsPerPage: 12,
              showPagination: true,
              showLoadMore: false
            },
            seo: {
              title: "Vestidos Casuais",
              description: "Vestidos confortáveis para o dia a dia",
              keywords: ["vestidos", "casual", "confortável"]
            }
          }
        ]
      },
      {
        id: "1-2",
        name: "Blusas",
        description: "Blusas femininas para todos os estilos",
        slug: "blusas",
        image: "https://images.unsplash.com/photo-1564257631407-3deb25e9c8e0?w=400",
        productCount: 12,
        isActive: true,
        order: 2,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Blusas Femininas",
          description: "Blusas elegantes e confortáveis",
          keywords: ["blusas", "feminino", "elegante"]
        }
      },
      {
        id: "1-3",
        name: "Calças",
        description: "Calças femininas para todos os momentos",
        slug: "calcas",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        productCount: 18,
        isActive: true,
        order: 3,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Calças Femininas",
          description: "Calças elegantes e confortáveis",
          keywords: ["calças", "feminino", "elegante"]
        }
      }
    ]
  },
  {
    id: "2",
    name: "Masculino",
    description: "Moda masculina com estilo e qualidade",
    slug: "masculino",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    productCount: 32,
    isActive: true,
    order: 2,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "newest",
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: "Moda Masculina - Bella Store",
      description: "Descubra as melhores peças masculinas",
      keywords: ["moda", "masculina", "roupas", "homem"]
    },
    subcategories: [
      {
        id: "2-1",
        name: "Camisetas",
        description: "Camisetas masculinas para todos os estilos",
        slug: "camisetas",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        productCount: 20,
        isActive: true,
        order: 1,
        parentId: "2",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Camisetas Masculinas",
          description: "Camisetas confortáveis e estilosas",
          keywords: ["camisetas", "masculino", "confortável"]
        }
      },
      {
        id: "2-2",
        name: "Calças",
        description: "Calças masculinas para todos os momentos",
        slug: "calcas-masculino",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        productCount: 12,
        isActive: true,
        order: 2,
        parentId: "2",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Calças Masculinas",
          description: "Calças elegantes e confortáveis",
          keywords: ["calças", "masculino", "elegante"]
        }
      }
    ]
  },
  {
    id: "3",
    name: "Infantil",
    description: "Moda infantil colorida e divertida",
    slug: "infantil",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
    productCount: 28,
    isActive: true,
    order: 3,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "newest",
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: "Moda Infantil - Bella Store",
      description: "Roupas infantis coloridas e confortáveis",
      keywords: ["moda", "infantil", "roupas", "criança"]
    },
    subcategories: [
      {
        id: "3-1",
        name: "Meninas",
        description: "Roupas infantis para meninas",
        slug: "meninas",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
        productCount: 15,
        isActive: true,
        order: 1,
        parentId: "3",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Roupas Infantis Meninas",
          description: "Roupas coloridas para meninas",
          keywords: ["infantil", "meninas", "colorido"]
        }
      },
      {
        id: "3-2",
        name: "Meninos",
        description: "Roupas infantis para meninos",
        slug: "meninos",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        productCount: 13,
        isActive: true,
        order: 2,
        parentId: "3",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Roupas Infantis Meninos",
          description: "Roupas confortáveis para meninos",
          keywords: ["infantil", "meninos", "confortável"]
        }
      }
    ]
  }
]

// Dados mockados para demo2 (eletrônicos)
const demo2Categories: Category[] = [
  {
    id: "1",
    name: "Smartphones",
    description: "Os melhores smartphones do mercado",
    slug: "smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    productCount: 25,
    isActive: true,
    order: 1,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "newest",
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: "Smartphones - TechStore",
      description: "Os melhores smartphones do mercado",
      keywords: ["smartphones", "celulares", "iphone", "samsung"]
    },
    subcategories: [
      {
        id: "1-1",
        name: "iPhone",
        description: "Smartphones Apple",
        slug: "iphone",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        productCount: 8,
        isActive: true,
        order: 1,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "iPhone - TechStore",
          description: "Smartphones Apple iPhone",
          keywords: ["iphone", "apple", "smartphone"]
        }
      },
      {
        id: "1-2",
        name: "Samsung",
        description: "Smartphones Samsung",
        slug: "samsung",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        productCount: 12,
        isActive: true,
        order: 2,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "newest",
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: "Samsung - TechStore",
          description: "Smartphones Samsung",
          keywords: ["samsung", "smartphone", "android"]
        }
      }
    ]
  },
  {
    id: "2",
    name: "Notebooks",
    description: "Notebooks para trabalho e lazer",
    slug: "notebooks",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    productCount: 18,
    isActive: true,
    order: 2,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "newest",
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: "Notebooks - TechStore",
      description: "Notebooks para trabalho e lazer",
      keywords: ["notebooks", "laptops", "computadores"]
    }
  },
  {
    id: "3",
    name: "Fones de Ouvido",
    description: "Fones wireless e com fio",
    slug: "fones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    productCount: 32,
    isActive: true,
    order: 3,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "newest",
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: "Fones de Ouvido - TechStore",
      description: "Fones wireless e com fio",
      keywords: ["fones", "headphones", "airpods", "wireless"]
    }
  }
]

export function useCategories(activeOnly: boolean = true) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Detectar se está na demo
  const isDemo = pathname?.startsWith('/demo')
  const isDemo2 = pathname?.startsWith('/demo2')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Se está na demo, usar dados mockados
        if (isDemo || isDemo2) {
          const demoData = isDemo2 ? demo2Categories : demoCategories
          const filteredCategories = activeOnly 
            ? demoData.filter(cat => cat.isActive)
            : demoData
          setCategories(filteredCategories)
          setLoading(false)
          return
        }
        
        // Se não está na demo, buscar dados reais
        const response = await fetch(`/api/categories?activeOnly=${activeOnly}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar categorias'
        setError(errorMessage)
        console.error('Erro ao buscar categorias:', err)
        
        // Se for erro de conexão, tentar novamente em 5 segundos
        if (errorMessage.includes('ECONNREFUSED') || errorMessage.includes('Failed to fetch')) {
          setTimeout(() => {
            fetchCategories()
          }, 5000)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [activeOnly, isDemo, isDemo2])

  return { categories, loading, error }
} 