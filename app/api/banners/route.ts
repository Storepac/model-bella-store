import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock para quando o backend não estiver disponível
const mockData = {
  success: true,
  banners: []
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Obter token de autorização
    const authHeader = request.headers.get('authorization')
    
    // Fazer requisição para o backend
    const result = await apiRequest('/banners', {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Obter token de autorização
    const authHeader = request.headers.get('authorization')
    
    // Fazer requisição para o backend
    let result;
    if (body.id) {
      // Se há ID no body, usar rota com ID
      result = await apiRequest(`/banners/${body.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    } else {
      // Senão, usar rota sem ID (compatibilidade)
      result = await apiRequest('/banners', {
        method: 'PUT',
        headers: {
          'Authorization': authHeader || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }
    
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, storeId } = body
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }
    
    // Obter token de autorização
    const authHeader = request.headers.get('authorization')
    
    // Fazer requisição para o backend
    const result = await apiRequest(`/banners/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      }
    });
    
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 