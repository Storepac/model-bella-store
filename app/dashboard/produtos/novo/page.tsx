"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Save, ArrowLeft, Video, ImageIcon } from "lucide-react"
import Image from "next/image"

const categorias = [
  { id: "vestidos", name: "Vestidos" },
  { id: "blusas", name: "Blusas" },
  { id: "calcas", name: "Calças" },
  { id: "sapatos", name: "Sapatos" },
  { id: "acessorios", name: "Acessórios" },
]

const tamanhos = ["PP", "P", "M", "G", "GG", "XG"]
const cores = ["Branco", "Preto", "Azul", "Rosa", "Verde", "Vermelho", "Amarelo", "Roxo"]

export default function NovoProdutoPage() {
  const router = useRouter()
  const [produto, setProduto] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    sku: "",
    isActive: true,
    isNew: false,
    sizes: [] as string[],
    colors: [] as string[],
    images: [] as string[],
    video: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
  })

  const handleSave = () => {
    // Aqui salvaria no backend
    console.log("Produto salvo:", produto)
    alert("Produto salvo com sucesso!")
    router.push("/dashboard/produtos")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Simular upload de imagens
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setProduto({ ...produto, images: [...produto.images, ...newImages] })
    }
  }

  const removeImage = (index: number) => {
    const newImages = produto.images.filter((_, i) => i !== index)
    setProduto({ ...produto, images: newImages })
  }

  const toggleSize = (size: string) => {
    const newSizes = produto.sizes.includes(size) ? produto.sizes.filter((s) => s !== size) : [...produto.sizes, size]
    setProduto({ ...produto, sizes: newSizes })
  }

  const toggleColor = (color: string) => {
    const newColors = produto.colors.includes(color)
      ? produto.colors.filter((c) => c !== color)
      : [...produto.colors, color]
    setProduto({ ...produto, colors: newColors })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Novo Produto</h1>
          <p className="text-muted-foreground">Adicione um novo produto ao seu catálogo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Produto
          </Button>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList>
          <TabsTrigger value="geral">Informações Gerais</TabsTrigger>
          <TabsTrigger value="midia">Mídia</TabsTrigger>
          <TabsTrigger value="variantes">Variantes</TabsTrigger>
          <TabsTrigger value="estoque">Estoque & Envio</TabsTrigger>
        </TabsList>

        {/* Informações Gerais */}
        <TabsContent value="geral">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Produto *</Label>
                    <Input
                      id="name"
                      value={produto.name}
                      onChange={(e) => setProduto({ ...produto, name: e.target.value })}
                      placeholder="Ex: Vestido Midi Floral Primavera"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={produto.description}
                      onChange={(e) => setProduto({ ...produto, description: e.target.value })}
                      placeholder="Descreva o produto, materiais, características..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sku">SKU (Código)</Label>
                    <Input
                      id="sku"
                      value={produto.sku}
                      onChange={(e) => setProduto({ ...produto, sku: e.target.value })}
                      placeholder="Ex: VES001"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preços</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Preço de Venda *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={produto.price}
                        onChange={(e) => setProduto({ ...produto, price: e.target.value })}
                        placeholder="159.90"
                      />
                    </div>

                    <div>
                      <Label htmlFor="originalPrice">Preço Original (opcional)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        value={produto.originalPrice}
                        onChange={(e) => setProduto({ ...produto, originalPrice: e.target.value })}
                        placeholder="199.90"
                      />
                    </div>
                  </div>

                  {produto.originalPrice && produto.price && (
                    <div className="text-sm text-muted-foreground">
                      Desconto:{" "}
                      {Math.round(
                        ((Number.parseFloat(produto.originalPrice) - Number.parseFloat(produto.price)) /
                          Number.parseFloat(produto.originalPrice)) *
                          100,
                      )}
                      %
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    value={produto.category}
                    onChange={(e) => setProduto({ ...produto, category: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Produto Ativo</Label>
                      <p className="text-sm text-muted-foreground">Visível na loja</p>
                    </div>
                    <Switch
                      checked={produto.isActive}
                      onCheckedChange={(checked) => setProduto({ ...produto, isActive: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Produto Novo</Label>
                      <p className="text-sm text-muted-foreground">Exibir badge "Novo"</p>
                    </div>
                    <Switch
                      checked={produto.isNew}
                      onCheckedChange={(checked) => setProduto({ ...produto, isNew: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Mídia */}
        <TabsContent value="midia">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Imagens do Produto
                </CardTitle>
                <CardDescription>Adicione até 10 imagens. A primeira será a imagem principal.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Clique para fazer upload ou arraste as imagens aqui</p>
                    <p className="text-xs text-gray-500 mb-4">PNG, JPG até 5MB cada</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Escolher Imagens
                      </label>
                    </Button>
                  </div>

                  {/* Images Grid */}
                  {produto.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {produto.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Produto ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {index === 0 && <Badge className="absolute top-2 left-2 bg-blue-500">Principal</Badge>}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Vídeo do Produto
                </CardTitle>
                <CardDescription>Adicione um vídeo para mostrar o produto (opcional)</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="video">URL do Vídeo</Label>
                  <Input
                    id="video"
                    value={produto.video}
                    onChange={(e) => setProduto({ ...produto, video: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Suporte para YouTube, Vimeo ou link direto para MP4
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Variantes */}
        <TabsContent value="variantes">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tamanhos</CardTitle>
                <CardDescription>Selecione os tamanhos disponíveis para este produto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tamanhos.map((size) => (
                    <Button
                      key={size}
                      variant={produto.sizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
                {produto.sizes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Tamanhos selecionados: {produto.sizes.join(", ")}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cores</CardTitle>
                <CardDescription>Selecione as cores disponíveis para este produto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {cores.map((color) => (
                    <Button
                      key={color}
                      variant={produto.colors.includes(color) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
                {produto.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Cores selecionadas: {produto.colors.join(", ")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Estoque & Envio */}
        <TabsContent value="estoque">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Controle de Estoque</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="stock">Quantidade em Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={produto.stock}
                    onChange={(e) => setProduto({ ...produto, stock: e.target.value })}
                    placeholder="50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informações de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    value={produto.weight}
                    onChange={(e) => setProduto({ ...produto, weight: e.target.value })}
                    placeholder="0.5"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="length">Comprimento (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={produto.dimensions.length}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          dimensions: { ...produto.dimensions, length: e.target.value },
                        })
                      }
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Largura (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={produto.dimensions.width}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          dimensions: { ...produto.dimensions, width: e.target.value },
                        })
                      }
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={produto.dimensions.height}
                      onChange={(e) =>
                        setProduto({
                          ...produto,
                          dimensions: { ...produto.dimensions, height: e.target.value },
                        })
                      }
                      placeholder="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
