"use client"

import { Input } from "@/components/ui/input"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryGrid } from "@/components/category-grid"
import { ProductCard } from "@/components/product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { mockBanners } from "@/lib/banner-data"
import Image from "next/image"
import { storeData } from "@/lib/store-data"

// Mock data para demonstração
const mockProducts = [
  {
    id: "1",
    name: "Vestido Midi Floral Primavera",
    price: 159.9,
    originalPrice: 199.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Vestidos",
    isNew: true,
  },
  {
    id: "2",
    name: "Blusa Cropped Manga Longa",
    price: 89.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Blusas",
  },
  {
    id: "3",
    name: "Calça Jeans Skinny Destroyed",
    price: 129.9,
    originalPrice: 179.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Calças",
  },
  {
    id: "4",
    name: "Tênis Chunky Branco",
    price: 199.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Sapatos",
    isNew: true,
  },
  {
    id: "5",
    name: "Saia Plissada Mini",
    price: 79.9,
    originalPrice: 99.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Saias",
  },
  {
    id: "6",
    name: "Blazer Oversized Xadrez",
    price: 189.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Blazers",
  },
  {
    id: "7",
    name: "Body Básico Manga Longa",
    price: 59.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Bodies",
  },
  {
    id: "8",
    name: "Sandália Salto Bloco",
    price: 149.9,
    originalPrice: 199.9,
    image: "/placeholder.svg?height=400&width=300",
    category: "Sapatos",
  },
]

const MiddleBanners = () => {
  const middleBanners = mockBanners.filter(
    (b) => (b.position === "homepage-middle-1" || b.position === "homepage-middle-2") && b.isActive,
  )

  if (middleBanners.length === 0) return null

  return (
    <div className="container mx-auto px-4 my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {middleBanners.map((banner) => (
          <Link href={banner.link} key={banner.id}>
            <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image
                src={banner.image || "/placeholder.svg"}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const FooterBanner = () => {
  const footerBanner = mockBanners.find((b) => b.position === "homepage-footer" && b.isActive)

  if (!footerBanner) return null

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">{footerBanner.title}</h2>
          <p className="text-muted-foreground mb-8">{footerBanner.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-4 py-3 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
            />
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6">{footerBanner.buttonText}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showToast, setShowToast] = useState(false)
  const [toastProduct, setToastProduct] = useState("")
  const { addItem } = useCart()

  const handleAddToCart = (product: any) => {
    addItem(product)
    setToastProduct(product.name)
    setShowToast(true)
  }

  return (
    <Layout>
      <main>
        <HeroBanner />
        <CategoryGrid />
        <MiddleBanners />

        {/* Products Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Produtos em Destaque</h2>
                <p className="text-muted-foreground">Descubra nossa seleção especial de produtos</p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {mockProducts.map((product) => (
                <Link key={product.id} href={`/produto/${product.id}`}>
                  <ProductCard product={product} onAddToCart={() => handleAddToCart(product)} />
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline" className="px-8 bg-transparent">
                Carregar Mais Produtos
              </Button>
            </div>
          </div>
        </section>

        <FooterBanner />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Bella Store
              </h3>
              <p className="text-gray-400 text-sm">
                Sua loja de moda feminina online com as melhores tendências e preços incríveis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Atendimento</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Segunda a Sexta: 9h às 18h</p>
                <p>Sábado: 9h às 14h</p>
                <p>WhatsApp: (11) 99999-9999</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Institucional</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">
                  Sobre nós
                </a>
                <a href="#" className="block hover:text-white">
                  Política de privacidade
                </a>
                <a href="#" className="block hover:text-white">
                  Termos de uso
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Redes Sociais</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#" className="block hover:text-white">
                  Instagram
                </a>
                <a href="#" className="block hover:text-white">
                  Facebook
                </a>
                <a href="#" className="block hover:text-white">
                  TikTok
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} {storeData.name}. CNPJ: {storeData.cnpj}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Toast */}
      <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
    </Layout>
  )
}
