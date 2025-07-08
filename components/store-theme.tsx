"use client"

import { useEffect } from 'react'
import { useStoreData } from '@/hooks/use-store-data'

export function StoreThemeProvider() {
  const { storeData } = useStoreData()

  useEffect(() => {
    if (!storeData?.appearance) return
    const root = document.documentElement
    const a = storeData.appearance
    const set = (key: string, val?: string) => {
      if (val) root.style.setProperty(`--${key}`, val)
    }
    set('primary', a.primaryColor)
    set('secondary', a.secondaryColor)
    set('accent', a.accentColor)
    set('background', a.backgroundColor)
    set('foreground', a.textColor)
  }, [storeData?.appearance])

  return null
} 