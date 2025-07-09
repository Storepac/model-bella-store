"use client"

import React, { useState } from "react"
import { Layout } from "@/components/layout"
import CategoryProductCard from "@/components/category-product-card"
import { CategoryFilters } from "@/components/category-filters"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Grid, List, ChevronDown } from "lucide-react"
import Image from "next/image"
import { mockBanners } from "@/lib/banner-data"

// Mock data para vestidos - Expandido para paginação infinita
const generateVestidos = (startIndex: number, count: number) => {
  const vestidos = []
  const names = [
    "Vestido Midi Floral Primavera",
    "Vestido Longo Festa Elegante", 
    "Vestido Curto Casual Verão",
    "Vestido Tubinho Executivo",
    "Vestido Boho Chic Estampado",
    "Vestido Envelope Viscose",
    "Vestido Maxi Estampado Tropical",
    "Vestido Cocktail Brilho",
    "Vestido Midi Liso Elegante",
    "Vestido Curto Com Decote",
    "Vestido Longo Plissado",
    "Vestido Tubinho Com Fenda",
    "Vestido Midi Com Babados",
    "Vestido Curto Com Laço",
    "Vestido Longo Com Renda",
    "Vestido Midi Com Estampa Geométrica",
    "Vestido Curto Com Ombro Descoberto",
    "Vestido Longo Com Abertura",
    "Vestido Midi Com Bolsos",
    "Vestido Curto Com Gola Alta"
  ]
  
  const descriptions = [
    "Vestido midi com estampa floral delicada, perfeito para ocasiões especiais.",
    "Vestido longo para festas e eventos especiais. Tecido fluido e caimento perfeito.",
    "Vestido curto e descontraído, ideal para o dia a dia. Confortável e estiloso.",
    "Vestido tubinho clássico para ambiente profissional. Elegante e sofisticado.",
    "Vestido estilo boho com estampa única. Perfeito para looks despojados.",
    "Vestido envelope em viscose macia. Amarração na cintura e modelagem universal.",
    "Vestido maxi com estampa tropical vibrante. Ideal para o verão.",
    "Vestido cocktail com detalhes em brilho. Perfeito para festas.",
    "Vestido midi liso em tecido premium. Elegante e versátil.",
    "Vestido curto com decote em V. Feminino e moderno.",
    "Vestido longo com plissado delicado. Movimento e elegância.",
    "Vestido tubinho com fenda lateral. Moderno e sofisticado.",
    "Vestido midi com babados românticos. Feminino e charmoso.",
    "Vestido curto com laço na cintura. Doce e elegante.",
    "Vestido longo com renda delicada. Romântico e sofisticado.",
    "Vestido midi com estampa geométrica moderna. Atual e versátil.",
    "Vestido curto com ombro descoberto. Sensual e elegante.",
    "Vestido longo com abertura lateral. Moderno e sofisticado.",
    "Vestido midi com bolsos funcionais. Prático e estiloso.",
    "Vestido curto com gola alta. Clássico e elegante."
  ]

  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % names.length
    const nameIndex = (startIndex + i) % names.length
    const descIndex = (startIndex + i) % descriptions.length
    
    vestidos.push({
      id: `v${startIndex + i + 1}`,
      name: names[nameIndex],
      description: descriptions[descIndex],
      price: Math.floor(Math.random() * 300) + 50,
      originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 400) + 100 : undefined,
      images: [
        "/placeholder.svg?height=500&width=400",
        "/placeholder.svg?height=500&width=400",
        "/placeholder.svg?height=500&width=400",
      ],
      category: "Vestidos",
      isNew: Math.random() > 0.7,
      stock: Math.floor(Math.random() * 20) + 1,
    })
  }
  
  return vestidos
}

// Dados da categoria (simulando dados do dashboard)
const categoryData = {
  name: "Vestidos",
  description: "Descubra nossa coleção de vestidos para todas as ocasiões. Do casual ao elegante, temos o vestido perfeito para você.",
  filters: {
    brands: ["Zara", "H&M", "C&A", "Renner", "Riachuelo", "Farm", "Animale"],
    sizes: ["PP", "P", "M", "G", "GG", "XG", "34", "36", "38", "40", "42", "44"],
    genders: ["Feminino", "Unissex"],
    priceRanges: [
      { min: 0, max: 50, label: "Até R$ 50" },
      { min: 50, max: 100, label: "R$ 50 - R$ 100" },
      { min: 100, max: 200, label: "R$ 100 - R$ 200" },
      { min: 200, max: 500, label: "R$ 200 - R$ 500" },
      { min: 500, max: null, label: "Acima de R$ 500" }
    ],
    departments: ["Moda Feminina", "Moda Casual", "Moda Social", "Moda Festa"],
    features: ["Novidades", "Promoções", "Mais Vendidos", "Lançamentos", "Exclusivos"]
  }
}

