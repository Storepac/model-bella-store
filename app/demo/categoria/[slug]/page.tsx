"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { ProductCard } from "@/components/product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import Image from "next/image"

// Dados mockados para a demo
const demoCategories = [
  {
    id: "1",
    name: "Vestidos",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
    productCount: 12,
    slug: "vestidos",
    description: "Vestidos femininos elegantes para todas as ocasiões"
  },
  {
    id: "2", 
    name: "Blusas",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
    productCount: 8,
    slug: "blusas",
    description: "Blusas femininas confortáveis e estilosas"
  },
  {
    id: "3",
    name: "Calças",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg", 
    productCount: 15,
    slug: "calcas",
    description: "Calças femininas para todos os estilos"
  },
  {
    id: "4",
    name: "Acessórios",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg",
    productCount: 6,
    slug: "acessorios",
    description: "Acessórios femininos para complementar seu look"
  }
]

const demoProducts = {
  vestidos: [
    {
      id: "1",
      name: "Vestido Floral Primavera",
      price: 89.90,
      originalPrice: 129.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
      category: "Vestidos",
      slug: "vestido-floral-primavera",
      isNew: true,
      isPromotion: false,
      isLaunch: false,
      isFeatured: true,
      rating: 4.8,
      reviews: 24
    },
    {
      id: "5",
      name: "Vestido Longo Elegante",
      price: 159.90,
      originalPrice: 199.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
      category: "Vestidos",
      slug: "vestido-longo-elegante",
      isNew: false,
      isPromotion: true,
      isLaunch: false,
      isFeatured: true,
      rating: 4.6,
      reviews: 28
    },
    {
      id: "7",
      name: "Vestido Casual Verão",
      price: 69.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg",
      category: "Vestidos",
      slug: "vestido-casual-verao",
      isNew: true,
      isPromotion: false,
      isLaunch: false,
      isFeatured: false,
      rating: 4.4,
      reviews: 16
    }
  ],
  blusas: [
    {
      id: "2",
      name: "Blusa Básica Algodão Premium",
      price: 45.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
      category: "Blusas",
      slug: "blusa-basica-algodao",
      isNew: false,
      isPromotion: true,
      isLaunch: false,
      isFeatured: false,
      rating: 4.5,
      reviews: 18
    },
    {
      id: "6",
      name: "Blusa Transparente",
      price: 35.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
      category: "Blusas",
      slug: "blusa-transparente",
      isNew: true,
      isPromotion: false,
      isLaunch: false,
      isFeatured: false,
      rating: 4.3,
      reviews: 15
    },
    {
      id: "8",
      name: "Blusa Social Elegante",
      price: 55.90,
      originalPrice: 75.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg",
      category: "Blusas",
      slug: "blusa-social-elegante",
      isNew: false,
      isPromotion: false,
      isLaunch: true,
      isFeatured: false,
      rating: 4.7,
      reviews: 22
    }
  ],
  calcas: [
    {
      id: "3",
      name: "Calça Jeans Skinny",
      price: 79.90,
      originalPrice: 99.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg",
      category: "Calças",
      slug: "calca-jeans-skinny",
      isNew: false,
      isPromotion: false,
      isLaunch: true,
      isFeatured: true,
      rating: 4.9,
      reviews: 31
    },
    {
      id: "9",
      name: "Calça Social Preta",
      price: 89.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
      category: "Calças",
      slug: "calca-social-preta",
      isNew: true,
      isPromotion: false,
      isLaunch: false,
      isFeatured: false,
      rating: 4.6,
      reviews: 19
    },
    {
      id: "10",
      name: "Calça Legging Esportiva",
      price: 49.90,
      originalPrice: 69.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
      category: "Calças",
      slug: "calca-legging-esportiva",
      isNew: false,
      isPromotion: true,
      isLaunch: false,
      isFeatured: false,
      rating: 4.8,
      reviews: 27
    }
  ],
  acessorios: [
    {
      id: "4",
      name: "Bolsa Couro Sintético",
      price: 65.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg",
      category: "Acessórios",
      slug: "bolsa-couro-sintetico",
      isNew: true,
      isPromotion: false,
      isLaunch: false,
      isFeatured: false,
      rating: 4.7,
      reviews: 12
    },
    {
      id: "11",
      name: "Colar Dourado Elegante",
      price: 29.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg",
      category: "Acessórios",
      slug: "colar-dourado-elegante",
      isNew: false,
      isPromotion: true,
      isLaunch: false,
      isFeatured: false,
      rating: 4.4,
      reviews: 8
    },
    {
      id: "12",
      name: "Pulseira Prateada",
      price: 19.90,
      originalPrice: 25.90,
      image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
      category: "Acessórios",
      slug: "pulseira-prateada",
      isNew: true,
      isPromotion: false,
      isLaunch: false,
      isFeatured: false,
      rating: 4.2,
      reviews: 14
    }
  ]
}

export default function DemoCategoryPage({ params }: { params: { slug: string } }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showToast, setShowToast] = useState(false)
  const [toastProduct, setToastProduct] = useState("")
  const { addItem } = useCart()

  const category = demoCategories.find(cat => cat.slug === params.slug)
  const products = demoProducts[params.slug as keyof typeof demoProducts] || []

  const handleAddToCart = (product: any) => {
    addItem(product)
    setToastProduct(product.name)
    setShowToast(true)
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Categoria não encontrada</h1>
          <Link href="/demo">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Demo
            </Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <main>
        {/* Category Header */}
        <section className="py-8 md:py-16 bg-gradient-to-r from-pink-100 to-purple-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-4 md:mb-6">
              <Link href="/demo">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Demo
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 overflow-hidden rounded-lg">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-4">{category.name}</h1>
                <p className="text-sm md:text-lg text-gray-600 mb-3 md:mb-4">{category.description}</p>
                <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4 text-sm md:text-base">
                  <span className="text-gray-500">{products.length} produtos</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">Categoria Demo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Produtos em {category.name}</h2>
                <p className="text-muted-foreground text-sm md:text-base">Descubra nossa seleção de {category.name.toLowerCase()}</p>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
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
            {products.length > 0 ? (
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isDemo={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-base md:text-lg">Nenhum produto encontrado nesta categoria.</p>
                <p className="text-gray-400 mt-2 text-sm md:text-base">Esta é uma categoria de demonstração.</p>
              </div>
            )}
            
            {/* Load More */}
            {products.length > 0 && (
              <div className="text-center mt-8 md:mt-12">
                <Button size="lg" variant="outline" className="px-6 md:px-8 bg-transparent">
                  Carregar Mais Produtos
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
    </Layout>
  )
} 