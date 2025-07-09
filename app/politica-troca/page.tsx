"use client"

import { useStoreData } from '@/hooks/use-store-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PoliticaTrocaPage() {
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
          <h1 className="text-3xl font-bold mb-6">Política de Troca e Devolução</h1>
          
          <div className="prose prose-lg max-w-none">
            {storeData?.exchangePolicy ? (
              <div className="whitespace-pre-wrap text-gray-700">
                {storeData.exchangePolicy}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  Nossa política de troca e devolução ainda não foi configurada. 
                  Entre em contato conosco para mais informações sobre trocas e devoluções.
                </p>
                
                {storeData?.email && (
                  <p className="mt-4">
                    <strong>Email:</strong> {storeData.email}
                  </p>
                )}
                
                {storeData?.whatsapp && (
                  <p className="mt-2">
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
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 