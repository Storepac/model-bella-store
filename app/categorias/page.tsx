"use client"

import { useCategories } from "@/hooks/use-categories"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function CategoriasPage() {
  const { categories, loading, error } = useCategories(true)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2">Carregando categorias...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <p>Erro ao carregar categorias: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorias</h1>
        <p className="text-gray-600">Explore nossa coleção por categorias</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

// Componente para renderizar categorias em cards
function CategoryCard({ category }: { category: any }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
        {category.isOnSale && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            Promoção
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {category.productCount} produtos
          </Badge>
          <Link
            href={`/categoria/${category.slug}`}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Ver produtos →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 