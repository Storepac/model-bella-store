"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { CategoryProductCard } from "@/components/category-product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import Image from "next/image"

const acessorios = [
  {
    id: "a1",
    name: "Bolsa Transversal Couro",
    description: "Bolsa transversal em couro sintético. Prática e elegante para o dia a dia.",
    price: 129.9,
    originalPrice: 159.9,
    images: [
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
      "/placeholder.svg?height=500&width=400",
    ],
    category: "Acessórios",
    stock: 25,
  },
  {
    id: "a2",
    name: "Óculos de Sol Feminino",
    description: "Óculos de sol com proteção UV. Design moderno e sofisticado.",
    price: 89.9,
    images: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    category: "Acessórios",
    isNew: true,
    stock: 40,
  },
  {
    id: "a3",
    name: "Cinto Fivela Dourada",
    description: "Cinto em couro sintético com fivela dourada. Acessório versátil para diversos looks.",
    price: 49.9,
    originalPrice: 69.9,
    images: ["/placeholder.svg?height=500&width=400"],
    category: "Acessórios",
    stock: 30,
  },
  {
    id: "a4",
    name: "Conjunto Bijuterias Delicadas",
    description: "Conjunto com colar, brincos e pulseira. Bijuterias delicadas folheadas a ouro.",
    price: 79.9,
    images: ["/placeholder.svg?height=500&width=400", "/placeholder.svg?height=500&width=400"],
    category: "Acessórios",
    isNew: true,
    stock: 15,
  },
]

export default function AcessoriosPage() {
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
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <nav className="text-sm text-muted-foreground mb-4">
                  <a href="/" className="hover:text-pink-500">
                    Home
                  </a>{" "}
                  / <span className="text-gray-900">Acessórios</span>
                </nav>
                <h1 className="text-4xl font-bold mb-4">Acessórios</h1>
                <p className="text-lg text-muted-foreground">
                  Finalize seu look com nossos acessórios exclusivos. Bolsas, bijuterias e muito mais para você arrasar.
                </p>
                <div className="mt-6">
                  <span className="text-sm text-muted-foreground">{acessorios.length} produtos encontrados</span>
                </div>
              </div>
              <div className="relative h-64 md:h-80">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Coleção de Acessórios"
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
            {acessorios.map((produto) => (
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
