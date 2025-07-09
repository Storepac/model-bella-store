import { NextResponse } from 'next/server'
import { apiRequest } from '@/lib/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin')
    
    // Se for admin, usar rota específica
    if (isAdmin) {
      const authHeader = request.headers.get('authorization')
      const response = await apiRequest('/api/stores/admin', {
        method: 'GET',
        headers: {
          'Authorization': authHeader || ''
        }
      })
      return NextResponse.json(response)
    }
    
    // Rota pública
    const response = await apiRequest('/api/stores', {
      method: 'GET'
    })
    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao buscar lojas:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Obter o token do header Authorization
    const authHeader = request.headers.get('authorization')
    
    // CORRIGIDO: usar /api/stores para criar loja
    const response = await apiRequest('/api/stores', {
      method: 'POST',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao cadastrar loja:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID da loja é obrigatório' }, { status: 400 })
    }
    
    // Obter o token do header Authorization
    const authHeader = request.headers.get('authorization')
    
    // CORRIGIDO: usar /api/stores/:id
    const response = await apiRequest(`/api/stores/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao atualizar loja:', error)
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID requerido' }, { status: 400 })
    }
    
    // Obter o token do header Authorization
    const authHeader = request.headers.get('authorization')
    
    // CORRIGIDO: usar /api/stores/:id
    const response = await apiRequest(`/api/stores/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader || ''
      }
    })
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao deletar loja:', error)
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 })
  }
} 