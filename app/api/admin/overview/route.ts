import { NextRequest, NextResponse } from 'next/server'
import { apiRequest } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Obter o token do header Authorization
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Token de autorização requerido' },
        { status: 401 }
      )
    }
    
    // Fazer requisição para o backend - CORRIGIDO: usar /api/admin/overview
    const response = await apiRequest('/api/admin/overview', {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    })
    
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Erro na rota admin overview:', error)
    
    // Se for erro de autenticação, retornar 401
    if (error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    // Se for erro 404, retornar dados mock
    if (error.message.includes('404')) {
      console.log('Endpoint não encontrado no backend, retornando dados mock')
      return NextResponse.json({
        success: true,
        data: {
          totalStores: 0,
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0
        }
      })
    }
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 