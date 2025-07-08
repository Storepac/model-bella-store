"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ShoppingBag, Star, Truck, Shield, RotateCcw, Heart, Share2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { CartToast } from "@/components/cart-toast"
import { useCart } from "@/lib/cart-context"
import { useStoreData } from "@/hooks/use-store-data"
import Image from "next/image"
import { resolveStoreId } from '@/lib/store-id'
import { Separator } from "@/components/ui/separator"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const { storeData } = useStoreData()

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
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
        
        const response = await fetch(`/api/products/${params.slug}?storeId=${resolvedStoreId}`, {
          cache: 'no-store'
        })
        const data = await response.json()
        
        if (data.success) {
          setProduct(data.product)
          if (data.product.variants && data.product.variants.length > 0) {
            setSelectedVariant(data.product.variants[0])
          }
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

    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

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

  const currentPrice = selectedVariant?.price || product.price
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert("Por favor, selecione uma variante do produto")
      return
    }

    const productToAdd = {
      ...product,
      price: currentPrice,
      selectedVariant: selectedVariant
    }

    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd)
    }

    setShowToast(true)
  }

  const handleBuyNow = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert("Por favor, selecione uma variante do produto")
      return
    }

    const variantText = selectedVariant 
      ? selectedVariant.options.map((opt: any) => `${opt.name}: ${opt.value}`).join(', ')
      : ''

    const message = `🛍️ *PEDIDO RÁPIDO - ${storeData?.name || 'LOJA'}*

📦 *PRODUTO:*
${product.name}
${variantText ? `Variante: ${variantText}` : ""}
Quantidade: ${quantity}
Valor unitário: R$ ${currentPrice.toFixed(2)}

💰 *TOTAL: R$ ${(currentPrice * quantity).toFixed(2)}*

Gostaria de comprar este produto!`

    const whatsappNumber = storeData?.whatsapp?.replace(/\D/g, '') || '5511999999999'
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Confira este produto: ${product.name}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Erro ao compartilhar:', err)
      }
    } else {
      // Fallback: copiar URL
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
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
            <a href={`/categoria/${product.category.slug}`} className="hover:text-pink-500">
              {product.category.name}
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
                  {product.isNew && <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Novo</Badge>}
                  {product.isLaunch && <Badge className="bg-purple-500 hover:bg-purple-600 text-white">Lançamento</Badge>}
                  {product.isPromotion && <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Promoção</Badge>}
                  {discountPercentage > 0 && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">-{discountPercentage}%</Badge>
                  )}
                </div>

                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/80 backdrop-blur-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
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
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">{product.category.name}</div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
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
                  <span className="text-sm text-muted-foreground">({product.reviewCount} avaliações)</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-pink-500">
                    R$ {currentPrice.toFixed(2)}
                  </span>
                  {product.originalPrice && product.originalPrice > currentPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-green-600">Em até 10x de R$ {(currentPrice / 10).toFixed(2)} sem juros</p>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Variantes disponíveis:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((variant: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-pink-500 bg-pink-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-sm font-medium">
                          {variant.options.map((opt: any) => `${opt.value}`).join(' + ')}
                        </div>
                        <div className="text-xs text-gray-500">
                          R$ {variant.price.toFixed(2)} • {variant.stock} em estoque
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <h3 className="font-medium">Quantidade:</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= (selectedVariant?.stock || product.stock || 99)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {selectedVariant?.stock || product.stock || 0} disponíveis
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-pink-500 hover:bg-pink-600" 
                  onClick={handleBuyNow}
                  disabled={!product.stock && !selectedVariant?.stock}
                >
                  Comprar Agora
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full" 
                  onClick={handleAddToCart}
                  disabled={!product.stock && !selectedVariant?.stock}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-green-500" />
                  <span>Frete grátis acima de R$ 199</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Compra protegida</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-purple-500" />
                  <span>Troca em até 30 dias</span>
                </div>
              </div>

              {/* Product Info */}
              {product.description && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-medium">Descrição do Produto</h3>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap">
                    {product.description}
                  </div>
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-medium">Detalhes do Produto</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">SKU:</span> {product.sku}
                  </div>
                  <div>
                    <span className="text-gray-500">Categoria:</span> {product.category.name}
                  </div>
                  {product.brand.name && (
                    <div>
                      <span className="text-gray-500">Marca:</span> {product.brand.name}
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Estoque:</span> {selectedVariant?.stock || product.stock || 0} unidades
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <CartToast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        productName={product?.name || ''} 
      />
    </Layout>
  )
} 