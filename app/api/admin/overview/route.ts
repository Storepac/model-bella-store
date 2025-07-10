import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Tentar buscar dados do backend
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/admin/overview`, {
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
      // Se o backend não estiver disponível, retornar dados mock
    }

    // Dados mock para demonstração
    const mockData = {
      totalStores: 15,
      totalProducts: 234,
      totalRevenue: 45678.90,
      activeStores: 12,
      pendingStores: 3,
      recentStores: [
        {
          id: 1,
          name: "Loja Fashion",
          status: "active",
          createdAt: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Boutique Elegante",
          status: "active",
          createdAt: "2024-01-14T14:20:00Z"
        },
        {
          id: 3,
          name: "Moda Express",
          status: "pending",
          createdAt: "2024-01-13T09:15:00Z"
        }
      ]
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error('❌ Erro na API admin/overview:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 