"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { HeroBanner } from "@/components/hero-banner"
import { CategoryGrid } from "@/components/category-grid"
import { ProductCard } from "@/components/product-card"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Filter, Grid, List } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import Image from "next/image"
import { apiFetch } from '@/lib/api-client'

function MiddleBanners({ storeId }: { storeId: number }) {
  const [banners, setBanners] = useState<any[]>([])
  useEffect(() => {
    if (!storeId) return
    apiFetch(`/banners?storeId=${storeId}`)
      .then(data => setBanners((data.banners || []).filter((b:any)=> b.isActive && (b.position==='homepage-middle-1'||b.position==='homepage-middle-2'))))
      .catch(() => setBanners([]))
  }, [storeId])
  if (banners.length===0) return null
  return (
    <div className="container mx-auto px-4 my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {banners.map((banner:any)=>(
          <Link href={banner.link} key={banner.id}>
            <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-lg md:rounded-2xl">
              <Image src={banner.image||'/placeholder.svg'} alt={banner.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function WhatsAppSection({ whatsapp, storeName }: { whatsapp: string, storeName: string }) {
  if (!whatsapp) return null
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

export default function CatalogoPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showToast, setShowToast] = useState(false)
  const [toastProduct, setToastProduct] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [storeData, setStoreData] = useState<any>(null)
  const { addItem } = useCart()
  const [storeId, setStoreId] = useState<number | null>(null)

  useEffect(() => {
    const getStoreId = () => {
      // Primeiro, tentar pegar da URL
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search)
        const storeFromUrl = urlParams.get('store')
        if (storeFromUrl) {
          return parseInt(storeFromUrl)
        }
        
        // Fallback: usuário logado
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user?.storeId) {
          return user.storeId
        }
      }
      return 1 // loja padrão
    }

    const _storeId = getStoreId()
    setStoreId(_storeId)
    
    apiFetch(`/stores/${_storeId}`)
      .then(res => {
        if (res.success) setStoreData(res.data)
        else setStoreData(null)
      })
      .catch(() => setStoreData(null))
  }, [])

  useEffect(() => {
    if (!storeId) return
    setLoading(true)
    apiFetch(`/products?storeId=${storeId}`)
      .then(data => {
        if (data.success) {
          const formattedProducts = data.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            slug: product.slug || `produto-${product.id}`,
            price: parseFloat(product.price.replace('R$ ', '').replace(',', '.')),
            originalPrice: product.original_price ? parseFloat(product.original_price.replace('R$ ', '').replace(',', '.')) : null,
            image: product.images[0] || "/placeholder.svg?height=400&width=300",
            category: product.category,
            isNew: product.isNew,
            isPromotion: product.isPromotion,
            isLaunch: product.isLaunch,
            isFeatured: product.isFeatured
          }))
          setProducts(formattedProducts)
        } else {
          setProducts([])
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [storeId])

  const handleAddToCart = (product: any) => {
    addItem(product)
    setToastProduct(product.name)
    setShowToast(true)
  }

  if (loading) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-sm md:text-base">Carregando produtos...</p>
          </div>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main>
        <HeroBanner />
        <CategoryGrid />
        <MiddleBanners storeId={storeId!} />
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
            {products.length > 0 ? (
              <div
                className={`grid gap-4 md:gap-6 ${
                  viewMode === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <p className="text-gray-500 text-base md:text-lg">Nenhum produto encontrado.</p>
                <p className="text-gray-400 mt-2 text-sm md:text-base">Adicione produtos no dashboard para exibi-los aqui.</p>
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
        
        <WhatsAppSection whatsapp={storeData?.whatsapp || ""} storeName={storeData?.name || "Nossa Loja"} />
      </main>
      
      <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
    </Layout>
  )
} 