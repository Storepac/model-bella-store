"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { resolveStoreId } from '@/lib/store-id'

interface Category {
  id: number
  name: string
  slug: string
  image?: string
  productCount: number
  isActive: boolean
  subcategories?: Category[]
}

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const storeId = await resolveStoreId()
        const response = await fetch(`/api/categories?storeId=${storeId}`)
        const data = await response.json()
        
        if (Array.isArray(data)) {
          // Filtrar apenas categorias ativas e com produtos
          const activeCategories = data.filter((cat: Category) => 
            cat.isActive && cat.productCount > 0
          )
          setCategories(activeCategories)
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compre por Categoria</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encontre exatamente o que você procura navegando pelas nossas categorias cuidadosamente selecionadas.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compre por Categoria</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encontre exatamente o que você procura navegando pelas nossas categorias cuidadosamente selecionadas.
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma categoria disponível no momento.</p>
            <p className="text-gray-400 text-sm mt-2">Adicione categorias no dashboard para exibi-las aqui.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Compre por Categoria</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que você procura navegando pelas nossas categorias cuidadosamente selecionadas.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link href={`/categoria/${category.slug}`} key={category.id}>
              <div className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square cursor-pointer hover:shadow-lg transition-all duration-300">
                <Image
                  src={category.image || "/placeholder.svg?height=300&width=300"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.productCount} produtos</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {categories.map((category) => (
                <CarouselItem key={category.id} className="pl-2 basis-[45%] sm:basis-1/3">
                  <Link href={`/categoria/${category.slug}`}>
                    <div className="group relative overflow-hidden rounded-2xl bg-gray-100 aspect-square cursor-pointer">
                      <Image
                        src={category.image || "/placeholder.svg?height=300&width=300"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-base font-semibold mb-0.5 truncate">{category.name}</h3>
                        <p className="text-xs opacity-90">{category.productCount} produtos</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}
