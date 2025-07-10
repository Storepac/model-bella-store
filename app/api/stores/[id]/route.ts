import { NextRequest, NextResponse } from 'next/server'
import { apiRequest } from '@/lib/database'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    
    const backendRes = await apiRequest(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
    
    return NextResponse.json(backendRes)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    
    const backendRes = await apiRequest(`/stores/${id}`)
    
    return NextResponse.json(backendRes)
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 