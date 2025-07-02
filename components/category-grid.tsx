"use client"

import Image from "next/image"
import Link from "next/link"
import { categories } from "@/lib/category-data"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

export function CategoryGrid() {
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
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.itemCount} produtos</p>
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
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="text-base font-semibold mb-0.5 truncate">{category.name}</h3>
                        <p className="text-xs opacity-90">{category.itemCount} produtos</p>
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
