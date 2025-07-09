import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')

    // Dados mockados para o painel admin
    const overviewData = {
      totalProducts: 0,
      totalPhotos: 0,
      totalVideos: 0,
      plan: {
        name: 'Start',
        limits: {
          products: 500,
          photosPerProduct: 2,
          video: false
        }
      }
    }

    return NextResponse.json(overviewData)
  } catch (error) {
    console.error('Erro na rota admin overview:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 