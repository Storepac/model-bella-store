"use client"

import { useState } from "react"
import { Search, ShoppingBag, Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { storeData } from "@/lib/store-data"
import { categories } from "@/lib/category-data"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { getItemCount, toggleCart } = useCart()

  const announcementText = [storeData.announcement1, storeData.announcement2, storeData.announcementContact]
    .filter(Boolean)
    .join(" • ")

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      {/* Top bar with marquee */}
      <div className="bg-gray-900 text-white text-sm py-2 overflow-x-hidden">
        <div className="flex whitespace-nowrap">
          <div className="marquee flex-shrink-0">
            <span className="mx-4">{announcementText}</span>
            <span className="mx-4">{announcementText}</span>
            <span className="mx-4">{announcementText}</span>
            <span className="mx-4">{announcementText}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Logo */}
          <div className="flex-1 md:flex-none">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                {storeData.name}
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <Link href="/" className="text-sm font-medium hover:text-pink-500 transition-colors">
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="text-sm font-medium hover:text-pink-500 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
              <Link href="/login">
                <Settings className="h-5 w-5" />
              </Link>
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

        {/* Search bar - Mobile/Desktop */}
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium hover:text-pink-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categoria/${category.slug}`}
                className="block text-sm font-medium hover:text-pink-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
