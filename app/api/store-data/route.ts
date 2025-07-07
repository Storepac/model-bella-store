import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

// Configuração do banco
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'bella_store',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function resolveStoreIdByHost(host: string): Promise<number | null> {
  const [rows] = await pool.query(
    'SELECT id FROM stores WHERE domain = ? OR subdomain = ? LIMIT 1',
    [host, host]
  )
  if ((rows as any[]).length === 0) return null
  return (rows as any[])[0].id
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let storeId: number | null = null
    const host = searchParams.get('host')
    const storeIdParam = searchParams.get('storeId')
    if (storeIdParam) {
      storeId = Number(storeIdParam)
    } else if (host) {
      storeId = await resolveStoreIdByHost(host)
    } else {
      storeId = 1 // fallback para testes
    }
    if (!storeId) {
      return NextResponse.json({ success: false, error: 'Loja não encontrada para este domínio' }, { status: 404 })
    }
    
    // Buscar dados da loja
    const [storeResult] = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.logo,
        s.description,
        s.cnpj,
        s.inscricao_estadual,
        s.whatsapp,
        s.email,
        s.endereco,
        s.instagram,
        s.facebook,
        s.youtube,
        s.tiktok,
        s.horarios,
        s.politicas_troca,
        s.politicas_gerais,
        s.announcement1,
        s.announcement2,
        s.announcementContact,
        s.isActive,
        st.plano,
        st.moeda,
        st.fuso_horario,
        a.cor_primaria,
        a.cor_secundaria,
        a.cor_botoes,
        a.fonte
      FROM stores s
      LEFT JOIN settings st ON s.id = st.storeId
      LEFT JOIN appearance a ON s.id = a.storeId
      WHERE s.id = ?
    `, [storeId])
    
    if (!storeResult || (storeResult as any[]).length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Loja não encontrada' 
      }, { status: 404 })
    }
    
    const store = (storeResult as any[])[0]
    
    // Buscar banners ativos
    const [banners] = await pool.query(`
      SELECT title, image, link, isActive
      FROM banners 
      WHERE storeId = ? AND isActive = 1
      ORDER BY \`order\` ASC
    `, [storeId])
    
    // Formatar dados para o frontend
    const storeData = {
      id: store.id,
      // Informações Básicas
      name: store.name || "Bella Store",
      description: store.description || "Sua loja online com as melhores tendências e preços incríveis.",
      cnpj: store.cnpj || "",
      ie: store.inscricao_estadual || "",
      
      // Contato
      phone: store.whatsapp || "",
      whatsapp: store.whatsapp || "",
      email: store.email || "",
      website: "",
      
      // Endereço
      address: store.endereco || "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      
      // Horários (JSON parse se existir com tratamento de erro)
      workingHours: (() => {
        try {
          return store.horarios ? JSON.parse(store.horarios) : {
            monday: { open: "09:00", close: "18:00", closed: false },
            tuesday: { open: "09:00", close: "18:00", closed: false },
            wednesday: { open: "09:00", close: "18:00", closed: false },
            thursday: { open: "09:00", close: "18:00", closed: false },
            friday: { open: "09:00", close: "18:00", closed: false },
            saturday: { open: "09:00", close: "14:00", closed: false },
            sunday: { open: "09:00", close: "12:00", closed: true },
          }
        } catch (error) {
          console.error('Erro ao fazer parse dos horários:', error, 'Valor:', store.horarios)
          return {
            monday: { open: "09:00", close: "18:00", closed: false },
            tuesday: { open: "09:00", close: "18:00", closed: false },
            wednesday: { open: "09:00", close: "18:00", closed: false },
            thursday: { open: "09:00", close: "18:00", closed: false },
            friday: { open: "09:00", close: "18:00", closed: false },
            saturday: { open: "09:00", close: "14:00", closed: false },
            sunday: { open: "09:00", close: "12:00", closed: true },
          }
        }
      })(),
      
      // Redes Sociais
      instagram: store.instagram || "",
      facebook: store.facebook || "",
      tiktok: store.tiktok || "",
      youtube: store.youtube || "",
      
      // Configurações de Entrega
      freeShippingMinValue: 199,
      shippingTime: "5 a 10 dias úteis",
      returnPolicy: "30 dias para trocas e devoluções",
      
      // Políticas
      privacyPolicy: store.politicas_gerais || "",
      termsOfService: "",
      exchangePolicy: store.politicas_troca || "",
      
      // Barra de Anúncios
      announcement1: store.announcement1 || "Frete grátis acima de R$ 199",
      announcement2: store.announcement2 || "Parcelamos em até 10x sem juros",
      announcementContact: store.announcementContact || (store.whatsapp ? `Atendimento: ${store.whatsapp}` : ""),
      
      // Aparência
      colors: {
        primary: store.cor_primaria || "#e91e63",
        secondary: store.cor_secundaria || "#9c27b0",
        buttons: store.cor_botoes || "#e91e63"
      },
      font: store.fonte || "Inter",
      
      // Banners
      banners: banners || [],
      
      // Status
      isActive: store.isActive,
      plano: store.plano || 'Start'
    }
    
    return NextResponse.json({
      success: true,
      data: storeData
    })
    
  } catch (error) {
    console.error('Error fetching store data:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 