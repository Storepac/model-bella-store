"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { resolveStoreIdClient } from '@/lib/store-id'

export default function TestStorePage() {
  const [storeId, setStoreId] = useState<number | null>(null)
  const [storeData, setStoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true)
        
        // Resolver storeId da URL
        const resolvedStoreId = await resolveStoreIdClient()
        setStoreId(resolvedStoreId)
        
        // Buscar dados da loja
        const response = await fetch(`/api/store-data?storeId=${resolvedStoreId}`)
        const data = await response.json()
        
        if (data.success || data.id) {
          setStoreData(data.data || data)
        } else {
          setError('Loja não encontrada')
        }
      } catch (err) {
        setError('Erro ao carregar dados da loja')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">Carregando dados da loja...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🏪 Teste da Loja - Store ID: {storeId}</CardTitle>
          <CardDescription>
            Esta página mostra os dados carregados da loja para verificar se a sincronização está funcionando
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Informações Básicas */}
            <div>
              <h3 className="font-semibold mb-3">📋 Informações Básicas</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Nome:</strong> {storeData?.name || storeData?.store_name || 'Não informado'}</div>
                <div><strong>Descrição:</strong> {storeData?.description || storeData?.store_description || 'Não informado'}</div>
                <div><strong>Email:</strong> {storeData?.email || 'Não informado'}</div>
                <div><strong>WhatsApp:</strong> {storeData?.whatsapp || storeData?.whatsapp_number || 'Não informado'}</div>
                <div><strong>CNPJ:</strong> {storeData?.cnpj || 'Não informado'}</div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="font-semibold mb-3">📍 Endereço</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Endereço:</strong> {storeData?.address || 'Não informado'}</div>
                <div><strong>Cidade:</strong> {storeData?.city || 'Não informado'}</div>
                <div><strong>Estado:</strong> {storeData?.state || 'Não informado'}</div>
                <div><strong>CEP:</strong> {storeData?.zipCode || 'Não informado'}</div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div>
              <h3 className="font-semibold mb-3">📱 Redes Sociais</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Instagram:</strong> {storeData?.instagram || 'Não informado'}</div>
                <div><strong>Facebook:</strong> {storeData?.facebook || 'Não informado'}</div>
                <div><strong>TikTok:</strong> {storeData?.tiktok || 'Não informado'}</div>
                <div><strong>YouTube:</strong> {storeData?.youtube || 'Não informado'}</div>
              </div>
            </div>

            {/* Políticas */}
            <div>
              <h3 className="font-semibold mb-3">📜 Políticas</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Política de Troca:</strong> {storeData?.exchangePolicy || storeData?.politicas_troca || 'Não informado'}</div>
                <div><strong>Política de Privacidade:</strong> {storeData?.privacyPolicy || storeData?.politicas_gerais || 'Não informado'}</div>
                <div><strong>Termos de Serviço:</strong> {storeData?.termsOfService || 'Não informado'}</div>
              </div>
            </div>

            {/* Anúncios */}
            <div>
              <h3 className="font-semibold mb-3">📢 Anúncios</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Anúncio 1:</strong> {storeData?.announcement1 || 'Não informado'}</div>
                <div><strong>Anúncio 2:</strong> {storeData?.announcement2 || 'Não informado'}</div>
                <div><strong>Contato:</strong> {storeData?.announcementContact || 'Não informado'}</div>
              </div>
            </div>

            {/* Configurações de Entrega */}
            <div>
              <h3 className="font-semibold mb-3">🚚 Entrega</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Frete Grátis a partir de:</strong> R$ {storeData?.freeShippingMinValue || '0,00'}</div>
                <div><strong>Prazo de Entrega:</strong> {storeData?.shippingTime || 'Não informado'}</div>
                <div><strong>Política de Devolução:</strong> {storeData?.returnPolicy || 'Não informado'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug - Dados Brutos */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Debug - Dados Brutos</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(storeData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
} 