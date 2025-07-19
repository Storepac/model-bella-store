import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 })
    }

    // Dados mock para demonstração
    const mockNotifications = [
      {
        id: 1,
        title: "Nova Loja Cadastrada",
        message: "A loja 'Fashion Boutique' foi cadastrada e aguarda aprovação",
        type: "store",
        status: "unread",
        priority: "high",
        storeId: 6,
        storeName: "Fashion Boutique",
        createdAt: "2024-01-20T10:30:00Z",
        readAt: null,
        data: {
          storeId: 6,
          storeName: "Fashion Boutique",
          ownerEmail: "maria@fashionboutique.com"
        }
      },
      {
        id: 2,
        title: "Pagamento Aprovado",
        message: "Pagamento do plano Pro foi aprovado para Bella Store Fashion",
        type: "payment",
        status: "read",
        priority: "medium",
        storeId: 1,
        storeName: "Bella Store Fashion",
        createdAt: "2024-01-19T14:20:00Z",
        readAt: "2024-01-19T15:30:00Z",
        data: {
          amount: 59.90,
          plan: "Pro",
          paymentMethod: "PIX"
        }
      },
      {
        id: 3,
        title: "Limite de Produtos Atingido",
        message: "A loja Moda Elegante atingiu 95% do limite de produtos do plano Start",
        type: "limit",
        status: "unread",
        priority: "medium",
        storeId: 2,
        storeName: "Moda Elegante",
        createdAt: "2024-01-18T09:15:00Z",
        readAt: null,
        data: {
          currentProducts: 475,
          limitProducts: 500,
          percentUsed: 95
        }
      },
      {
        id: 4,
        title: "Suporte Técnico Solicitado",
        message: "Cliente da Style Express solicitou suporte para upload de imagens",
        type: "support",
        status: "unread",
        priority: "high",
        storeId: 3,
        storeName: "Style Express",
        createdAt: "2024-01-17T16:45:00Z",
        readAt: null,
        data: {
          ticketId: 12345,
          issue: "Upload de imagens",
          clientEmail: "carlos@styleexpress.com"
        }
      },
      {
        id: 5,
        title: "Backup Completado",
        message: "Backup diário do sistema foi executado com sucesso",
        type: "system",
        status: "read",
        priority: "low",
        storeId: null,
        storeName: "Sistema",
        createdAt: "2024-01-17T02:00:00Z",
        readAt: "2024-01-17T08:30:00Z",
        data: {
          backupSize: "2.4 GB",
          duration: "12 minutos"
        }
      },
      {
        id: 6,
        title: "Novo Pedido Processado",
        message: "Pedido #12345 foi processado na loja Outlet Moda",
        type: "order",
        status: "read",
        priority: "low",
        storeId: 5,
        storeName: "Outlet Moda",
        createdAt: "2024-01-16T11:20:00Z",
        readAt: "2024-01-16T14:15:00Z",
        data: {
          orderId: 12345,
          amount: 129.90,
          customer: "Beatriz Lima"
        }
      }
    ]

    return NextResponse.json({ success: true, notifications: mockNotifications })
  } catch (error) {
    console.error('Erro na API de notificações admin:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 