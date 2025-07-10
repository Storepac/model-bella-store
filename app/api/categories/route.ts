import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock completos para demonstrar todas as funcionalidades
const mockCategories = [
  {
    id: '1',
    name: 'Feminino',
    description: 'Moda feminina completa',
    slug: 'feminino',
    image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg',
    productCount: 45,
    isActive: true,
    order: 1,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: 'name',
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: 'Moda Feminina',
      description: 'Encontre as melhores roupas femininas',
      keywords: ['moda', 'feminina', 'roupas', 'mulher']
    },
    subcategories: [
      {
        id: '2',
        name: 'Vestidos',
        description: 'Vestidos femininos elegantes',
        slug: 'vestidos',
        image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg',
        productCount: 12,
        isActive: true,
        order: 1,
        parentId: '1',
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: 'name',
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: 'Vestidos Femininos',
          description: 'Vestidos elegantes para todas as ocasiões',
          keywords: ['vestidos', 'femininos', 'elegantes']
        },
        subcategories: [
          {
            id: '3',
            name: 'Vestidos de Festa',
            description: 'Vestidos especiais para eventos',
            slug: 'vestidos-festa',
            image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg',
            productCount: 5,
            isActive: true,
            order: 1,
            parentId: '2',
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: 'name',
              itemsPerPage: 12,
              showPagination: true,
              showLoadMore: false
            },
            seo: {
              title: 'Vestidos de Festa',
              description: 'Vestidos especiais para eventos e festas',
              keywords: ['vestidos', 'festa', 'eventos', 'especiais']
            },
            subcategories: [
              {
                id: '4',
                name: 'Vestidos Longos',
                description: 'Vestidos longos elegantes',
                slug: 'vestidos-longos',
                image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg',
                productCount: 3,
                isActive: true,
                order: 1,
                parentId: '3',
                level: 3,
                display: {
                  showFilters: true,
                  showSorting: true,
                  defaultSort: 'name',
                  itemsPerPage: 12,
                  showPagination: true,
                  showLoadMore: false
                },
                seo: {
                  title: 'Vestidos Longos',
                  description: 'Vestidos longos para ocasiões especiais',
                  keywords: ['vestidos', 'longos', 'elegantes']
                },
                subcategories: []
              },
              {
                id: '5',
                name: 'Vestidos Curtos',
                description: 'Vestidos curtos modernos',
                slug: 'vestidos-curtos',
                image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg',
                productCount: 2,
                isActive: true,
                order: 2,
                parentId: '3',
                level: 3,
                display: {
                  showFilters: true,
                  showSorting: true,
                  defaultSort: 'name',
                  itemsPerPage: 12,
                  showPagination: true,
                  showLoadMore: false
                },
                seo: {
                  title: 'Vestidos Curtos',
                  description: 'Vestidos curtos para festas e eventos',
                  keywords: ['vestidos', 'curtos', 'modernos']
                },
                subcategories: []
              }
            ]
          },
          {
            id: '6',
            name: 'Vestidos Casuais',
            description: 'Vestidos para o dia a dia',
            slug: 'vestidos-casuais',
            image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg',
            productCount: 7,
            isActive: true,
            order: 2,
            parentId: '2',
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: 'name',
              itemsPerPage: 12,
              showPagination: true,
              showLoadMore: false
            },
            seo: {
              title: 'Vestidos Casuais',
              description: 'Vestidos confortáveis para o dia a dia',
              keywords: ['vestidos', 'casuais', 'confortáveis']
            },
            subcategories: []
          }
        ]
      },
      {
        id: '7',
        name: 'Blusas',
        description: 'Blusas femininas confortáveis',
        slug: 'blusas',
        image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg',
        productCount: 8,
        isActive: true,
        order: 2,
        parentId: '1',
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: 'name',
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: 'Blusas Femininas',
          description: 'Blusas confortáveis e estilosas',
          keywords: ['blusas', 'femininas', 'confortáveis']
        },
        subcategories: [
          {
            id: '8',
            name: 'Blusas Básicas',
            description: 'Blusas básicas para combinar',
            slug: 'blusas-basicas',
            image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg',
            productCount: 4,
            isActive: true,
            order: 1,
            parentId: '7',
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: 'name',
              itemsPerPage: 12,
              showPagination: true,
              showLoadMore: false
            },
            seo: {
              title: 'Blusas Básicas',
              description: 'Blusas básicas para combinar com tudo',
              keywords: ['blusas', 'básicas', 'combinar']
            },
            subcategories: []
          },
          {
            id: '9',
            name: 'Blusas Estampadas',
            description: 'Blusas com estampas divertidas',
            slug: 'blusas-estampadas',
            image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg',
            productCount: 4,
            isActive: true,
            order: 2,
            parentId: '7',
            level: 2,
            display: {
              showFilters: true,
              showSorting: true,
              defaultSort: 'name',
              itemsPerPage: 12,
              showPagination: true,
              showLoadMore: false
            },
            seo: {
              title: 'Blusas Estampadas',
              description: 'Blusas com estampas divertidas e coloridas',
              keywords: ['blusas', 'estampadas', 'coloridas']
            },
            subcategories: []
          }
        ]
      },
      {
        id: '10',
        name: 'Calças',
        description: 'Calças femininas estilosas',
        slug: 'calcas',
        image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg',
        productCount: 15,
        isActive: true,
        order: 3,
        parentId: '1',
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: 'name',
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: 'Calças Femininas',
          description: 'Calças confortáveis para todos os estilos',
          keywords: ['calças', 'femininas', 'confortáveis']
        },
        subcategories: []
      }
    ]
  },
  {
    id: '11',
    name: 'Masculino',
    description: 'Moda masculina completa',
    slug: 'masculino',
    image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg',
    productCount: 32,
    isActive: true,
    order: 2,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: 'name',
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: 'Moda Masculina',
      description: 'Encontre as melhores roupas masculinas',
      keywords: ['moda', 'masculina', 'roupas', 'homem']
    },
    subcategories: [
      {
        id: '12',
        name: 'Camisetas',
        description: 'Camisetas masculinas confortáveis',
        slug: 'camisetas',
        image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg',
        productCount: 10,
        isActive: true,
        order: 1,
        parentId: '11',
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: 'name',
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: 'Camisetas Masculinas',
          description: 'Camisetas confortáveis para homens',
          keywords: ['camisetas', 'masculinas', 'confortáveis']
        },
        subcategories: []
      },
      {
        id: '13',
        name: 'Calças Jeans',
        description: 'Calças jeans masculinas',
        slug: 'calcas-jeans',
        image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg',
        productCount: 8,
        isActive: true,
        order: 2,
        parentId: '11',
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: 'name',
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: 'Calças Jeans Masculinas',
          description: 'Calças jeans para homens',
          keywords: ['calças', 'jeans', 'masculinas']
        },
        subcategories: []
      }
    ]
  },
  {
    id: '14',
    name: 'Infantil',
    description: 'Moda infantil completa',
    slug: 'infantil',
    image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg',
    productCount: 28,
    isActive: true,
    order: 3,
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: 'name',
      itemsPerPage: 12,
      showPagination: true,
      showLoadMore: false
    },
    seo: {
      title: 'Moda Infantil',
      description: 'Roupas infantis confortáveis e divertidas',
      keywords: ['moda', 'infantil', 'roupas', 'crianças']
    },
    subcategories: [
      {
        id: '15',
        name: 'Meninas',
        description: 'Roupas para meninas',
        slug: 'meninas',
        image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg',
        productCount: 15,
        isActive: true,
        order: 1,
        parentId: '14',
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: 'name',
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: 'Roupas para Meninas',
          description: 'Roupas bonitas para meninas',
          keywords: ['roupas', 'meninas', 'infantil']
        },
        subcategories: []
      },
      {
        id: '16',
        name: 'Meninos',
        description: 'Roupas para meninos',
        slug: 'meninos',
        image: 'https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg',
        productCount: 13,
        isActive: true,
        order: 2,
        parentId: '14',
        level: 1,
        display: {
          showFilters: true,
          showSorting: true,
          defaultSort: 'name',
          itemsPerPage: 12,
          showPagination: true,
          showLoadMore: false
        },
        seo: {
          title: 'Roupas para Meninos',
          description: 'Roupas confortáveis para meninos',
          keywords: ['roupas', 'meninos', 'infantil']
        },
        subcategories: []
      }
    ]
  }
];

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      return NextResponse.json(mockCategories);
    }

    // Pegar storeId da query string, default 1
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    // Fazer requisição para o backend
    try {
      const categoriesTree = await apiRequest(`/categories?storeId=${storeId}`);
      
      // Garantir que sempre retorne um array
      if (Array.isArray(categoriesTree)) {
        return NextResponse.json(categoriesTree);
      } else if (categoriesTree && categoriesTree.data && Array.isArray(categoriesTree.data)) {
        return NextResponse.json(categoriesTree.data);
      } else {
        return NextResponse.json(mockCategories);
      }
    } catch (error: any) {
      // Se for 404, significa que o backend está funcionando mas o endpoint não existe
      if (error.message.includes('404')) {
        return NextResponse.json(mockCategories);
      }
      throw error; // Re-throw outros erros
    }
  } catch (error: any) {
    // Em caso de erro, retornar dados mock ao invés de erro 500
    return NextResponse.json(mockCategories);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Fazer requisição para o backend
    const result = await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(body)
    });
    
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Fazer requisição para o backend
    const result = await apiRequest(`/categories/${body.id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
    
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    // Fazer requisição para o backend
    const result = await apiRequest(`/categories/${id}`, {
      method: 'DELETE'
    });
    
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}