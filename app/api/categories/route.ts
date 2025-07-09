import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock para quando o backend não estiver disponível
const mockCategories = [
  {
    id: '1',
    name: 'Roupas',
    description: 'Roupas femininas',
    slug: 'roupas',
    image: '/placeholder.jpg',
    productCount: 0,
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
      title: 'Roupas Femininas',
      description: 'Encontre as melhores roupas femininas',
      keywords: ['roupas', 'femininas', 'moda']
    },
    subcategories: [
      {
        id: '2',
        name: 'Blusas',
        description: 'Blusas femininas',
        slug: 'blusas',
        image: '/placeholder.jpg',
        productCount: 0,
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
          title: 'Blusas Femininas',
          description: 'Blusas femininas elegantes',
          keywords: ['blusas', 'femininas']
        },
        subcategories: []
      },
      {
        id: '3',
        name: 'Calças',
        description: 'Calças femininas',
        slug: 'calcas',
        image: '/placeholder.jpg',
        productCount: 0,
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
          title: 'Calças Femininas',
          description: 'Calças femininas confortáveis',
          keywords: ['calças', 'femininas']
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
      console.log('Backend não disponível, retornando dados mock');
      return NextResponse.json(mockCategories);
    }

    // Pegar storeId da query string, default 1
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    // Fazer requisição para o backend
    try {
      const categoriesTree = await apiRequest(`/categories?storeId=${storeId}`);
      return NextResponse.json(categoriesTree);
    } catch (error: any) {
      // Se for 404, significa que o backend está funcionando mas o endpoint não existe
      if (error.message.includes('404')) {
        console.log('Endpoint não encontrado no backend, retornando dados mock');
        return NextResponse.json(mockCategories);
      }
      throw error; // Re-throw outros erros
    }
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    
    // Se houver erro de conexão, retornar dados mock
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('404')) {
      console.log('Erro de conexão detectado, retornando dados mock');
      return NextResponse.json(mockCategories);
    }
    
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
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
    console.error('Error creating category:', error)
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
    console.error('Error updating category:', error)
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
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}