"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Header } from "@/components/header"
import { CartDrawer } from "@/components/cart-drawer"
import { FloatingCoupon } from "@/components/floating-coupon"
import { CookieBanner } from "@/components/cookie-banner"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [storeId, setStoreId] = useState<number | null>(null)

  useEffect(() => {
    // Buscar storeId do localStorage ou da URL
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const urlStoreId = new URLSearchParams(window.location.search).get('store')
      
      if (user?.storeId) {
        setStoreId(user.storeId)
      } else if (urlStoreId) {
        setStoreId(parseInt(urlStoreId))
      } else {
        // Loja padrão para demo
        setStoreId(1)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CartDrawer />
      {children}
      <FloatingCoupon storeId={storeId || undefined} />
      <CookieBanner />
    </div>
  )
}
