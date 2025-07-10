import { NextResponse } from 'next/server'
import { apiFetch } from '@/lib/api-client'

export async function GET(request: Request) {
  try {
    // Tentar pegar o storeId da query string
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    // Fazer requisição ao backend
    const response = await apiFetch(`/stores/limits?storeId=${storeId}`, {
      auth: true
    });
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Erro ao buscar limites:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 });
  }
} 