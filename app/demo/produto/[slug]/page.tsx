"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { CartToast } from "@/components/cart-toast"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  Share2,
  Minus,
  Plus,
  ShoppingBag
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import Image from "next/image"

// Dados mockados para a demo
const demoProducts = {
  "vestido-floral-primavera": {
    id: "1",
    name: "Vestido Floral Primavera",
    price: 89.90,
    originalPrice: 129.90,
    images: [
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg",
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/food/fish-vegetables.jpg"
    ],
    category: "Vestidos",
    description: "Vestido feminino elegante com estampa floral, perfeito para a primavera. Confeccionado em tecido leve e confortável, ideal para ocasiões casuais e eventos especiais.",
    features: [
      "Tecido 100% algodão",
      "Lavagem à máquina",
      "Não precisa passar",
      "Ajuste elástico na cintura"
    ],
    sizes: ["PP", "P", "M", "G", "GG"],
    colors: ["Azul", "Rosa", "Verde"],
    rating: 4.8,
    reviews: 24,
    stock: 15,
    isNew: true,
    isPromotion: false,
    isLaunch: false,
    isFeatured: true,
    sku: "VEST-001",
    weight: "0.3kg",
    dimensions: "40 x 30 x 5cm"
  },
  "blusa-basica-algodao": {
    id: "2",
    name: "Blusa Básica Algodão Premium",
    price: 45.90,
    images: [
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg",
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg"
    ],
    category: "Blusas",
    description: "Blusa básica confortável em algodão premium. Perfeita para o dia a dia, combina com qualquer look e oferece máximo conforto.",
    features: [
      "100% algodão premium",
      "Corte básico",
      "Lavagem à máquina",
      "Secagem na sombra"
    ],
    sizes: ["P", "M", "G", "GG"],
    colors: ["Branco", "Preto", "Azul", "Rosa"],
    rating: 4.5,
    reviews: 18,
    stock: 25,
    isNew: false,
    isPromotion: true,
    isLaunch: false,
    isFeatured: false,
    sku: "BLUS-002",
    weight: "0.2kg",
    dimensions: "35 x 25 x 3cm"
  },
  "calca-jeans-skinny": {
    id: "3",
    name: "Calça Jeans Skinny",
    price: 79.90,
    originalPrice: 99.90,
    images: [
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/sheep.jpg",
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579049/samples/ecommerce/leather-bag-gray.jpg",
      "https://res.cloudinary.com/mkt-img-db/image/upload/v1751579048/samples/landscapes/architecture-signs.jpg"
    ],
    category: "Calças",
    description: "Calça jeans skinny com elastano para máximo conforto e movimento. Perfeita para criar looks casuais e elegantes.",
    features: [
      "98% algodão, 2% elastano",
      "Lavagem à máquina",
      "Secagem na sombra",
      "Cinco bolsos"
    ],
    sizes: ["36", "38", "40", "42", "44"],
    colors: ["Azul claro", "Azul escuro", "Preto"],
    rating: 4.9,
    reviews: 31,
    stock: 12,
    isNew: false,
    isPromotion: false,
    isLaunch: true,
    isFeatured: true,
    sku: "CALC-003",
    weight: "0.4kg",
    dimensions: "45 x 35 x 8cm"
  }
}

export default function DemoProductPage({ params }: { params: { slug: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const { addItem } = useCart()

  const product = demoProducts[params.slug as keyof typeof demoProducts]

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-16 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link href="/demo">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Demo
            </Button>
          </Link>
        </div>
      </Layout>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Por favor, selecione o tamanho e a cor")
      return
    }
    
    const productWithOptions = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    }
    
    addItem(productWithOptions)
    setShowToast(true)
  }

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < product.stock) {
      setQuantity(quantity + 1)
    } else if (!increment && quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <Layout>
      <main className="py-4 md:py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center mb-4 md:mb-6 text-sm text-gray-600">
            <Link href="/demo" className="hover:text-gray-900">Demo</Link>
            <span className="mx-2">/</span>
            <Link href={`/demo/categoria/${product.category.toLowerCase()}`} className="hover:text-gray-900">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-green-500">Novo</Badge>
                )}
                {product.isPromotion && (
                  <Badge className="absolute top-4 right-4 bg-red-500">
                    {discount}% OFF
                  </Badge>
                )}
                {product.isLaunch && (
                  <Badge className="absolute top-4 right-4 bg-blue-500">Lançamento</Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {product.isNew && <Badge className="bg-green-500 text-xs">Novo</Badge>}
                  {product.isPromotion && <Badge className="bg-red-500 text-xs">{discount}% OFF</Badge>}
                  {product.isLaunch && <Badge className="bg-blue-500 text-xs">Lançamento</Badge>}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews} avaliações)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-green-600">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  SKU: {product.sku} | Em estoque: {product.stock} unidades
                </p>
              </div>

              <Separator />

              {/* Product Options */}
              <div className="space-y-6">
                {/* Size Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Tamanho</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          selectedSize === size
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Cor</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="font-semibold mb-3">Quantidade</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(false)}
                      disabled={quantity <= 1}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(true)}
                      disabled={quantity >= product.stock}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  disabled={!selectedSize || !selectedColor}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritar
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </div>

              {/* Product Features */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Características</h3>
                <ul className="space-y-2 text-sm">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Frete Grátis</span>
                </div>
                <p className="text-sm text-blue-800">
                  Para compras acima de R$ 99,90 em todo o Brasil
                </p>
              </div>

              {/* Security Info */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Compra Segura</span>
                </div>
                <p className="text-sm text-green-800">
                  Site seguro com certificado SSL e garantia de 30 dias
                </p>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-12 md:mt-16">
            <Separator className="mb-8" />
            <div className="max-w-4xl">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Descrição do Produto</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Especificações</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Peso:</strong> {product.weight}</p>
                    <p><strong>Dimensões:</strong> {product.dimensions}</p>
                    <p><strong>SKU:</strong> {product.sku}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Garantia</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• 30 dias para troca</p>
                    <p>• Produto original</p>
                    <p>• Suporte completo</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Política de Devolução</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• 7 dias para arrependimento</p>
                    <p>• Frete grátis na devolução</p>
                    <p>• Reembolso em até 5 dias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <CartToast show={showToast} onClose={() => setShowToast(false)} productName={product.name} />
    </Layout>
  )
} 