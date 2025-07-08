"use client"

import { Input } from "@/components/ui/input"

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
import { storeData } from "@/lib/store-data"
import { resolveStoreId } from '@/lib/store-id'
import { useStoreData } from '@/hooks/use-store-data'

const MiddleBanners = () => {
  const { storeData } = useStoreData()
  const [banners, setBanners] = useState<any[]>([])

  useEffect(() => {
    const fetchBanners = async () => {
      if (!storeData) return
      const res = await fetch(`/api/banners?storeId=${storeData.id}`)
      const data = await res.json()
      setBanners((data.banners || []).filter((b:any)=> b.isActive && (b.position==='homepage-middle-1'||b.position==='homepage-middle-2')))
    }
    fetchBanners()
  }, [storeData])

  if (banners.length===0) return null

  return (
    <div className="container mx-auto px-4 my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner:any)=>(
          <Link href={banner.link} key={banner.id}>
            <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <Image src={banner.image||'/placeholder.svg'} alt={banner.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const WhatsAppSection = () => {
  const { storeData } = useStoreData()

  if (!storeData?.whatsapp) return null

  const whatsappNumber = storeData.whatsapp.replace(/\D/g, '')

  return (
    <section className="py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Fale Conosco no WhatsApp</h2>
          <p className="text-green-100 mb-8">
            Tire suas dúvidas, faça pedidos ou receba atendimento personalizado direto no WhatsApp!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Button 
              asChild
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold"
            >
              <a 
                href={`https://wa.me/55${whatsappNumber}?text=Olá! Gostaria de conhecer mais sobre os produtos da ${storeData.name}.`}
                target="_blank"
                rel="noopener noreferrer"
              >
                💬 Conversar no WhatsApp
              </a>
            </Button>
          </div>
          <p className="text-green-100 text-sm mt-4">
            {storeData.whatsapp}
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showToast, setShowToast] = useState(false)
  const [toastProduct, setToastProduct] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const [storeId, setStoreId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedStoreId = await resolveStoreId()
        setStoreId(resolvedStoreId)
        
        // Buscar produtos do banco
        const response = await fetch(`/api/products?storeId=${resolvedStoreId}`)
        const data = await response.json()
        
        if (data.success) {
          // Formatar produtos para o frontend
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
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setStoreId(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleAddToCart = (product: any) => {
    addItem(product)
    setToastProduct(product.name)
    setShowToast(true)
  }

  if (loading) {
    return (
      <Layout>
        <main className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p>Carregando produtos...</p>
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
            {products.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {products.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
                <p className="text-gray-400 mt-2">Adicione produtos no dashboard para exibi-los aqui.</p>
              </div>
            )}

            {/* Load More */}
            {products.length > 0 && (
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" className="px-8 bg-transparent">
                  Carregar Mais Produtos
                </Button>
              </div>
            )}
          </div>
        </section>

        <WhatsAppSection />
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
