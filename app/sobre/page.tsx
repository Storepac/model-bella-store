"use client"

import { useStoreData } from '@/hooks/use-store-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function SobrePage() {
  const { storeData, loading } = useStoreData()

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando...</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Sobre {storeData?.name || "Nossa Loja"}</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              {storeData?.description || "Bem-vindo à nossa loja! Oferecemos os melhores produtos com qualidade e preços incríveis."}
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
              
              {storeData?.whatsapp && (
                <p className="mb-2">
                  <strong>WhatsApp:</strong> {storeData.whatsapp}
                </p>
              )}
              
              {storeData?.email && (
                <p className="mb-2">
                  <strong>Email:</strong> {storeData.email}
                </p>
              )}
              
              {storeData?.address && (
                <p className="mb-2">
                  <strong>Endereço:</strong> {storeData.address}
                </p>
              )}
              
              {storeData?.cnpj && (
                <p className="mb-2">
                  <strong>CNPJ:</strong> {storeData.cnpj}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 