export const storeData = {
  id: 0,
  // Informações Básicas
  name: "Bella Store",
  description: "Sua loja de moda feminina online com as melhores tendências e preços incríveis.",
  cnpj: "12.345.678/0001-90",
  ie: "123.456.789.123",

  // Contato
  phone: "(11) 99999-9999",
  whatsapp: "(11) 99999-9999",
  email: "contato@bellastore.com",
  website: "www.bellastore.com",

  // Endereço
  address: "Rua das Flores, 123",
  complement: "Loja 1",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",

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
  instagram: "@bellastore",
  facebook: "bellastore",
  tiktok: "@bellastore",
  youtube: "bellastore",

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
}

export type StoreData = typeof storeData
