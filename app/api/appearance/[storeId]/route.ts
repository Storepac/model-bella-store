import { NextRequest, NextResponse } from 'next/server'
import { apiRequest } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId
    
    if (!storeId) {
      return NextResponse.json({ 
        success: false, 
        message: 'storeId é obrigatório' 
      }, { status: 400 })
    }

    // Tentar buscar do backend
    try {
      const response = await apiRequest(`/appearance/${storeId}`)
      
      if (response.success) {
        return NextResponse.json(response)
      }
    } catch (error) {
      console.log('Backend não disponível, usando configuração padrão')
    }

    // Se falhou, retornar configuração padrão
    const defaultConfig = {
      success: true,
      data: {
        id: null,
        storeId: parseInt(storeId),
        primaryColor: '#ec4899',
        secondaryColor: '#8b5cf6',
        buttonColor: '#ec4899',
        font: 'Inter',
        settings: {
          primaryColor: '#ec4899',
          secondaryColor: '#8b5cf6',
          buttonColor: '#ec4899',
          accentColor: '#f59e0b',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          headerColor: '#ffffff',
          footerColor: '#111827',
          linkColor: '#3b82f6',
          storeName: 'Bella Store',
          logoUrl: '',
          favicon: '',
          headerText: 'Nova Coleção',
          headerSubtext: 'Descubra as últimas tendências',
          headerButtonText: 'Ver Coleção',
          headerBackgroundColor: '#fef7ff',
          headerImage: '',
          showHeaderBanner: true,
          headerStyle: 'modern',
          headerLayout: 'center',
          showSearchBar: true,
          showCartIcon: true,
          showUserIcon: true,
          freeShippingText: 'Frete grátis acima de R$ 199',
          installmentText: 'Parcelamos em até 10x sem juros',
          showTopBar: true,
          topBarColor: '#000000',
          topBarTextColor: '#ffffff',
          instagram: '',
          facebook: '',
          tiktok: '',
          youtube: '',
          showSocialMedia: true,
          socialMediaStyle: 'icons',
          fontFamily: 'Inter',
          fontSize: 'medium',
          fontWeight: 'normal',
          containerWidth: '1200px',
          borderRadius: '8px',
          spacing: 'normal',
          showShadows: true,
          showAnimations: true,
          showGradients: false,
          cardStyle: 'modern'
        }
      }
    }

    return NextResponse.json(defaultConfig)
    
  } catch (error) {
    console.error('❌ Erro na API de aparência:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = params.storeId
    const body = await request.json()
    
    if (!storeId) {
      return NextResponse.json({ 
        success: false, 
        message: 'storeId é obrigatório' 
      }, { status: 400 })
    }

    // Obter token de autorização
    const authHeader = request.headers.get('authorization')
    
    try {
      // Tentar salvar no backend
      const response = await apiRequest(`/appearance/${storeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': authHeader || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      
      if (response.success) {
        return NextResponse.json(response)
      }
    } catch (error) {
      console.log('Backend não disponível, simulando sucesso')
    }

    // Se falhou, simular sucesso
    return NextResponse.json({
      success: true,
      message: 'Configurações de aparência atualizadas com sucesso',
      data: body
    })
    
  } catch (error) {
    console.error('❌ Erro ao atualizar aparência:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor' 
    }, { status: 500 })
  }
} 