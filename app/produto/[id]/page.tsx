"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShoppingBag, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { CartToast } from "@/components/cart-toast"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"

// Mock data - em produção viria da API
const mockProduct = {
  id: "1",
  name: "Vestido Midi Floral Primavera Elegante",
  price: 159.9,
  originalPrice: 199.9,
  description:
    "Vestido midi com estampa floral delicada, perfeito para ocasiões especiais. Confeccionado em tecido fluido e confortável, com modelagem que valoriza a silhueta feminina. Ideal para primavera e verão.",
  images: [
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
    "/placeholder.svg?height=600&width=400",
  ],
  category: "Vestidos",
  sizes: ["PP", "P", "M", "G", "GG"],
  colors: ["Rosa", "Azul", "Verde", "Branco"],
  stock: 15,
  rating: 4.8,
  reviews: 127,
  isNew: true,
  features: ["Tecido: 100% Viscose", "Modelagem: Midi", "Manga: Curta", "Decote: Redondo", "Forro: Sim"],
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, toggleCart } = useCart()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const product = mockProduct // Em produção, buscar por params.id

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Por favor, selecione um tamanho")
      return
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Por favor, selecione uma cor")
      return
    }

    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor)
    }

    setShowToast(true)
  }

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Por favor, selecione um tamanho")
      return
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Por favor, selecione uma cor")
      return
    }

    const message = `🛍️ *PEDIDO RÁPIDO - BELLA STORE*

📦 *PRODUTO:*
${product.name}
${selectedSize ? `Tamanho: ${selectedSize}` : ""}
${selectedColor ? `Cor: ${selectedColor}` : ""}
Quantidade: ${quantity}
Valor unitário: R$ ${product.price.toFixed(2)}

💰 *TOTAL: R$ ${(product.price * quantity).toFixed(2)}*

Gostaria de comprar este produto!`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4 border-b">
          <nav className="text-sm text-muted-foreground">
            <a href="/" className="hover:text-pink-500">
              Home
            </a>{" "}
            /{" "}
            <a href={`/categoria/${product.category.toLowerCase()}`} className="hover:text-pink-500">
              {product.category}
            </a>{" "}
            / <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-pink-500 hover:bg-pink-600 text-white">Novo</Badge>}
                  {discountPercentage > 0 && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">-{discountPercentage}%</Badge>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-pink-500" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">{product.category}</div>
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} avaliações)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                </div>
                <div className="text-sm text-green-600">
                  ou 10x de R$ {(product.price / 10).toFixed(2).replace(".", ",")} sem juros
                </div>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Cor: {selectedColor && <span className="text-pink-500">{selectedColor}</span>}
                  </h3>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                          selectedColor === color
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Tamanho: {selectedSize && <span className="text-pink-500">{selectedSize}</span>}
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-sm border rounded-md transition-colors ${
                          selectedSize === size
                            ? "border-pink-500 bg-pink-50 text-pink-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium mb-3">Quantidade</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-gray-50">
                      +
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">{product.stock} disponíveis</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBuyNow}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                >
                  Comprar pelo WhatsApp
                </Button>
                <Button onClick={handleAddToCart} variant="outline" className="w-full h-12 text-lg bg-transparent">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 gap-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span>Frete grátis acima de R$ 199</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <span>Troca grátis em até 30 dias</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span>Compra 100% segura</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>

                <h4 className="font-medium mb-2">Características:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {product.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <CartToast show={showToast} onClose={() => setShowToast(false)} productName={product.name} />
      </div>
    </Layout>
  )
}
