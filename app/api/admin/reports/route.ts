import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Testar conexão com o backend
    const isConnected = await testBackendConnection()
    
    if (!isConnected) {
      // Dados mock consolidados para demonstração
      const mockReports = {
        totalStores: 5,
        totalProducts: 156,
        totalOrders: 89,
        totalRevenue: 45678.90,
        totalClients: 234,
        storeMetrics: [
          {
            storeId: 1,
            storeName: "Bella Store Fashion",
            products: 45,
            orders: 23,
            revenue: 12450.50,
            clients: 67
          },
          {
            storeId: 2,
            storeName: "Moda Elegante",
            products: 38,
            orders: 18,
            revenue: 8760.30,
            clients: 52
          },
          {
            storeId: 3,
            storeName: "Style Boutique",
            products: 29,
            orders: 15,
            revenue: 6890.45,
            clients: 41
          },
          {
            storeId: 4,
            storeName: "Fashion Express",
            products: 33,
            orders: 21,
            revenue: 9870.20,
            clients: 48
          },
          {
            storeId: 5,
            storeName: "Trend Store",
            products: 11,
            orders: 12,
            revenue: 7707.45,
            clients: 26
          }
        ],
        monthlyRevenue: [
          { month: "Jan", revenue: 8500 },
          { month: "Fev", revenue: 12300 },
          { month: "Mar", revenue: 9800 },
          { month: "Abr", revenue: 15200 },
          { month: "Mai", revenue: 18900 },
          { month: "Jun", revenue: 21500 }
        ],
        topStores: [
          { name: "Bella Store Fashion", revenue: 12450.50 },
          { name: "Fashion Express", revenue: 9870.20 },
          { name: "Moda Elegante", revenue: 8760.30 }
        ],
        recentActivity: [
          { type: "order", description: "Nova venda na Bella Store Fashion", amount: 250.00, timestamp: new Date().toISOString() },
          { type: "store", description: "Nova loja cadastrada: Trend Store", timestamp: new Date(Date.now() - 3600000).toISOString() },
          { type: "product", description: "50 novos produtos adicionados", timestamp: new Date(Date.now() - 7200000).toISOString() }
        ]
      }
      return NextResponse.json({ success: true, reports: mockReports })
    }

    // Tentar buscar dados do backend
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/admin/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (error) {
      console.log('Backend não disponível, usando dados mock')
    }

    // Fallback: Buscar dados individuais e consolidar
    try {
      const [storesRes, productsRes, ordersRes] = await Promise.all([
        apiRequest('/stores'),
        apiRequest('/products'),
        apiRequest('/orders')
      ])

      const consolidatedData = {
        totalStores: storesRes.stores?.length || 0,
        totalProducts: productsRes.products?.length || 0,
        totalOrders: ordersRes.orders?.length || 0,
        totalRevenue: ordersRes.orders?.reduce((sum: number, order: any) => sum + (order.totalValue || 0), 0) || 0,
        totalClients: 0, // Seria necessário endpoint de clientes
        storeMetrics: [],
        monthlyRevenue: [],
        topStores: [],
        recentActivity: []
      }

      return NextResponse.json({ success: true, reports: consolidatedData })
    } catch {
      // Se tudo falhar, usar dados mock
      const mockReports = {
        totalStores: 5,
        totalProducts: 156,
        totalOrders: 89,
        totalRevenue: 45678.90,
        totalClients: 234,
        storeMetrics: [],
        monthlyRevenue: [],
        topStores: [],
        recentActivity: []
      }
      return NextResponse.json({ success: true, reports: mockReports })
    }
  } catch (error: any) {
    console.error('❌ Erro na API admin/reports:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 