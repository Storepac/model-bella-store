import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock para quando o backend não estiver disponível
const mockData = {
  success: true,
  data: []
};

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      return NextResponse.json(mockData);
    }

    // Pegar storeId da query string, default 1
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    // Fazer requisição para o backend
    try {
      const banners = await apiRequest(`/banners?storeId=${storeId}`);
      return NextResponse.json(banners);
    } catch (error: any) {
      // Se for 404, significa que o backend está funcionando mas o endpoint não existe
      if (error.message.includes('404')) {
        return NextResponse.json(mockData);
      }
      throw error; // Re-throw outros erros
    }
  } catch (error: any) {
    // Se houver erro de conexão, retornar dados mock
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('404')) {
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 