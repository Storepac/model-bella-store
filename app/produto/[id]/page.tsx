"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShoppingBag, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { CartToast } from "@/components/cart-toast"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"
import { resolveStoreId } from '@/lib/store-id'

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
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [storeId, setStoreId] = useState<number | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const resolvedStoreId = await resolveStoreId()
        setStoreId(resolvedStoreId)
        const response = await fetch(`/api/products/${params.id}?storeId=${resolvedStoreId}`, {
          cache: 'no-store'
        })
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.product)
        } else {
          setError(data.error || 'Produto não encontrado')
        }
      } catch (err) {
        setError('Erro ao carregar produto')
        console.error('Erro ao carregar produto:', err)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Loading skeleton */}
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-md animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/')}>Voltar para a loja</Button>
          </div>
        </div>
      </Layout>
    )
  }

  const discountPercentage = product.original_price
    ? Math.round(((parseFloat(product.original_price.replace('R$ ', '')) - parseFloat(product.price.replace('R$ ', ''))) / parseFloat(product.original_price.replace('R$ ', ''))) * 100)
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
                {product.images.map((image: string, index: number) => (
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

              {/* Video Section */}
              {product.video && (
                <div className="space-y-2">
                  <h3 className="font-medium">Vídeo do Produto</h3>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {product.video.includes('youtube.com') || product.video.includes('youtu.be') ? (
                      <iframe
                        src={product.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                        className="w-full h-full"
                        allowFullScreen
                        title={`Vídeo - ${product.name}`}
                      />
                    ) : (
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster={product.images[0]}
                      >
                        <source src={product.video} type="video/mp4" />
                        Seu navegador não suporta reprodução de vídeo.
                      </video>
                    )}
                  </div>
                </div>
              )}
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
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">
                      R$ {product.original_price.toFixed(2).replace(".", ",")}
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
                    {product.colors.map((color: string) => (
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
                    {product.sizes.map((size: string) => (
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
                  {product.features.map((feature: string, index: number) => (
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
