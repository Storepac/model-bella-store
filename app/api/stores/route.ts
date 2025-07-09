import { NextResponse } from 'next/server'
import { apiRequest } from '@/lib/database'

export async function GET() {
  try {
    const response = await apiRequest('/stores', {
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
    
    const response = await apiRequest('/admin/stores', {
      method: 'POST',
      headers: {
        'Authorization': authHeader || ''
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
    
    const response = await apiRequest(`/stores/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader || ''
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
    
    const response = await apiRequest(`/stores/${id}`, {
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