"use client"

import { useStoreData } from '@/hooks/use-store-data'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PoliticaPrivacidadePage() {
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
          <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none">
            {storeData?.privacyPolicy ? (
              <div className="whitespace-pre-wrap text-gray-700">
                {storeData.privacyPolicy}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-600">
                  A política de privacidade ainda não foi configurada. 
                  Entre em contato conosco para mais informações sobre como tratamos seus dados.
                </p>
                
                {storeData?.email && (
                  <p className="mt-4">
                    <strong>Email:</strong> {storeData.email}
                  </p>
                )}
                
                {storeData?.whatsapp && (
                  <p className="mt-2">
                    <strong>WhatsApp:</strong> {storeData.whatsapp}
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