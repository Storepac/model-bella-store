import { useState, useEffect } from 'react'

export interface StoreData {
  name: string
  description: string
  cnpj: string
  ie: string
  phone: string
  whatsapp: string
  email: string
  website: string
  address: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  workingHours: any
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
  freeShippingMinValue: number
  shippingTime: string
  returnPolicy: string
  privacyPolicy: string
  termsOfService: string
  exchangePolicy: string
  announcement1: string
  announcement2: string
  announcementContact: string
  colors: {
    primary: string
    secondary: string
    buttons: string
  }
  font: string
  banners: any[]
  isActive: boolean
  plano: string
}

export function useStoreData() {
  const [storeData, setStoreData] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await fetch('/api/store-data', {
          cache: 'no-store'
        })
        const data = await response.json()
        
        if (data.success) {
          setStoreData(data.data)
        } else {
          setError(data.error || 'Erro ao carregar dados da loja')
        }
      } catch (err) {
        setError('Erro ao carregar dados da loja')
        console.error('Erro ao carregar dados da loja:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [])

  return { storeData, loading, error }
} 