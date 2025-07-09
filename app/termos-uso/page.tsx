"use client"

import { useStoreData } from '@/hooks/use-store-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermosUsoPage() {
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
          <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 mb-4">
                Ao acessar e usar este site da {storeData?.name || "nossa loja"}, você aceita e concorda em cumprir os termos e condições de uso descritos neste documento.
              </p>

              <h2 className="text-xl font-semibold mb-4">2. Uso do Site</h2>
              <p className="text-gray-700 mb-4">
                Este site destina-se ao uso pessoal e não comercial. Você concorda em usar o site apenas para fins legais e de acordo com estes termos.
              </p>

              <h2 className="text-xl font-semibold mb-4">3. Produtos e Preços</h2>
              <p className="text-gray-700 mb-4">
                Todos os produtos exibidos estão sujeitos à disponibilidade. Os preços podem ser alterados sem aviso prévio.
              </p>

              <h2 className="text-xl font-semibold mb-4">4. Contato</h2>
              <p className="text-gray-700 mb-2">
                Para dúvidas sobre estes termos, entre em contato conosco:
              </p>
              
              {storeData?.email && (
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> {storeData.email}
                </p>
              )}
              
              {storeData?.whatsapp && (
                <p className="text-gray-700 mb-2">
                  <strong>WhatsApp:</strong> 
                  <a 
                    href={`https://wa.me/55${storeData.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-green-600 hover:text-green-700"
                  >
                    {storeData.whatsapp}
                  </a>
                </p>
              )}

              {storeData?.cnpj && (
                <p className="text-gray-700 mt-4">
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