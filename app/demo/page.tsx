"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryGrid } from "@/components/category-grid"
import { ProductCard } from "@/components/product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List, Star, ShoppingBag, Heart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import Image from "next/image"
import { StoreLogo } from "@/components/store-logo"

// Dados mockados para a demo
const demoCategories = [
  {
    id: "1",
    name: "Vestidos",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
    productCount: 12,
    slug: "vestidos"
  },
  {
    id: "2", 
    name: "Blusas",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
    productCount: 8,
    slug: "blusas"
  },
  {
    id: "3",
    name: "Calças",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg", 
    productCount: 15,
    slug: "calcas"
  },
  {
    id: "4",
    name: "Acessórios",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg",
    productCount: 6,
    slug: "acessorios"
  }
]

const demoProducts = [
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
    id: "5",
    name: "Vestido Longo Elegante",
    price: 159.90,
    originalPrice: 199.90,
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
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
    id: "6",
    name: "Blusa Transparente",
    price: 35.90,
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
    category: "Blusas",
    slug: "blusa-transparente",
    isNew: true,
    isPromotion: false,
    isLaunch: false,
    isFeatured: false,
    rating: 4.3,
    reviews: 15
  }
]

const demoBanners = [
  {
    id: "1",
    title: "Coleção Primavera",
    subtitle: "Até 50% de desconto",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
    link: "/demo/categoria/vestidos"
  },
  {
    id: "2", 
    title: "Novos Lançamentos",
    subtitle: "Confira as últimas tendências",
    image: "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
    link: "/demo/categoria/blusas"
  }
]

function DemoHeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0)

  return (
    <section className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-r from-pink-100 to-purple-100">
      <div className="absolute inset-0">
        <Image
          src={demoBanners[currentBanner].image}
          alt={demoBanners[currentBanner].title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
            {demoBanners[currentBanner].title}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 text-gray-100">
            {demoBanners[currentBanner].subtitle}
          </p>
          <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg">
            <Link href={demoBanners[currentBanner].link}>
              Ver Coleção
            </Link>
          </Button>
        </div>
      </div>

      {/* Banner Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {demoBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
              index === currentBanner ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

function DemoCategoryGrid() {
  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Nossas Categorias</h2>
          <p className="text-muted-foreground text-sm md:text-base">Descubra produtos organizados por categoria</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {demoCategories.map((category) => (
            <Link
              key={category.id}
              href={`/demo/categoria/${category.slug}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white">
                  <h3 className="font-semibold text-sm md:text-lg mb-1">{category.name}</h3>
                  <p className="text-xs md:text-sm opacity-90">{category.productCount} produtos</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function MiddleBanners() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="relative h-48 md:h-64 overflow-hidden rounded-lg">
            <Image
              src="https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg"
              alt="Promoção Especial"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h3 className="text-lg md:text-2xl font-bold mb-2">Promoção Especial</h3>
                <p className="mb-3 md:mb-4 text-sm md:text-base">Até 70% de desconto</p>
                <Button asChild variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Link href="/demo/categoria/calcas">
                    Ver Ofertas
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative h-48 md:h-64 overflow-hidden rounded-lg">
            <Image
              src="https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg"
              alt="Novos Lançamentos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h3 className="text-lg md:text-2xl font-bold mb-2">Novos Lançamentos</h3>
                <p className="mb-3 md:mb-4 text-sm md:text-base">As últimas tendências</p>
                <Button asChild variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Link href="/demo/categoria/acessorios">
                    Descobrir
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhatsAppSection() {
  const whatsapp = "(11) 99999-9999"
  const storeName = "Bella Store"
  const whatsappNumber = whatsapp.replace(/\D/g, '')
  return (
    <section className="py-8 md:py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Fale Conosco no WhatsApp</h2>
          <p className="text-green-100 mb-6 md:mb-8 text-sm md:text-base">
            Tire suas dúvidas, faça pedidos ou receba atendimento personalizado direto no WhatsApp!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button 
              asChild
              className="bg-white text-green-600 hover:bg-green-50 px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-semibold"
            >
              <a 
                href={`https://wa.me/55${whatsappNumber}?text=Olá! Gostaria de conhecer mais sobre os produtos da ${storeName}.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Conversar no WhatsApp
              </a>
            </Button>
          </div>
          <p className="text-green-100 text-sm mt-4">
            {whatsapp}
          </p>
        </div>
      </div>
    </section>
  )
}

export default function DemoPage() {
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
        <DemoHeroBanner />
        <DemoCategoryGrid />
        <MiddleBanners />
        
        {/* Products Section */}
        <section className="py-8 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Produtos em Destaque</h2>
                <p className="text-muted-foreground text-sm md:text-base">Descubra nossa seleção especial de produtos</p>
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
            {demoProducts.length > 0 ? (
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {demoProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isDemo={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-base md:text-lg">Nenhum produto encontrado.</p>
                <p className="text-gray-400 mt-2 text-sm md:text-base">Adicione produtos no dashboard para exibi-los aqui.</p>
              </div>
            )}
            
            {/* Load More */}
            {demoProducts.length > 0 && (
              <div className="text-center mt-8 md:mt-12">
                <Button size="lg" variant="outline" className="px-6 md:px-8 bg-transparent">
                  Carregar Mais Produtos
                </Button>
              </div>
            )}
          </div>
        </section>
        
        <WhatsAppSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <StoreLogo size="lg" className="mb-4" />
              <p className="text-gray-400 text-sm">
                Sua loja de moda feminina online com as melhores tendências e preços incríveis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Atendimento</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Segunda a Sexta: 9h às 18h</p>
                <p>Sábado: 9h às 15h</p>
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
          <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Bella Store. CNPJ: 12.345.678/0001-90. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      
      <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
    </Layout>
  )
} 