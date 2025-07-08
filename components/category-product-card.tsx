"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  isNew?: boolean
  stock?: number
}

interface CategoryProductCardProps {
  product: Product
  onAddToCart?: () => void
}

export function CategoryProductCard({ product, onAddToCart }: CategoryProductCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const { addItem } = useCart()

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    onAddToCart?.()
  }

  const handleBuyNow = () => {
    const message = `🛍️ *PEDIDO RÁPIDO - BELLA STORE*

📦 *PRODUTO:*
${product.name}
Quantidade: ${quantity}
Valor unitário: R$ ${product.price.toFixed(2)}

💰 *TOTAL: R$ ${(product.price * quantity).toFixed(2)}*

Gostaria de comprar este produto!`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 group">
        <Link href={`/produto/${product.id}`}>
          <Image
            src={product.images[currentImage] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          />
        </Link>

        {/* Image Navigation Dots */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentImage === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover Navigation */}
        {product.images.length > 1 && (
          <div className="absolute inset-0 flex">
            <button
              className="flex-1 opacity-0 hover:opacity-100 transition-opacity"
              onMouseEnter={() => setCurrentImage(Math.max(0, currentImage - 1))}
            />
            <button
              className="flex-1 opacity-0 hover:opacity-100 transition-opacity"
              onMouseEnter={() => setCurrentImage(Math.min(product.images.length - 1, currentImage + 1))}
            />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge className="bg-pink-500 hover:bg-pink-600 text-white text-xs">Novo</Badge>}
          {discountPercentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">-{discountPercentage}%</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all ${
            isLiked ? "text-red-500" : "text-gray-600"
          }`}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Title and Description */}
        <div>
          <Link href={`/produto/${product.id}`}>
            <h3 className="font-semibold text-base mb-1 line-clamp-2 hover:text-pink-500 transition-colors cursor-pointer">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">R$ {product.price.toFixed(2).replace(".", ",")}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
            )}
          </div>
          <div className="text-xs text-green-600">
            ou 10x de R$ {(product.price / 10).toFixed(2).replace(".", ",")} sem juros
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Quantidade:</span>
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2 py-1 hover:bg-gray-50 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 py-1 border-x text-sm font-medium">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 hover:bg-gray-50 transition-colors">
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button onClick={handleAddToCart} variant="outline" className="w-full bg-transparent hover:bg-gray-50">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
          <Button onClick={handleBuyNow} className="w-full bg-green-600 hover:bg-green-700 text-white">
            Comprar pelo WhatsApp
          </Button>
        </div>

        {/* Stock Info */}
        {product.stock && product.stock <= 5 && (
          <div className="text-xs text-orange-600 text-center">Apenas {product.stock} unidades restantes!</div>
        )}
      </div>
    </div>
  )
}

// Export default para compatibilidade
export default CategoryProductCard
