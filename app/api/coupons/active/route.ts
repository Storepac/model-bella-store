import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')

    if (!storeId) {
      return NextResponse.json({ 
        success: false, 
        message: 'StoreId é obrigatório' 
      }, { status: 400 })
    }

    // Tentar buscar do backend
    try {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
      const response = await fetch(`${backendUrl}/api/coupons/active?storeId=${storeId}`, {
        headers: {
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
    const mockCoupon = {
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
      description: "20% de desconto em toda a coleção primavera!"
    }

    return NextResponse.json({
      success: true,
      coupon: mockCoupon
    })
  } catch (error) {
    console.error('❌ Erro na API coupons/active:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 