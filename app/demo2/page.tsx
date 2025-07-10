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

// Dados mockados para a demo2 (eletrônicos)
const demo2Categories = [
  {
    id: "1",
    name: "Smartphones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    productCount: 25,
    slug: "smartphones"
  },
  {
    id: "2", 
    name: "Notebooks",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    productCount: 18,
    slug: "notebooks"
  },
  {
    id: "3",
    name: "Fones de Ouvido",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", 
    productCount: 32,
    slug: "fones"
  },
  {
    id: "4",
    name: "Smartwatches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    productCount: 15,
    slug: "smartwatches"
  }
]

const demo2Products = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 8999.90,
    originalPrice: 9999.90,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
    category: "Smartphones",
    slug: "iphone-15-pro-max",
    isNew: true,
    isPromotion: false,
    isLaunch: false,
    isFeatured: true,
    rating: 4.9,
    reviews: 156
  },
  {
    id: "2",
    name: "MacBook Air M2",
    price: 7999.90,
    originalPrice: 8999.90,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
    category: "Notebooks",
    slug: "macbook-air-m2",
    isNew: false,
    isPromotion: true,
    isLaunch: false,
    isFeatured: false,
    rating: 4.8,
    reviews: 89
  },
  {
    id: "3",
    name: "AirPods Pro 2",
    price: 1899.90,
    originalPrice: 2299.90,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
    category: "Fones de Ouvido",
    slug: "airpods-pro-2",
    isNew: false,
    isPromotion: false,
    isLaunch: true,
    isFeatured: true,
    rating: 4.7,
    reviews: 234
  },
  {
    id: "4",
    name: "Apple Watch Series 9",
    price: 3999.90,
    originalPrice: 4499.90,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
    category: "Smartwatches",
    slug: "apple-watch-series-9",
    isNew: true,
    isPromotion: false,
    isLaunch: false,
    isFeatured: false,
    rating: 4.9,
    reviews: 67
  },
  {
    id: "5",
    name: "Samsung Galaxy S24 Ultra",
    price: 7999.90,
    originalPrice: 8999.90,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
    category: "Smartphones",
    slug: "samsung-galaxy-s24-ultra",
    isNew: false,
    isPromotion: true,
    isLaunch: false,
    isFeatured: true,
    rating: 4.8,
    reviews: 95
  },
  {
    id: "6",
    name: "Dell XPS 13",
    price: 6999.90,
    originalPrice: 7999.90,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
    category: "Notebooks",
    slug: "dell-xps-13",
    isNew: true,
    isPromotion: false,
    isLaunch: false,
    isFeatured: false,
    rating: 4.7,
    reviews: 67
  }
]

const demo2Banners = [
  {
    id: "1",
    title: "Tecnologia de Ponta",
    subtitle: "Até 30% de desconto",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200",
    link: "/demo2/categoria/smartphones"
  },
  {
    id: "2", 
    title: "Novos Lançamentos",
    subtitle: "As últimas inovações",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200",
    link: "/demo2/categoria/notebooks"
  }
]

function Demo2HeroBanner() {
  const [currentBanner, setCurrentBanner] = useState(0)

  return (
    <section className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100">
      <div className="absolute inset-0">
        <Image
          src={demo2Banners[currentBanner].image}
          alt={demo2Banners[currentBanner].title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-4">
            {demo2Banners[currentBanner].title}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-4 md:mb-8 text-gray-100">
            {demo2Banners[currentBanner].subtitle}
          </p>
          <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-4 md:px-8 py-2 md:py-3 text-sm md:text-lg">
            <Link href={demo2Banners[currentBanner].link}>
              Ver Coleção
            </Link>
          </Button>
        </div>
      </div>

      {/* Banner Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {demo2Banners.map((_, index) => (
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

function Demo2CategoryGrid() {
  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Nossas Categorias</h2>
          <p className="text-muted-foreground text-sm md:text-base">Descubra produtos organizados por categoria</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {demo2Categories.map((category) => (
            <Link
              key={category.id}
              href={`/demo2/categoria/${category.slug}`}
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

function Demo2MiddleBanners() {
  return (
    <section className="py-8 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="relative h-48 md:h-64 overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
              alt="Promoção Especial"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h3 className="text-lg md:text-2xl font-bold mb-2">Promoção Especial</h3>
                <p className="mb-3 md:mb-4 text-sm md:text-base">Até 40% de desconto</p>
                <Button asChild variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Link href="/demo2/categoria/smartphones">
                    Ver Ofertas
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="relative h-48 md:h-64 overflow-hidden rounded-lg">
            <Image
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"
              alt="Novos Lançamentos"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h3 className="text-lg md:text-2xl font-bold mb-2">Novos Lançamentos</h3>
                <p className="mb-3 md:mb-4 text-sm md:text-base">As últimas inovações</p>
                <Button asChild variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Link href="/demo2/categoria/notebooks">
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

function Demo2WhatsAppSection() {
  const whatsapp = "(11) 88888-8888"
  const storeName = "TechStore"
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

export default function Demo2Page() {
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
        <Demo2HeroBanner />
        <Demo2CategoryGrid />
        <Demo2MiddleBanners />
        
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
            {demo2Products.length > 0 ? (
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" 
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {demo2Products.map(product => (
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
            {demo2Products.length > 0 && (
              <div className="text-center mt-8 md:mt-12">
                <Button size="lg" variant="outline" className="px-6 md:px-8 bg-transparent">
                  Carregar Mais Produtos
                </Button>
              </div>
            )}
          </div>
        </section>
        
        <Demo2WhatsAppSection />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <StoreLogo size="lg" className="mb-4" />
              <p className="text-gray-400 text-sm">
                Sua loja de eletrônicos online com as melhores marcas e preços incríveis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Atendimento</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Segunda a Sexta: 9h às 18h</p>
                <p>Sábado: 9h às 15h</p>
                <p>WhatsApp: (11) 88888-8888</p>
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
              &copy; {new Date().getFullYear()} TechStore. CNPJ: 12.345.678/0001-90. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      
      <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
    </Layout>
  )
} 