const sortOptions = [
  { value: "relevance", label: "Mais Relevantes" },
  { value: "price-asc", label: "Menor Preço" },
  { value: "price-desc", label: "Maior Preço" },
  { value: "newest", label: "Mais Novos" },
  { value: "name", label: "A-Z" },
  { value: "popular", label: "Mais Populares" },
]

export default function VestidosPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [showToast, setShowToast] = useState(false)
  const [toastProduct, setToastProduct] = useState("")
  const [activeFilters, setActiveFilters] = useState<any>({})
  const [showFilters, setShowFilters] = useState(true)
  
  // Estados para paginação infinita
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  // Carregar produtos iniciais
  React.useEffect(() => {
    loadMoreProducts()
  }, [])

  // Intersection Observer para carregar mais produtos automaticamente
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1 }
    )

    const target = document.getElementById('load-more-trigger')
    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [hasMore, loading])

  const loadMoreProducts = async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newProducts = generateVestidos((page - 1) * itemsPerPage, itemsPerPage)
    
    setProducts(prev => [...prev, ...newProducts])
    setPage(prev => prev + 1)
    
    // Simular fim dos dados após 5 páginas
    if (page >= 5) {
      setHasMore(false)
    }
    
    setLoading(false)
  }

  const handleAddToCart = (productName: string) => {
    setToastProduct(productName)
    setShowToast(true)
  }

  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters)
    // Resetar paginação quando aplicar filtros
    setProducts([])
    setPage(1)
    setHasMore(true)
    // Aqui você aplicaria os filtros aos produtos
    console.log("Filtros aplicados:", filters)
  }

  const handleClearFilters = () => {
    setActiveFilters({})
    // Resetar paginação quando limpar filtros
    setProducts([])
    setPage(1)
    setHasMore(true)
    // Aqui você limparia os filtros dos produtos
    console.log("Filtros limpos")
  }

  const categoryBanner = mockBanners.find(
    (b) => b.position === "category-header" && b.categorySlug === "vestidos" && b.isActive,
  )

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Category Header */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <nav className="text-sm text-muted-foreground mb-3 sm:mb-4">
                  <a href="/" className="hover:text-pink-500">
                    Home
                  </a>{" "}
                  / <span className="text-gray-900">Vestidos</span>
                </nav>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Vestidos</h1>
                <p className="text-base sm:text-lg text-muted-foreground">
                  Descubra nossa coleção de vestidos para todas as ocasiões. Do casual ao elegante, temos o vestido
                  perfeito para você.
                </p>
                <div className="mt-4 sm:mt-6">
                  <span className="text-sm text-muted-foreground">{products.length} produtos encontrados</span>
                </div>
              </div>
              <div className="relative h-48 sm:h-64 md:h-80">
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

        {/* Main Content with Filters */}
        <div className="flex">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <CategoryFilters
              filters={categoryData.filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters and Sort Bar */}
            <div className="bg-white border-b sticky top-16 z-30">
              <div className="px-4 py-3 sm:py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Mobile Filter Button */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                    </Button>
                    
                    {/* Results Count */}
                    <span className="text-sm text-muted-foreground">
                      {products.length} produtos encontrados
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">Ordenar por:</span>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-full sm:w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">Visualização:</span>
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
            </div>

            {/* Mobile Filters - Overlay */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-lg">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Filtros</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-y-auto h-full pb-20">
                    <CategoryFilters
                      filters={categoryData.filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                      hideHeader={true}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowFilters(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => setShowFilters(false)}
                      >
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="px-4 py-6 sm:py-8">
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {products.map((produto: any) => (
                  <CategoryProductCard
                    key={produto.id}
                    product={produto}
                    onAddToCart={() => handleAddToCart(produto.name)}
                  />
                ))}
              </div>

              {/* Load More Trigger for Intersection Observer */}
              <div id="load-more-trigger" className="h-10" />

              {/* Load More Button (Fallback) */}
              {hasMore && !loading && (
                <div className="text-center mt-8 sm:mt-12">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 bg-transparent"
                    onClick={loadMoreProducts}
                  >
                    Carregar Mais Produtos
                  </Button>
                </div>
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="text-center mt-8">
                  <div className="inline-flex items-center gap-2 text-muted-foreground">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                    Carregando mais produtos...
                  </div>
                </div>
              )}

              {/* No More Products */}
              {!hasMore && products.length > 0 && (
                <div className="text-center mt-8 text-muted-foreground">
                  Não há mais produtos para carregar
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast */}
        <CartToast show={showToast} onClose={() => setShowToast(false)} productName={toastProduct} />
      </div>
    </Layout>
  )
}
