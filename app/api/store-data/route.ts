import { NextRequest, NextResponse } from 'next/server'
import { apiRequest, testBackendConnection } from '@/lib/database'

// Dados mock para quando o backend não estiver disponível
const mockStoreData = {
  id: 1,
  // Informações Básicas
  name: "Bella Store",
  description: "Sua loja online com as melhores tendências e preços incríveis.",
  cnpj: "",
  ie: "",
  
  // Contato
  phone: "",
  whatsapp: "",
  email: "contato@bellastore.com",
  website: "",
  
  // Endereço
  address: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
  
  // Horários
  workingHours: {
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "09:00", close: "14:00", closed: false },
    sunday: { open: "09:00", close: "12:00", closed: true },
  },
  
  // Redes Sociais
  instagram: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  
  // Configurações de Entrega
  freeShippingMinValue: 199,
  shippingTime: "5 a 10 dias úteis",
  returnPolicy: "30 dias para trocas e devoluções",
  
  // Políticas
  privacyPolicy: "",
  termsOfService: "",
  exchangePolicy: "",
  
  // Barra de Anúncios
  announcement1: "Frete grátis acima de R$ 199",
  announcement2: "Parcelamos em até 10x sem juros",
  announcementContact: "Atendimento: (11) 99999-9999",
  
  // Aparência
  colors: {
    primary: "#e91e63",
    secondary: "#9c27b0",
    buttons: "#e91e63"
  },
  font: "Inter",
  
  // Banners
  banners: [],
  
  // Status
  isActive: true,
  plano: 'Start'
};

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com o backend
    const isConnected = await testBackendConnection();
    
    if (!isConnected) {
      return NextResponse.json(mockStoreData);
    }

    // Pegar storeId da query string, default 1
    const { searchParams } = new URL(request.url)
    const storeIdParam = searchParams.get('storeId')
    const storeId = storeIdParam ? Number(storeIdParam) : 1;
    
    // Fazer requisição para o backend
    try {
      const storeData = await apiRequest(`/store-data?storeId=${storeId}`);
      return NextResponse.json(storeData);
    } catch (error: any) {
      // Se for 404, significa que o backend está funcionando mas o endpoint não existe
      if (error.message.includes('404')) {
        return NextResponse.json(mockStoreData);
      }
      throw error; // Re-throw outros erros
    }
  } catch (error: any) {
    // Se houver erro de conexão, retornar dados mock
    if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('404')) {
      return NextResponse.json(mockStoreData);
    }
    
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
} 