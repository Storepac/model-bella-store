"use client"

import { useAppearance } from '@/hooks/use-appearance'

export function StoreThemeProvider() {
  const { settings, loading, error } = useAppearance()

  // O hook useAppearance já aplica automaticamente todas as configurações
  // via CSS variables e classes, então não precisamos fazer nada aqui
  
  return null
} 