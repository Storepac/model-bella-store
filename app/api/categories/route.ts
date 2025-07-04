import { NextRequest, NextResponse } from 'next/server'

// Mock data baseado na Zattini - em produção isso viria do banco de dados
let categories = [
  {
    id: "1",
    name: "Feminino",
    description: "Moda feminina completa: roupas, calçados e acessórios",
    slug: "feminino",
    image: "/api/images?filename=img_22.jpg",
    productCount: 15420,
    isActive: true,
    order: 1,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "relevance",
      itemsPerPage: 24,
      showPagination: true,
      showLoadMore: true
    },
    seo: {
      title: "Moda Feminina - Bella Store",
      description: "Descubra nossa coleção completa de moda feminina: roupas, calçados e acessórios",
      keywords: ["moda feminina", "roupas femininas", "calçados femininos", "acessórios femininos"]
    },
    subcategories: [
      {
        id: "1-1",
        name: "Roupas",
        description: "Vestidos, blusas, calças e mais",
        slug: "roupas-femininas",
        image: "/api/images?filename=img_23.jpg",
        productCount: 8230,
        isActive: true,
        order: 1,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "relevance",
          itemsPerPage: 24,
          showPagination: true,
          showLoadMore: true
        },
        seo: {
          title: "Roupas Femininas - Bella Store",
          description: "Vestidos, blusas, calças e mais para mulheres",
          keywords: ["roupas femininas", "vestidos", "blusas", "calças"]
        },
        subcategories: [
          {
            id: "1-1-1",
            name: "Vestidos",
            description: "Vestidos para todas as ocasiões",
            slug: "vestidos",
            image: "/api/images?filename=IMG-20250703-WA0105.jpg",
            productCount: 1240,
            isActive: true,
            order: 1,
            parentId: "1-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Vestidos Femininos - Bella Store",
              description: "Vestidos elegantes e casuais para todas as ocasiões",
              keywords: ["vestidos", "vestidos femininos", "vestidos de festa"]
            }
          },
          {
            id: "1-1-2",
            name: "Blusas",
            description: "Blusas e camisetas femininas",
            slug: "blusas",
            image: "/api/images?filename=IMG-20250703-WA0103.jpg",
            productCount: 980,
            isActive: true,
            order: 2,
            parentId: "1-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Blusas Femininas - Bella Store",
              description: "Blusas e camisetas para o dia a dia",
              keywords: ["blusas", "camisetas", "blusas femininas"]
            }
          },
          {
            id: "1-1-3",
            name: "Calças",
            description: "Calças jeans, sociais e mais",
            slug: "calcas-femininas",
            image: "/api/images?filename=IMG-20250703-WA0104.jpg",
            productCount: 1560,
            isActive: true,
            order: 3,
            parentId: "1-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Calças Femininas - Bella Store",
              description: "Calças jeans, sociais e mais para mulheres",
              keywords: ["calças", "calças femininas", "jeans feminino"]
            }
          },
          {
            id: "1-1-4",
            name: "Saias",
            description: "Saias para todas as ocasiões",
            slug: "saias",
            image: "/api/images?filename=IMG-20250703-WA0102.jpg",
            productCount: 720,
            isActive: true,
            order: 4,
            parentId: "1-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Saias Femininas - Bella Store",
              description: "Saias elegantes e casuais",
              keywords: ["saias", "saias femininas", "saias de festa"]
            }
          }
        ]
      },
      {
        id: "1-2",
        name: "Calçados",
        description: "Sapatos, tênis e sandálias",
        slug: "calcados-femininos",
        image: "/api/images?filename=IMG-20250703-WA0099.jpg",
        productCount: 4560,
        isActive: true,
        order: 2,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "relevance",
          itemsPerPage: 24,
          showPagination: true,
          showLoadMore: true
        },
        seo: {
          title: "Calçados Femininos - Bella Store",
          description: "Sapatos, tênis e sandálias para mulheres",
          keywords: ["calçados femininos", "sapatos", "tênis", "sandálias"]
        },
        subcategories: [
          {
            id: "1-2-1",
            name: "Sapatos",
            description: "Sapatos sociais e casuais",
            slug: "sapatos-femininos",
            image: "/api/images?filename=IMG-20250703-WA0101.jpg",
            productCount: 890,
            isActive: true,
            order: 1,
            parentId: "1-2",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Sapatos Femininos - Bella Store",
              description: "Sapatos sociais e casuais para mulheres",
              keywords: ["sapatos", "sapatos femininos", "sapatos sociais"]
            }
          },
          {
            id: "1-2-2",
            name: "Tênis",
            description: "Tênis esportivos e casuais",
            slug: "tenis-femininos",
            image: "/api/images?filename=IMG-20250703-WA0100.jpg",
            productCount: 1240,
            isActive: true,
            order: 2,
            parentId: "1-2",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Tênis Femininos - Bella Store",
              description: "Tênis esportivos e casuais para mulheres",
              keywords: ["tênis", "tênis femininos", "tênis esportivos"]
            }
          },
          {
            id: "1-2-3",
            name: "Sandálias",
            description: "Sandálias e rasteirinhas",
            slug: "sandalias-femininas",
            image: "/api/images?filename=IMG-20250703-WA0098.jpg",
            productCount: 980,
            isActive: true,
            order: 3,
            parentId: "1-2",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Sandálias Femininas - Bella Store",
              description: "Sandálias e rasteirinhas para mulheres",
              keywords: ["sandálias", "sandálias femininas", "rasteirinhas"]
            }
          }
        ]
      },
      {
        id: "1-3",
        name: "Acessórios",
        description: "Bolsas, bijuterias e mais",
        slug: "acessorios-femininos",
        image: "/api/images?filename=IMG-20250703-WA0097.jpg",
        productCount: 2630,
        isActive: true,
        order: 3,
        parentId: "1",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "relevance",
          itemsPerPage: 24,
          showPagination: true,
          showLoadMore: true
        },
        seo: {
          title: "Acessórios Femininos - Bella Store",
          description: "Bolsas, bijuterias e acessórios para mulheres",
          keywords: ["acessórios femininos", "bolsas", "bijuterias"]
        },
        subcategories: [
          {
            id: "1-3-1",
            name: "Bolsas",
            description: "Bolsas e mochilas",
            slug: "bolsas-femininas",
            image: "/api/images?filename=IMG-20250703-WA0096.jpg",
            productCount: 760,
            isActive: true,
            order: 1,
            parentId: "1-3",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Bolsas Femininas - Bella Store",
              description: "Bolsas e mochilas para mulheres",
              keywords: ["bolsas", "bolsas femininas", "mochilas"]
            }
          },
          {
            id: "1-3-2",
            name: "Bijuterias",
            description: "Colares, pulseiras e anéis",
            slug: "bijuterias-femininas",
            image: "/api/images?filename=IMG-20250703-WA0095.jpg",
            productCount: 890,
            isActive: true,
            order: 2,
            parentId: "1-3",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Bijuterias Femininas - Bella Store",
              description: "Colares, pulseiras e anéis para mulheres",
              keywords: ["bijuterias", "colares", "pulseiras", "anéis"]
            }
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Masculino",
    description: "Moda masculina completa: roupas, calçados e acessórios",
    slug: "masculino",
    image: "/api/images?filename=IMG-20250703-WA0094.jpg",
    productCount: 9870,
    isActive: true,
    order: 2,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "relevance",
      itemsPerPage: 24,
      showPagination: true,
      showLoadMore: true
    },
    seo: {
      title: "Moda Masculina - Bella Store",
      description: "Descubra nossa coleção completa de moda masculina",
      keywords: ["moda masculina", "roupas masculinas", "calçados masculinos"]
    },
    subcategories: [
      {
        id: "2-1",
        name: "Roupas",
        description: "Camisetas, calças, camisas e mais",
        slug: "roupas-masculinas",
        image: "/api/images?filename=IMG-20250703-WA0093.jpg",
        productCount: 5430,
        isActive: true,
        order: 1,
        parentId: "2",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "relevance",
          itemsPerPage: 24,
          showPagination: true,
          showLoadMore: true
        },
        seo: {
          title: "Roupas Masculinas - Bella Store",
          description: "Camisetas, calças, camisas e mais para homens",
          keywords: ["roupas masculinas", "camisetas", "calças", "camisas"]
        },
        subcategories: [
          {
            id: "2-1-1",
            name: "Camisetas",
            description: "Camisetas básicas e estampadas",
            slug: "camisetas-masculinas",
            image: "/api/images?filename=IMG-20250703-WA0092.jpg",
            productCount: 1240,
            isActive: true,
            order: 1,
            parentId: "2-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Camisetas Masculinas - Bella Store",
              description: "Camisetas básicas e estampadas para homens",
              keywords: ["camisetas", "camisetas masculinas", "camisetas básicas"]
            }
          },
          {
            id: "2-1-2",
            name: "Calças",
            description: "Calças jeans e sociais",
            slug: "calcas-masculinas",
            image: "/api/images?filename=IMG-20250703-WA0091.jpg",
            productCount: 980,
            isActive: true,
            order: 2,
            parentId: "2-1",
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: "relevance",
              itemsPerPage: 24,
              showPagination: true,
              showLoadMore: true
            },
            seo: {
              title: "Calças Masculinas - Bella Store",
              description: "Calças jeans e sociais para homens",
              keywords: ["calças", "calças masculinas", "jeans masculino"]
            }
          }
        ]
      },
      {
        id: "2-2",
        name: "Calçados",
        description: "Tênis, sapatos e sandálias",
        slug: "calcados-masculinos",
        image: "/api/images?filename=IMG-20250703-WA0090.jpg",
        productCount: 2340,
        isActive: true,
        order: 2,
        parentId: "2",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "relevance",
          itemsPerPage: 24,
          showPagination: true,
          showLoadMore: true
        },
        seo: {
          title: "Calçados Masculinos - Bella Store",
          description: "Tênis, sapatos e sandálias para homens",
          keywords: ["calçados masculinos", "tênis", "sapatos"]
        }
      }
    ]
  },
  {
    id: "3",
    name: "Infantil",
    description: "Moda infantil para meninos e meninas",
    slug: "infantil",
    image: "/api/images?filename=IMG-20250703-WA0089.jpg",
    productCount: 5430,
    isActive: true,
    order: 3,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "relevance",
      itemsPerPage: 24,
      showPagination: true,
      showLoadMore: true
    },
    seo: {
      title: "Moda Infantil - Bella Store",
      description: "Moda infantil para meninos e meninas",
      keywords: ["moda infantil", "roupas infantis", "calçados infantis"]
    },
    subcategories: [
      {
        id: "3-1",
        name: "Meninas",
        description: "Roupas e calçados para meninas",
        slug: "meninas",
        image: "/api/images?filename=IMG-20250703-WA0088.jpg",
        productCount: 2870,
        isActive: true,
        order: 1,
        parentId: "3",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "relevance",
          itemsPerPage: 24,
          showPagination: true,
          showLoadMore: true
        },
        seo: {
          title: "Moda Infantil Meninas - Bella Store",
          description: "Roupas e calçados para meninas",
          keywords: ["moda infantil", "meninas", "roupas meninas"]
        }
      },
      {
        id: "3-2",
        name: "Meninos",
        description: "Roupas e calçados para meninos",
        slug: "meninos",
        image: "/api/images?filename=IMG-20250703-WA0086.jpg",
        productCount: 2560,
        isActive: true,
        order: 2,
        parentId: "3",
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: "relevance",
          itemsPerPage: 24,
          showPagination: true,
          showLoadMore: true
        },
        seo: {
          title: "Moda Infantil Meninos - Bella Store",
          description: "Roupas e calçados para meninos",
          keywords: ["moda infantil", "meninos", "roupas meninos"]
        }
      }
    ]
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const activeOnly = searchParams.get('activeOnly') === 'true'

  try {
    if (slug) {
      // Buscar categoria específica por slug
      const findCategoryBySlug = (cats: any[], targetSlug: string): any => {
        for (const cat of cats) {
          if (cat.slug === targetSlug) return cat
          if (cat.subcategories) {
            const found = findCategoryBySlug(cat.subcategories, targetSlug)
            if (found) return found
          }
        }
        return null
      }
      
      const category = findCategoryBySlug(categories, slug)
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      
      return NextResponse.json(category)
    }

    // Retornar todas as categorias
    let result = categories
    
    if (activeOnly) {
      const filterActiveCategories = (cats: any[]): any[] => {
        return cats
          .filter(cat => cat.isActive)
          .map(cat => ({
            ...cat,
            subcategories: cat.subcategories ? filterActiveCategories(cat.subcategories) : []
          }))
      }
      result = filterActiveCategories(categories)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCategory = {
      id: Date.now().toString(),
      ...body,
      slug: body.name.toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
      isActive: true,
      order: categories.length + 1,
      subcategories: []
    }

    if (body.parentId) {
      // Adicionar como subcategoria
      const addSubcategoryToParent = (cats: any[], parentId: string, newSubcategory: any): any[] => {
        return cats.map(cat => {
          if (cat.id === parentId) {
            return {
              ...cat,
              subcategories: [...(cat.subcategories || []), newSubcategory]
            }
          }
          if (cat.subcategories) {
            return {
              ...cat,
              subcategories: addSubcategoryToParent(cat.subcategories, parentId, newSubcategory)
            }
          }
          return cat
        })
      }
      categories = addSubcategoryToParent(categories, body.parentId, newCategory)
    } else {
      // Adicionar como categoria principal
      categories.push(newCategory)
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const updateCategoryInTree = (cats: any[], targetId: string, updatedCategory: any): any[] => {
      return cats.map(cat => {
        if (cat.id === targetId) {
          return { ...cat, ...updatedCategory }
        }
        if (cat.subcategories) {
          return {
            ...cat,
            subcategories: updateCategoryInTree(cat.subcategories, targetId, updatedCategory)
          }
        }
        return cat
      })
    }

    categories = updateCategoryInTree(categories, id, updateData)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const removeCategoryAndChildren = (cats: any[], targetId: string): any[] => {
      return cats.filter(cat => {
        if (cat.id === targetId) return false
        if (cat.subcategories) {
          cat.subcategories = removeCategoryAndChildren(cat.subcategories, targetId)
        }
        return true
      })
    }

    categories = removeCategoryAndChildren(categories, id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 