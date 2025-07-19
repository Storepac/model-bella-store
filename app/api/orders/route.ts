import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock para quando o backend não estiver disponível
const mockOrders = [
  {
    id: 1,
    orderNumber: "PED-001",
    storeId: 1,
    clientId: 1,
    clientName: "Ana Silva",
    clientEmail: "ana@email.com",
    clientPhone: "(11) 99999-9999",
    status: "pending", // pending, confirmed, processing, shipped, delivered, cancelled
    total: "R$ 250,00",
    totalValue: 250.00,
    items: [
      {
        id: 1,
        productId: 1,
        productName: "Vestido Floral",
        quantity: 1,
        price: "R$ 150,00",
        priceValue: 150.00
      },
      {
        id: 2,
        productId: 2,
        productName: "Blusa Casual",
        quantity: 2,
        price: "R$ 50,00",
        priceValue: 50.00
      }
    ],
    shippingAddress: {
      street: "Rua das Flores, 123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    paymentMethod: "pix",
    notes: "Entregar no portão",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    orderNumber: "PED-002",
    storeId: 1,
    clientId: 2,
    clientName: "Carlos Souza",
    clientEmail: "carlos@email.com",
    clientPhone: "(11) 88888-8888",
    status: "confirmed",
    total: "R$ 180,00",
    totalValue: 180.00,
    items: [
      {
        id: 3,
        productId: 3,
        productName: "Calça Jeans",
        quantity: 1,
        price: "R$ 180,00",
        priceValue: 180.00
      }
    ],
    shippingAddress: {
      street: "Av. Paulista, 1000",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100"
    },
    paymentMethod: "cartao",
    notes: "",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z"
  }
]

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, orders: mockOrders })
    }

    // Pegar parâmetros da query string
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId') || '1'
    const status = searchParams.get('status')
    const range = searchParams.get('range')
    
    // Fazer requisição para o backend
    try {
      let endpoint = `/orders?storeId=${storeId}`
      if (status) endpoint += `&status=${status}`
      if (range) endpoint += `&range=${range}`
      
      const orders = await apiRequest(endpoint)
      return NextResponse.json(orders)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, orders: mockOrders })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de pedidos:', error)
    return NextResponse.json({ success: true, orders: mockOrders })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.clientName || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      // Retornar sucesso mock
      const newOrder = {
        id: Date.now(),
        orderNumber: `PED-${String(Date.now()).slice(-3)}`,
        ...body,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      return NextResponse.json({ success: true, order: newOrder })
    }

    // Fazer requisição para o backend
    try {
      const order = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      return NextResponse.json(order)
    } catch (error: any) {
      if (error.message.includes('404')) {
        const newOrder = {
          id: Date.now(),
          orderNumber: `PED-${String(Date.now()).slice(-3)}`,
          ...body,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        return NextResponse.json({ success: true, order: newOrder })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao criar pedido:', error)
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
    const orderId = searchParams.get('id')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'ID do pedido é obrigatório' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, message: 'Pedido atualizado com sucesso' })
    }

    // Fazer requisição para o backend
    try {
      const order = await apiRequest(`/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      })
      return NextResponse.json(order)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, message: 'Pedido atualizado com sucesso' })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao atualizar pedido:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 