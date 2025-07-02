"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { CategoryProductCard } from "@/components/category-product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import Image from "next/image"
import { mockBanners } from "@/lib/banner-data"

// Mock data para vestidos
const vestidos = [
  {
    id: "v1",
    name: "Vestido Midi Floral Primavera",
    description:
      "Vestido midi com estampa floral delicada, perfeito para ocasiões especiais. Modelagem que valoriza a silhueta.",
    price: 159.9,
    originalPrice: 199.9,
    images: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    category: "Vestidos",
    isNew: true,
    stock: 8,
  },
  {
    id: "v2",
    name: "Vestido Longo Festa Elegante",
    description: "Vestido longo para festas e eventos especiais. Tecido fluido e caimento perfeito.",
    price: 289.9,
    originalPrice: 349.9,
    images: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    category: "Vestidos",
    stock: 12,
  },
  {
    id: "v3",
    name: "Vestido Curto Casual Verão",
    description: "Vestido curto e descontraído, ideal para o dia a dia. Confortável e estiloso.",
    price: 89.9,
    images: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    category: "Vestidos",
    isNew: true,
    stock: 15,
  },
  {
    id: "v4",
    name: "Vestido Tubinho Executivo",
    description: "Vestido tubinho clássico para ambiente profissional. Elegante e sofisticado.",
    price: 199.9,
    images: ["/placeholder.svg?height=500&width=400"],
    category: "Vestidos",
    stock: 6,
  },
  {
    id: "v5",
    name: "Vestido Boho Chic Estampado",
    description: "Vestido estilo boho com estampa única. Perfeito para looks despojados e modernos.",
    price: 139.9,
    originalPrice: 179.9,
    images: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    category: "Vestidos",
    stock: 10,
  },
  {
    id: "v6",
    name: "Vestido Envelope Viscose",
    description: "Vestido envelope em viscose macia. Amarração na cintura e modelagem universal.",
    price: 119.9,
    images: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    category: "Vestidos",
    isNew: true,
    stock: 20,
  },
]

const sortOptions = [
  { value: "relevance", label: "Mais Relevantes" },
  { value: "price-asc", label: "Menor Preço" },
  { value: "price-desc", label: "Maior Preço" },
  { value: "newest", label: "Mais Novos" },
  { value: "name", label: "A-Z" },
]

export default function VestidosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [showToast, setShowToast] = useState(false)
  const [toastProduct, setToastProduct] = useState("")

  const handleAddToCart = (productName: string) => {
    setToastProduct(productName)
    setShowToast(true)
  }

  const categoryBanner = mockBanners.find(
    (b) => b.position === "category-header" && b.categorySlug === "vestidos" && b.isActive,
  )

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <nav className="text-sm text-muted-foreground mb-4">
                  <a href="/" className="hover:text-pink-500">
                    Home
                  </a>{" "}
                  / <span className="text-gray-900">Vestidos</span>
                </nav>
                <h1 className="text-4xl font-bold mb-4">Vestidos</h1>
                <p className="text-lg text-muted-foreground">
                  Descubra nossa coleção de vestidos para todas as ocasiões. Do casual ao elegante, temos o vestido
                  perfeito para você.
                </p>
                <div className="mt-6">
                  <span className="text-sm text-muted-foreground">{vestidos.length} produtos encontrados</span>
                </div>
              </div>
              <div className="relative h-64 md:h-80">
                {categoryBanner ? (
                  <Image
                    src={categoryBanner.image || "/placeholder.svg"}
                    alt={categoryBanner.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white border-b sticky top-16 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Visualização:</span>
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-8">
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {vestidos.map((produto) => (
              <CategoryProductCard
                key={produto.id}
                product={produto}
                onAddToCart={() => handleAddToCart(produto.name)}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 bg-transparent">
              Carregar Mais Produtos
            </Button>
          </div>
        </div>

        {/* Toast */}
        <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
      </div>
    </Layout>
  )
}
