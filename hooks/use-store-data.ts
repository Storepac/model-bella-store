"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface AppearanceSettings {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  headerBackgroundColor?: string
  buttonColor?: string
  topBarColor?: string
  topBarTextColor?: string
  [key: string]: any
}

interface StoreData {
  id: number
  name: string
  logo?: string
  description?: string
  cnpj?: string
  inscricao_estadual?: string
  whatsapp?: string
  email?: string
  endereco?: string
  instagram?: string
  facebook?: string
  youtube?: string
  tiktok?: string
  horarios?: string
  politicas_troca?: string
  politicas_gerais?: string
  announcement1?: string
  announcement2?: string
  announcementContact?: string
  exchangePolicy?: string
  privacyPolicy?: string
  appearance?: AppearanceSettings
}

// Dados mockados para demos
const demoStoreData: StoreData = {
  id: 1,
  name: "Bella Store - Moda Feminina",
  description: "Sua loja de moda feminina com as melhores tendências",
  whatsapp: "(11) 99999-9999",
  email: "contato@bellastore.com",
  endereco: "Rua das Flores, 123 - São Paulo/SP",
  instagram: "@bellastore",
  facebook: "BellaStoreOficial",
  announcement1: "Frete grátis para todo Brasil",
  announcement2: "Novidades toda semana",
  announcementContact: "WhatsApp: (11) 99999-9999",
  politicas_troca: "Trocas e devoluções em até 30 dias",
  politicas_gerais: "Política de privacidade e termos de uso",
  appearance: {
    primaryColor: "#ec4899",
    secondaryColor: "#8b5cf6",
    accentColor: "#f59e0b"
  }
}

// Dados mockados para demo2 (eletrônicos)
const demo2StoreData: StoreData = {
  id: 2,
  name: "TechStore - Sua Loja de Eletrônicos",
  description: "As melhores marcas e preços em tecnologia",
  whatsapp: "(11) 88888-8888",
  email: "contato@techstore.com",
  endereco: "Av. Paulista, 1000 - São Paulo/SP",
  instagram: "@techstore",
  facebook: "TechStoreOficial",
  announcement1: "Frete grátis em compras acima de R$ 299",
  announcement2: "Garantia estendida em todos os produtos",
  announcementContact: "WhatsApp: (11) 88888-8888",
  politicas_troca: "Trocas e devoluções em até 15 dias",
  politicas_gerais: "Política de privacidade e termos de uso",
  appearance: {
    primaryColor: "#2563eb",
    secondaryColor: "#4f46e5",
    accentColor: "#f59e0b"
  }
}

export function useStoreData() {
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pathname = usePathname()

  // Detectar se está na demo
  const isDemo = pathname?.startsWith('/demo')
  const isDemo2 = pathname?.startsWith('/demo2')

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true)
        
        // Se está na demo, usar dados mockados
        if (isDemo || isDemo2) {
          const demoData = isDemo2 ? demo2StoreData : demoStoreData
          setStoreData(demoData)
          setLoading(false)
          return
        }

        // Se não está na demo, buscar dados reais
        const response = await fetch('/api/store-data')
        
        if (!response.ok) {
          throw new Error('Erro ao carregar dados da loja')
        }
        
        const data = await response.json()
        
        // Mapear campos do banco para interface
        const mappedData: StoreData = {
          ...data,
          exchangePolicy: data.politicas_troca,
          privacyPolicy: data.politicas_gerais,
          appearance: data.appearance_settings ? JSON.parse(data.appearance_settings) : undefined,
        }
        
        setStoreData(mappedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
        console.error('Erro ao carregar dados da loja:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [isDemo, isDemo2])

  return { storeData, loading, error }
} 