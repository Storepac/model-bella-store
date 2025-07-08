"use client"

import { useState, useEffect } from 'react'

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

export function useStoreData() {
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true)
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
  }, [])

  return { storeData, loading, error }
} 