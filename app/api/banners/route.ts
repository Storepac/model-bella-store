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
      console.log('Backend não disponível, retornando dados mock');
      return NextResponse.json(mockData);
    }

    // Pegar storeId da query string, default 1
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    // Fazer requisição para o backend
    const result = await apiRequest(`/banners?storeId=${storeId}`);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error:', error)
    
    // Se houver erro de conexão, retornar dados mock
    if (error.message && (error.message.includes('fetch') || error.message.includes('network'))) {
      console.log('Erro de conexão detectado, retornando dados mock');
      return NextResponse.json(mockData);
    }
    
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 