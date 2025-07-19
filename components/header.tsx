"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingBag, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { useStoreData } from "@/hooks/use-store-data"
import { CategoryMenu, CategoryMenuMobile } from "@/components/category-menu"
import { MegaMenu } from "@/components/mega-menu"
import { StoreLogo } from "@/components/store-logo"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { getItemCount, toggleCart } = useCart()
  const { storeData, loading } = useStoreData()
  const pathname = usePathname()

  // Detectar se está na demo
  const isDemo = pathname?.startsWith('/demo')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      setIsLoggedIn(!!user)
    }
  }, [])

  const handleSettingsClick = () => {
    window.location.href = isLoggedIn ? '/dashboard' : '/login'
  }

  const announcementText = !loading && storeData
    ? [storeData.announcement1, storeData.announcement2, storeData.announcementContact].filter(Boolean).join(" • ")
    : "Carregando..."

  const renderTopBar = () => {
    if (loading) {
      return (
        <div className="bg-gray-900 text-white text-sm py-2 text-center">
          <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto animate-pulse"></div>
        </div>
      );
    }
    if (!announcementText || announcementText === " •  • ") return null;

    return (
      <div className="text-white text-sm py-2 overflow-x-hidden" style={{ backgroundColor: 'var(--footer-color)', color: 'var(--background-color)' }}>
        <div className="flex whitespace-nowrap">
          <div className="marquee flex-shrink-0">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="mx-4">{announcementText}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <header className="sticky top-0 z-50 w-full header-custom backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      {renderTopBar()}
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          <div className="flex-1 md:flex-none">
            <Link href={isDemo ? "/demo" : "/"}>
              <StoreLogo size="md" className="cursor-pointer" />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link href={isDemo ? "/demo" : "/"} className="text-sm font-medium link-custom transition-colors">
              Home
            </Link>
            {isDemo && !pathname?.startsWith('/demo2') ? (
              <>
                <MegaMenu categorySlug="feminino" label="Feminino" />
                <MegaMenu categorySlug="masculino" label="Masculino" />
                <MegaMenu categorySlug="infantil" label="Infantil" />
              </>
            ) : isDemo && pathname?.startsWith('/demo2') ? (
              <>
                <MegaMenu categorySlug="smartphones" label="Smartphones" />
                <MegaMenu categorySlug="notebooks" label="Notebooks" />
                <MegaMenu categorySlug="fones" label="Fones" />
              </>
            ) : (
              <>
                <MegaMenu categorySlug="feminino" label="Feminino" />
                <MegaMenu categorySlug="masculino" label="Masculino" />
                <MegaMenu categorySlug="infantil" label="Infantil" />
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex"
              onClick={handleSettingsClick}
              title={isLoggedIn ? "Ir para Dashboard" : "Fazer Login"}
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingBag className="h-5 w-5" />
              {getItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-pink-500">
                  {getItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Busque por produtos, marcas ou categorias..."
              className="pl-10 h-12 bg-gray-50 border-0 focus:bg-white"
            />
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4">
            <Link
              href={isDemo ? "/demo" : "/"}
              className="block text-sm font-medium hover:text-pink-500 transition-colors mb-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <CategoryMenuMobile />
          </nav>
        </div>
      )}
    </header>
  )
}
