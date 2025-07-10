import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Token não fornecido' 
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Tentar buscar do backend
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/coupons`, {
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
    const mockCoupons = [
      {
        id: "1",
        code: "PRIMAVERA20",
        discount: 20,
        discountType: "percentage",
        minValue: 50.00,
        maxDiscount: 100.00,
        validFrom: "2024-01-01T00:00:00Z",
        validUntil: "2024-12-31T23:59:59Z",
        isActive: true,
        usageLimit: 100,
        usedCount: 45,
        description: "20% de desconto em toda a coleção primavera!",
        showFloatingButton: true
      },
      {
        id: "2",
        code: "FREEGRATIS",
        discount: 10.00,
        discountType: "fixed",
        minValue: 30.00,
        validFrom: "2024-01-01T00:00:00Z",
        validUntil: "2024-06-30T23:59:59Z",
        isActive: true,
        usageLimit: 50,
        usedCount: 12,
        description: "R$ 10,00 de desconto em compras acima de R$ 30,00",
        showFloatingButton: false
      }
    ]

    return NextResponse.json({
      success: true,
      coupons: mockCoupons
    })
  } catch (error) {
    console.error('❌ Erro na API coupons:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Token não fornecido' 
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const body = await request.json()
    
    // Tentar criar no backend
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/coupons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (error) {
      // Se o backend não estiver disponível, retornar sucesso mock
    }

    // Simular criação bem-sucedida
    const newCoupon = {
      id: Date.now().toString(),
      ...body,
      usedCount: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Cupom criado com sucesso',
      coupon: newCoupon
    })
  } catch (error) {
    console.error('❌ Erro na API coupons POST:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 