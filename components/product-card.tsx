"use client"

import { useState } from "react"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  slug?: string
  isNew?: boolean
  isLaunch?: boolean
  isPromotion?: boolean
  discount?: number
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  isDemo?: boolean
}

export default function ProductCard({ product, onAddToCart, isDemo = false }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Determinar o link do produto baseado no contexto
  const getProductLink = () => {
    if (isDemo) {
      return product.slug ? `/demo/produto/${product.slug}` : `/demo/categoria/${product.category.toLowerCase()}`
    }
    return product.slug ? `/produto/${product.slug}` : `/categoria/${product.category.toLowerCase()}`
  }

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link href={getProductLink()}>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
          <TooltipProvider>
            {product.isNew && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs">Novo</Badge>
                </TooltipTrigger>
                <TooltipContent>Produto recém-cadastrado</TooltipContent>
              </Tooltip>
            )}
            {product.isLaunch && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">Lançamento</Badge>
                </TooltipTrigger>
                <TooltipContent>Produto em lançamento especial</TooltipContent>
              </Tooltip>
            )}
            {product.isPromotion && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">Promoção</Badge>
                </TooltipTrigger>
                <TooltipContent>Produto em oferta especial</TooltipContent>
              </Tooltip>
            )}
            {discountPercentage > 0 && !product.isPromotion && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">-{discountPercentage}%</Badge>
                </TooltipTrigger>
                <TooltipContent>Desconto aplicado</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all ${
            isLiked ? "text-red-500" : "text-gray-600"
          }`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>

        {/* Quick Add Button */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button onClick={() => onAddToCart(product)} className="w-full bg-black hover:bg-gray-800 text-white h-8 sm:h-10 text-xs sm:text-sm">
            <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Adicionar
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{product.category}</div>
        <Link href={getProductLink()}>
          <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-tight hover:text-blue-600 transition-colors cursor-pointer">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-bold text-gray-900">R$ {product.price.toFixed(2).replace(".", ",")}</span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
        </div>

        <div className="text-xs text-green-600 mt-1">
          ou 10x de R$ {(product.price / 10).toFixed(2).replace(".", ",")} sem juros
        </div>
      </div>
    </div>
  )
}

export { ProductCard }
