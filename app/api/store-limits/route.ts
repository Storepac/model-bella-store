import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api-client'

// Dados mock para quando o backend não estiver disponível
const getMockLimits = (storeId: number) => ({
  success: true,
  data: {
    plano: 'Start',
    products: {
      current: 0,
      limit: 500,
      remaining: 500,
      percentUsed: 0,
      canAdd: true,
      status: 'ok'
    },
    photos: {
      limitPerProduct: 2
    }
  }
})

export async function GET(request: Request) {
  try {
    // Tentar pegar o storeId da query string
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    try {
      // Tentar fazer requisição ao backend
      const response = await apiFetch(`/stores/limits?storeId=${storeId}`, {
        auth: true
      });
      
      if (response.success) {
        return NextResponse.json(response);
      }
    } catch (error) {
      console.log('Backend não disponível, usando dados mock');
    }
    
    // Se falhou, retornar dados mock
    return NextResponse.json(getMockLimits(storeId));
    
  } catch (error) {
    console.error('Erro ao buscar limites:', error);
    // Em caso de erro, retornar dados mock
    return NextResponse.json(getMockLimits(1));
  }
} 