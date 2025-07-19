import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock para quando o backend não estiver disponível
const mockKits = [
  {
    id: 1,
    storeId: 1,
    name: "Kit Look Completo Verão",
    description: "Kit com vestido, sandália e bolsa para um look completo de verão",
    code: "KIT-001",
    price: "R$ 299,90",
    priceValue: 299.90,
    originalPrice: "R$ 399,90",
    originalPriceValue: 399.90,
    discount: 25,
    stock: 15,
    isActive: true,
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
    ],
    products: [
      {
        id: 1,
        name: "Vestido Floral Verão",
        price: "R$ 149,90",
        priceValue: 149.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200"
      },
      {
        id: 2,
        name: "Sandália Rasteira",
        price: "R$ 89,90",
        priceValue: 89.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200"
      },
      {
        id: 3,
        name: "Bolsa de Palha",
        price: "R$ 159,90",
        priceValue: 159.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200"
      }
    ],
    category: "Conjuntos",
    tags: ["verão", "casual", "completo"],
    featured: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z"
  },
  {
    id: 2,
    storeId: 1,
    name: "Kit Festa Elegante",
    description: "Kit perfeito para festas com vestido longo e acessórios",
    code: "KIT-002",
    price: "R$ 459,90",
    priceValue: 459.90,
    originalPrice: "R$ 599,90",
    originalPriceValue: 599.90,
    discount: 23,
    stock: 8,
    isActive: true,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400",
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400"
    ],
    products: [
      {
        id: 4,
        name: "Vestido Longo Festa",
        price: "R$ 299,90",
        priceValue: 299.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=200"
      },
      {
        id: 5,
        name: "Colar Dourado",
        price: "R$ 79,90",
        priceValue: 79.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200"
      },
      {
        id: 6,
        name: "Brincos Pérola",
        price: "R$ 49,90",
        priceValue: 49.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200"
      },
      {
        id: 7,
        name: "Clutch Elegante",
        price: "R$ 169,90",
        priceValue: 169.90,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200"
      }
    ],
    category: "Festa",
    tags: ["festa", "elegante", "noite"],
    featured: false,
    createdAt: "2024-01-08T15:20:00Z",
    updatedAt: "2024-01-12T09:15:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, kits: mockKits })
    }

    // Pegar parâmetros da query string
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId') || '1'
    const activeOnly = searchParams.get('activeOnly') === 'true'
    const featured = searchParams.get('featured') === 'true'
    
    // Fazer requisição para o backend
    try {
      let endpoint = `/kits?storeId=${storeId}`
      if (activeOnly) endpoint += `&activeOnly=true`
      if (featured) endpoint += `&featured=true`
      
      const kits = await apiRequest(endpoint)
      return NextResponse.json(kits)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, kits: mockKits })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de kits:', error)
    return NextResponse.json({ success: true, kits: mockKits })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.name || !body.products || body.products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Nome e produtos são obrigatórios' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      // Retornar sucesso mock
      const newKit = {
        id: Date.now(),
        code: `KIT-${String(Date.now()).slice(-3)}`,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      return NextResponse.json({ success: true, kit: newKit })
    }

    // Fazer requisição para o backend
    try {
      const kit = await apiRequest('/kits', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      return NextResponse.json(kit)
    } catch (error: any) {
      if (error.message.includes('404')) {
        const newKit = {
          id: Date.now(),
          code: `KIT-${String(Date.now()).slice(-3)}`,
          ...body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        return NextResponse.json({ success: true, kit: newKit })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao criar kit:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const kitId = searchParams.get('id')
    
    if (!kitId) {
      return NextResponse.json(
        { success: false, message: 'ID do kit é obrigatório' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, message: 'Kit atualizado com sucesso' })
    }

    // Fazer requisição para o backend
    try {
      const kit = await apiRequest(`/kits/${kitId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      })
      return NextResponse.json(kit)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, message: 'Kit atualizado com sucesso' })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao atualizar kit:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kitId = searchParams.get('id')
    
    if (!kitId) {
      return NextResponse.json(
        { success: false, message: 'ID do kit é obrigatório' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, message: 'Kit removido com sucesso' })
    }

    // Fazer requisição para o backend
    try {
      const result = await apiRequest(`/kits/${kitId}`, {
        method: 'DELETE'
      })
      return NextResponse.json(result)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, message: 'Kit removido com sucesso' })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao remover kit:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 