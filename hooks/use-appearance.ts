"use client"

import { useState, useEffect } from 'react'
import { resolveStoreIdClient } from '@/lib/store-id'

export interface AppearanceSettings {
  primaryColor: string
  secondaryColor: string
  buttonColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  headerColor: string
  footerColor: string
  linkColor: string
  storeName: string
  logoUrl: string
  favicon: string
  headerText: string
  headerSubtext: string
  headerButtonText: string
  headerBackgroundColor: string
  headerImage: string
  showHeaderBanner: boolean
  headerStyle: string
  headerLayout: string
  showSearchBar: boolean
  showCartIcon: boolean
  showUserIcon: boolean
  freeShippingText: string
  installmentText: string
  showTopBar: boolean
  topBarColor: string
  topBarTextColor: string
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
  showSocialMedia: boolean
  socialMediaStyle: string
  fontFamily: string
  fontSize: string
  fontWeight: string
  containerWidth: string
  borderRadius: string
  spacing: string
  showShadows: boolean
  showAnimations: boolean
  showGradients: boolean
  cardStyle: string
}

export function useAppearance() {
  const [settings, setSettings] = useState<AppearanceSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAppearance = async () => {
      try {
        setLoading(true)
        
        // Resolver storeId
        const storeId = await resolveStoreIdClient()
        
        // Buscar configurações
        const response = await fetch(`/api/appearance/${storeId}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          setSettings(data.data.settings || data.data)
        } else {
          setError('Erro ao carregar configurações de aparência')
        }
      } catch (err) {
        setError('Erro ao carregar configurações')
        console.error('Erro ao carregar aparência:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAppearance()
  }, [])

  // Aplicar estilos CSS customizados
  useEffect(() => {
    if (settings && typeof window !== 'undefined') {
      const root = document.documentElement
      
      // Aplicar variáveis CSS
      root.style.setProperty('--primary-color', settings.primaryColor)
      root.style.setProperty('--secondary-color', settings.secondaryColor)
      root.style.setProperty('--button-color', settings.buttonColor)
      root.style.setProperty('--accent-color', settings.accentColor)
      root.style.setProperty('--background-color', settings.backgroundColor)
      root.style.setProperty('--text-color', settings.textColor)
      root.style.setProperty('--header-color', settings.headerColor)
      root.style.setProperty('--footer-color', settings.footerColor)
      root.style.setProperty('--link-color', settings.linkColor)
      root.style.setProperty('--border-radius', settings.borderRadius)
      root.style.setProperty('--container-width', settings.containerWidth)
      
      // Aplicar fonte
      if (settings.fontFamily) {
        root.style.setProperty('--font-family', settings.fontFamily)
      }
      
      // Adicionar classe para estilos condicionais
      const body = document.body
      body.classList.toggle('shadows-enabled', settings.showShadows)
      body.classList.toggle('animations-enabled', settings.showAnimations)
      body.classList.toggle('gradients-enabled', settings.showGradients)
      body.classList.add(`spacing-${settings.spacing}`)
      body.classList.add(`font-size-${settings.fontSize}`)
      body.classList.add(`font-weight-${settings.fontWeight}`)
      body.classList.add(`card-style-${settings.cardStyle}`)
    }
  }, [settings])

  return { settings, loading, error }
} 