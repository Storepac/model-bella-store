"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import CategoryProductCard from "@/components/category-product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import Image from "next/image"

// Mock data para blusas
const blusas = [
  {
    id: "b1",
    name: "Blusa Cropped Manga Longa",
    description: "Blusa cropped moderna com manga longa. Perfeita para compor looks despojados e estilosos.",
    price: 89.9,
    images: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    category: "Blusas",
    isNew: true,
    stock: 25,
  },
  {
    id: "b2",
    name: "Blusa Social Feminina",
    description: "Blusa social elegante para ambiente profissional. Tecido de qualidade e modelagem impecável.",
    price: 129.9,
    originalPrice: 159.9,
    images: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    category: "Blusas",
    stock: 18,
  },
  {
    id: "b3",
    name: "Blusa Estampada Floral",
    description: "Blusa com estampa floral delicada. Ideal para looks românticos e femininos.",
    price: 79.9,
    images: ["/placeholder.svg?height=500&width=400"],
    category: "Blusas",
    stock: 30,
  },
  {
    id: "b4",
    name: "Blusa Básica Algodão",
    description: "Blusa básica em algodão 100%. Confortável e versátil para o dia a dia.",
    price: 49.9,
    originalPrice: 69.9,
    images: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    category: "Blusas",
    isNew: true,
    stock: 40,
  },
]

export default function BlusasPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showToast, setShowToast] = useState(false)
  const [toastProduct, setToastProduct] = useState("")

  const handleAddToCart = (productName: string) => {
    setToastProduct(productName)
    setShowToast(true)
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <nav className="text-sm text-muted-foreground mb-4">
                  <a href="/" className="hover:text-pink-500">
                    Home
                  </a>{" "}
                  / <span className="text-gray-900">Blusas</span>
                </nav>
                <h1 className="text-4xl font-bold mb-4">Blusas</h1>
                <p className="text-lg text-muted-foreground">
                  Encontre a blusa perfeita para cada ocasião. Do básico ao sofisticado, temos opções para todos os
                  estilos.
                </p>
                <div className="mt-6">
                  <span className="text-sm text-muted-foreground">{blusas.length} produtos encontrados</span>
                </div>
              </div>
              <div className="relative h-64 md:h-80">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Coleção de Blusas"
                  fill
                  className="object-cover rounded-lg"
                />
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
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {blusas.map((produto) => (
              <CategoryProductCard
                key={produto.id}
                product={produto}
                onAddToCart={() => handleAddToCart(produto.name)}
              />
            ))}
          </div>
        </div>

        {/* Toast */}
        <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
      </div>
    </Layout>
  )
}
