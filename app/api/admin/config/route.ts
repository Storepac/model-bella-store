import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 })
    }

    // Configurações mockadas para demonstração
    const configurations = {
      success: true,
      system: {
        siteName: "Bella Store",
        siteDescription: "Plataforma completa para criar sua loja online",
        adminEmail: "admin@bellastore.com.br",
        supportEmail: "suporte@bellastore.com.br",
        maxStoresPerUser: 1,
        maintenanceMode: false,
        registrationEnabled: true,
        emailNotifications: true,
        backupEnabled: true,
        backupFrequency: "daily"
      },
      payment: {
        stripeEnabled: false,
        stripePublicKey: "",
        stripeSecretKey: "",
        mercadoPagoEnabled: false,
        mercadoPagoToken: "",
        pixEnabled: true,
        boletoEnabled: true
      },
      plans: {
        startPrice: 29.90,
        startProducts: 500,
        startPhotos: 2,
        proPrice: 59.90,
        proProducts: 1000,
        proPhotos: 3,
        maxPrice: 99.90,
        maxProducts: 9999,
        maxPhotos: 4,
        implementationFee: 97.00
      },
      stats: {
        totalStores: 5,
        totalUsers: 12,
        totalProducts: 1543,
        storageUsed: "2.4 GB",
        storageLimit: "100 GB",
        cpuUsage: "12%",
        memoryUsage: "45%",
        uptime: "15 dias",
        lastBackup: "2024-01-20 02:00:00"
      }
    }

    return NextResponse.json(configurations)
  } catch (error) {
    console.error('Erro na API de configurações:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Token não fornecido' }, { status: 401 })
    }

    const body = await request.json()
    const { section, config } = body

    // Em produção, aqui salvaria as configurações no banco
    console.log(`Salvando configurações de ${section}:`, config)

    return NextResponse.json({
      success: true,
      message: `Configurações de ${section} salvas com sucesso`
    })
  } catch (error) {
    console.error('Erro ao salvar configurações:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 