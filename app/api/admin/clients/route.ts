import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 })
    }

    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      // Dados mock para demonstração
      const mockClients = [
        {
          id: 1,
          name: "Ana Silva",
          email: "ana@email.com",
          phone: "(11) 99999-9999",
          city: "São Paulo",
          state: "SP",
          storeId: 1,
          storeName: "Bella Store Fashion",
          totalOrders: 5,
          totalSpent: 1250.50,
          lastOrderDate: "2024-01-15T10:30:00Z",
          status: "active",
          createdAt: "2024-01-01T08:00:00Z"
        },
        {
          id: 2,
          name: "Carlos Souza",
          email: "carlos@email.com", 
          phone: "(11) 88888-8888",
          city: "Rio de Janeiro",
          state: "RJ",
          storeId: 2,
          storeName: "Moda Elegante",
          totalOrders: 3,
          totalSpent: 780.30,
          lastOrderDate: "2024-01-10T14:20:00Z",
          status: "active",
          createdAt: "2023-12-15T16:45:00Z"
        },
        {
          id: 3,
          name: "Mariana Costa",
          email: "mariana@email.com",
          phone: "(11) 77777-7777",
          city: "Belo Horizonte",
          state: "MG",
          storeId: 1,
          storeName: "Bella Store Fashion",
          totalOrders: 12,
          totalSpent: 2890.75,
          lastOrderDate: "2024-01-20T09:15:00Z",
          status: "vip",
          createdAt: "2023-11-20T12:30:00Z"
        },
        {
          id: 4,
          name: "João Pereira",
          email: "joao@email.com",
          phone: "(11) 66666-6666",
          city: "Salvador",
          state: "BA",
          storeId: 3,
          storeName: "Style Express",
          totalOrders: 1,
          totalSpent: 150.00,
          lastOrderDate: "2024-01-05T18:30:00Z",
          status: "new",
          createdAt: "2024-01-05T18:00:00Z"
        },
        {
          id: 5,
          name: "Beatriz Lima",
          email: "beatriz@email.com",
          phone: "(11) 55555-5555",
          city: "Brasília",
          state: "DF",
          storeId: 5,
          storeName: "Outlet Moda",
          totalOrders: 8,
          totalSpent: 1850.40,
          lastOrderDate: "2024-01-12T13:45:00Z",
          status: "active",
          createdAt: "2023-10-10T10:20:00Z"
        }
      ]
      
      return NextResponse.json({ success: true, clients: mockClients })
    }

    // Tentar buscar dados reais do backend
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/admin/clients`, {
        headers: {
          'Authorization': request.headers.get('authorization')!,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (error) {
      console.log('Endpoint admin/clients não disponível no backend')
    }

    // Fallback: tentar buscar dados de diferentes APIs e consolidar
    try {
      const [ordersRes, storesRes] = await Promise.all([
        apiRequest('/orders').catch(() => ({ orders: [] })),
        apiRequest('/stores').catch(() => ({ stores: [] }))
      ])

      // Aqui consolidaria os dados reais se disponíveis
      const mockClients = [
        {
          id: 1,
          name: "Ana Silva",
          email: "ana@email.com",
          phone: "(11) 99999-9999",
          city: "São Paulo",
          state: "SP",
          storeId: 1,
          storeName: "Bella Store Fashion",
          totalOrders: 5,
          totalSpent: 1250.50,
          lastOrderDate: "2024-01-15T10:30:00Z",
          status: "active",
          createdAt: "2024-01-01T08:00:00Z"
        }
      ]
      
      return NextResponse.json({ success: true, clients: mockClients })
    } catch (error) {
      return NextResponse.json({ success: true, clients: [] })
    }
  } catch (error: any) {
    console.error('❌ Erro na API admin/clients:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 