"use client"

import type React from "react"

import { Header } from "@/components/header"
import { CartDrawer } from "@/components/cart-drawer"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CartDrawer />
      {children}
    </div>
  )
}
