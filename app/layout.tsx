import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/lib/cart-context"
import { StoreThemeProvider } from '@/components/store-theme'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bella Store - Moda Feminina",
  description: "Sua loja de moda feminina online",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <StoreThemeProvider />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
