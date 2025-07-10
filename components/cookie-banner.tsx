"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Cookie, Shield, Settings } from 'lucide-react'
import Link from 'next/link'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Verificar se o usuário já fez uma escolha sobre cookies
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setShowBanner(false)
  }

  const handleSettings = () => {
    // Abrir modal de configurações de cookies (pode ser implementado depois)
    console.log('Abrir configurações de cookies')
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Conteúdo */}
          <div className="flex-1 flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <Cookie className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Utilizamos cookies para melhorar sua experiência
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Usamos cookies essenciais para o funcionamento do site e cookies de análise para entender como você interage conosco. 
                Ao continuar navegando, você concorda com nossa{' '}
                <Link href="/politica-privacidade" className="text-blue-600 hover:underline">
                  Política de Privacidade
                </Link>.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSettings}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configurar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Rejeitar
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Cookie className="h-4 w-4" />
              Aceitar Todos
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAccept}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 