import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock para quando o backend não estiver disponível
const mockNotifications = [
  {
    id: 1,
    storeId: 1,
    title: "Novo Pedido Recebido",
    message: "Você recebeu um novo pedido #PED-001 de Ana Silva no valor de R$ 250,00",
    type: "order", // order, product, system, promotion, customer
    status: "unread", // unread, read, archived
    priority: "high", // low, medium, high, urgent
    data: {
      orderId: 1,
      orderNumber: "PED-001",
      customerName: "Ana Silva",
      amount: 250.00
    },
    createdAt: "2024-01-15T10:30:00Z",
    readAt: null
  },
  {
    id: 2,
    storeId: 1,
    title: "Produto com Estoque Baixo",
    message: "O produto 'Vestido Floral Verão' está com apenas 3 unidades em estoque",
    type: "product",
    status: "unread",
    priority: "medium",
    data: {
      productId: 1,
      productName: "Vestido Floral Verão",
      currentStock: 3,
      minStock: 5
    },
    createdAt: "2024-01-15T09:15:00Z",
    readAt: null
  },
  {
    id: 3,
    storeId: 1,
    title: "Sistema Atualizado",
    message: "Nova versão do sistema disponível com melhorias de performance",
    type: "system",
    status: "read",
    priority: "low",
    data: {
      version: "1.2.0",
      features: ["Performance", "Bug fixes", "New dashboard"]
    },
    createdAt: "2024-01-14T16:00:00Z",
    readAt: "2024-01-14T18:30:00Z"
  },
  {
    id: 4,
    storeId: 1,
    title: "Promoção Expirada",
    message: "A promoção 'DESCONTO20' expirou e foi automaticamente desativada",
    type: "promotion",
    status: "read",
    priority: "medium",
    data: {
      promotionCode: "DESCONTO20",
      usageCount: 45,
      totalDiscount: 890.50
    },
    createdAt: "2024-01-13T23:59:00Z",
    readAt: "2024-01-14T08:00:00Z"
  },
  {
    id: 5,
    storeId: 1,
    title: "Novo Cliente Cadastrado",
    message: "Carlos Souza se cadastrou na sua loja",
    type: "customer",
    status: "unread",
    priority: "low",
    data: {
      customerId: 2,
      customerName: "Carlos Souza",
      customerEmail: "carlos@email.com"
    },
    createdAt: "2024-01-13T14:20:00Z",
    readAt: null
  }
]

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, notifications: mockNotifications })
    }

    // Pegar parâmetros da query string
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId') || '1'
    const status = searchParams.get('status') // unread, read, archived
    const type = searchParams.get('type') // order, product, system, promotion, customer
    const priority = searchParams.get('priority') // low, medium, high, urgent
    const limit = searchParams.get('limit') || '50'
    const page = searchParams.get('page') || '1'
    
    // Fazer requisição para o backend
    try {
      let endpoint = `/notifications?storeId=${storeId}&limit=${limit}&page=${page}`
      if (status) endpoint += `&status=${status}`
      if (type) endpoint += `&type=${type}`
      if (priority) endpoint += `&priority=${priority}`
      
      const notifications = await apiRequest(endpoint)
      return NextResponse.json(notifications)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, notifications: mockNotifications })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de notificações:', error)
    return NextResponse.json({ success: true, notifications: mockNotifications })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validação básica
    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        { success: false, message: 'Título, mensagem e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      // Retornar sucesso mock
      const newNotification = {
        id: Date.now(),
        ...body,
        status: 'unread',
        priority: body.priority || 'medium',
        createdAt: new Date().toISOString(),
        readAt: null
      }
      return NextResponse.json({ success: true, notification: newNotification })
    }

    // Fazer requisição para o backend
    try {
      const notification = await apiRequest('/notifications', {
        method: 'POST',
        body: JSON.stringify(body)
      })
      return NextResponse.json(notification)
    } catch (error: any) {
      if (error.message.includes('404')) {
        const newNotification = {
          id: Date.now(),
          ...body,
          status: 'unread',
          priority: body.priority || 'medium',
          createdAt: new Date().toISOString(),
          readAt: null
        }
        return NextResponse.json({ success: true, notification: newNotification })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao criar notificação:', error)
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
    const notificationId = searchParams.get('id')
    
    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: 'ID da notificação é obrigatório' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, message: 'Notificação atualizada com sucesso' })
    }

    // Fazer requisição para o backend
    try {
      const notification = await apiRequest(`/notifications/${notificationId}`, {
        method: 'PUT',
        body: JSON.stringify(body)
      })
      return NextResponse.json(notification)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, message: 'Notificação atualizada com sucesso' })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao atualizar notificação:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Marcar como lida
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const action = searchParams.get('action') // mark-read, mark-unread, archive
    
    if (!notificationId || !action) {
      return NextResponse.json(
        { success: false, message: 'ID da notificação e ação são obrigatórios' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, message: 'Notificação atualizada com sucesso' })
    }

    // Fazer requisição para o backend
    try {
      const notification = await apiRequest(`/notifications/${notificationId}/${action}`, {
        method: 'PATCH'
      })
      return NextResponse.json(notification)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, message: 'Notificação atualizada com sucesso' })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao atualizar status da notificação:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    
    if (!notificationId) {
      return NextResponse.json(
        { success: false, message: 'ID da notificação é obrigatório' },
        { status: 400 }
      )
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      return NextResponse.json({ success: true, message: 'Notificação removida com sucesso' })
    }

    // Fazer requisição para o backend
    try {
      const result = await apiRequest(`/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      return NextResponse.json(result)
    } catch (error: any) {
      if (error.message.includes('404')) {
        return NextResponse.json({ success: true, message: 'Notificação removida com sucesso' })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro ao remover notificação:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 