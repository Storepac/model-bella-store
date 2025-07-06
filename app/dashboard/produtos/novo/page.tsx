"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"

export default function NovoProdutoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [photoLimit, setPhotoLimit] = useState(2)
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [newSize, setNewSize] = useState("")
  const [newColor, setNewColor] = useState("")
  const [produto, setProduto] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    brandId: "",
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
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categorias, setCategorias] = useState<any[]>([])
  const [subcategorias, setSubcategorias] = useState<any[]>([])
  const [marcas, setMarcas] = useState<any[]>([])
  const [novaMarca, setNovaMarca] = useState("")
  const [addingBrand, setAddingBrand] = useState(false)

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategorias(data)
      } catch (err) {
        setCategorias([])
      }
    }
    
    const fetchLimits = async () => {
      try {
        const res = await fetch('/api/store-limits')
        const data = await res.json()
        if (data.success) {
          setPhotoLimit(data.data.photos_limit)
        }
      } catch (err) {
        console.error('Erro ao buscar limites:', err)
      }
    }
    
    const loadVariants = () => {
      if (typeof window !== 'undefined') {
        const savedSizes = localStorage.getItem('store_sizes')
        const savedColors = localStorage.getItem('store_colors')
        
        setAvailableSizes(savedSizes ? JSON.parse(savedSizes) : ["PP", "P", "M", "G", "GG", "XG"])
        setAvailableColors(savedColors ? JSON.parse(savedColors) : ["Branco", "Preto", "Azul", "Rosa", "Verde", "Vermelho", "Amarelo", "Roxo"])
      }
    }
    
    const fetchMarcas = async () => {
      try {
        let storeId = 1;
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            try {
              const user = JSON.parse(userStr)
              if (user.storeId) {
                storeId = user.storeId
              }
            } catch {}
          }
        }
        const res = await fetch(`/api/brands?storeId=${storeId}`)
        const data = await res.json()
        if ('success' in data && data.success && Array.isArray(data.brands)) setMarcas(data.brands)
      } catch (err) {
        console.error('Erro ao buscar marcas:', err)
      }
    }
    
    fetchCategorias()
    fetchLimits()
    loadVariants()
    fetchMarcas()
  }, [])

  const addNewSize = () => {
    if (newSize.trim() && !availableSizes.includes(newSize.trim())) {
      const updatedSizes = [...availableSizes, newSize.trim()]
      setAvailableSizes(updatedSizes)
      localStorage.setItem('store_sizes', JSON.stringify(updatedSizes))
      setNewSize("")
      toast({ title: 'Tamanho adicionado com sucesso!' })
    }
  }

  const addNewColor = () => {
    if (newColor.trim() && !availableColors.includes(newColor.trim())) {
      const updatedColors = [...availableColors, newColor.trim()]
      setAvailableColors(updatedColors)
      localStorage.setItem('store_colors', JSON.stringify(updatedColors))
      setNewColor("")
      toast({ title: 'Cor adicionada com sucesso!' })
    }
  }

  const removeSize = (size: string) => {
    const updatedSizes = availableSizes.filter(s => s !== size)
    setAvailableSizes(updatedSizes)
    localStorage.setItem('store_sizes', JSON.stringify(updatedSizes))
    // Remover do produto se estiver selecionado
    setProduto(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }))
  }

  const removeColor = (color: string) => {
    const updatedColors = availableColors.filter(c => c !== color)
    setAvailableColors(updatedColors)
    localStorage.setItem('store_colors', JSON.stringify(updatedColors))
    // Remover do produto se estiver selecionado
    setProduto(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }))
  }

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    const formattedValue = (parseInt(numericValue) / 100).toFixed(2)
    return formattedValue
  }

  const handlePriceChange = (field: 'price' | 'originalPrice', value: string) => {
    const formatted = formatCurrency(value)
    setProduto({ ...produto, [field]: formatted })
  }

  const handleSave = async () => {
    // Validação básica
    if (!produto.name || !produto.price || !produto.category || produto.images.length === 0) {
      toast({ title: 'Preencha todos os campos obrigatórios e envie pelo menos uma imagem.', variant: 'destructive' })
      return
    }
    try {
      setSaving(true)
      let data = { error: '' }
      try {
        // Pegar storeId do usuário logado
        let storeId = 1;
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            try {
              const user = JSON.parse(userStr)
              if (user.storeId) {
                storeId = user.storeId
              }
            } catch {}
          }
        }
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: produto.name,
            description: produto.description,
            price: Number(produto.price),
            original_price: produto.originalPrice ? Number(produto.originalPrice) : null,
            categoryId: produto.subcategory ? Number(produto.subcategory) : Number(produto.category),
            sku: produto.sku,
            isActive: produto.isActive,
            isNew: produto.isNew,
            stock: produto.stock ? Number(produto.stock) : null,
            sizes: produto.sizes,
            colors: produto.colors,
            images: produto.images,
            video: produto.video,
            weight: produto.weight,
            dimensions: produto.dimensions,
            brandId: produto.brandId ? Number(produto.brandId) : null,
            storeId: storeId,
          })
        })
        data = await res.json()
        if (res.ok && data.success) {
          toast({ title: 'Produto salvo com sucesso!' })
          router.push('/dashboard/produtos')
        } else {
          throw new Error(data.error || 'Erro desconhecido')
        }
      } catch (err) {
        toast({
          title: 'Erro ao salvar produto',
          description: (data && data.error) ? data.error : String(err),
          variant: 'destructive',
        })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      if (produto.images.length + files.length > photoLimit) {
        toast({ 
          title: 'Limite de fotos excedido', 
          description: `Seu plano permite até ${photoLimit} fotos por produto.`,
          variant: 'destructive' 
        })
        return
      }
      
      setUploading(true)
      try {
        const uploadedUrls: string[] = []
        for (const file of Array.from(files)) {
          const formData = new FormData()
          formData.append('file', file)
          const res = await fetch('/api/images', {
            method: 'POST',
            body: formData
          })
          if (!res.ok) throw new Error('Erro ao enviar imagem')
          const data = await res.json()
          uploadedUrls.push(data.url)
        }
        setProduto((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }))
        toast({ title: 'Imagens enviadas com sucesso!' })
      } catch (err) {
        toast({ title: 'Erro ao enviar imagem', description: String(err), variant: 'destructive' })
      } finally {
        setUploading(false)
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = produto.images.filter((_, i) => i !== index)
    setProduto({ ...produto, images: newImages })
  }

  const toggleSize = (size: string) => {
    const newSizes = produto.sizes.includes(size) 
      ? produto.sizes.filter((s) => s !== size) 
      : [...produto.sizes, size]
    setProduto({ ...produto, sizes: newSizes })
  }

  const toggleColor = (color: string) => {
    const newColors = produto.colors.includes(color)
      ? produto.colors.filter((c) => c !== color)
      : [...produto.colors, color]
    setProduto({ ...produto, colors: newColors })
  }

  const handleAddMarca = async () => {
    if (!novaMarca.trim()) return
    setAddingBrand(true)
    try {
      let storeId = 1;
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          try {
            const user = JSON.parse(userStr)
            if (user.storeId) {
              storeId = user.storeId
            }
          } catch {}
        }
      }
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: novaMarca.trim(), storeId: storeId })
      })
      const data = await res.json()
      if ('success' in data && data.success && data.id) {
        setNovaMarca("")
        setProduto(prev => ({ ...prev, brandId: data.id }))
        // Atualiza lista de marcas
        const res2 = await fetch(`/api/brands?storeId=${storeId}`)
        const data2 = await res2.json()
        if ('success' in data2 && data2.success && Array.isArray(data2.brands)) setMarcas(data2.brands)
        toast({ title: 'Marca cadastrada com sucesso!' })
      } else {
        toast({ title: 'Erro ao cadastrar marca', description: data.error, variant: 'destructive' })
      }
    } catch (err) {
      toast({ title: 'Erro ao cadastrar marca', description: String(err), variant: 'destructive' })
    } finally {
      setAddingBrand(false)
    }
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
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
            <Save className="h-4 w-4 mr-2" />
            Salvar Produto
              </>
            )}
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
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <div className="flex gap-2">
                      <select
                        id="brand"
                        value={produto.brandId}
                        onChange={e => setProduto({ ...produto, brandId: e.target.value })}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Selecione uma marca</option>
                        {marcas.map((marca) => (
                          <option key={marca.id} value={marca.id}>{marca.name}</option>
                        ))}
                      </select>
                      <Input
                        value={novaMarca}
                        onChange={e => setNovaMarca(e.target.value)}
                        placeholder="Nova marca"
                        className="w-40"
                        disabled={addingBrand}
                      />
                      <Button onClick={handleAddMarca} disabled={addingBrand || !novaMarca.trim()} type="button">
                        {addingBrand ? 'Adicionando...' : 'Adicionar'}
                      </Button>
                    </div>
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
                        onChange={(e) => handlePriceChange('price', e.target.value)}
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
                        onChange={(e) => handlePriceChange('originalPrice', e.target.value)}
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
                    onChange={e => {
                      setProduto({ ...produto, category: e.target.value, subcategory: "" })
                      const cat = categorias.find((c) => String(c.id) === e.target.value)
                      setSubcategorias(cat && cat.subcategories ? cat.subcategories : [])
                    }}
                    className="w-full p-2 border rounded-md mb-2"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {subcategorias.length > 0 && (
                    <select
                      value={produto.subcategory}
                      onChange={e => setProduto({ ...produto, subcategory: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">Selecione uma subcategoria</option>
                      {subcategorias.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  )}
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
                <CardDescription>
                  Adicione até {photoLimit} imagens ({produto.images.length}/{photoLimit} usadas). A primeira será a imagem principal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    produto.images.length >= photoLimit 
                      ? 'border-gray-200 bg-gray-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      {produto.images.length >= photoLimit ? 'Limite de fotos atingido' : 'Clique para fazer upload ou arraste as imagens aqui'}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">PNG, JPG até 5MB cada</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading || produto.images.length >= photoLimit}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={produto.images.length >= photoLimit}
                      asChild
                    >
                      <label htmlFor="image-upload" className="cursor-pointer">
                        {produto.images.length >= photoLimit ? 'Limite Atingido' : 'Escolher Imagens'}
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
                <div className="space-y-4">
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
                  
                  {produto.video && (
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Preview do Vídeo</h4>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        {produto.video.includes('youtube.com') || produto.video.includes('youtu.be') ? (
                          <iframe
                            src={produto.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                            className="w-full h-full rounded-lg"
                            allowFullScreen
                          />
                        ) : (
                          <p className="text-gray-500 text-sm">Preview disponível apenas para YouTube</p>
                        )}
                      </div>
                    </div>
                  )}
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
                <div className="space-y-4">
                  {/* Adicionar novo tamanho */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Novo tamanho (ex: XXG)"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewSize()}
                    />
                    <Button onClick={addNewSize} variant="outline">
                      Adicionar
                    </Button>
                  </div>
                  
                  {/* Lista de tamanhos */}
                <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <div key={size} className="relative group">
                    <Button
                      variant={produto.sizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSize(size)}
                    >
                      {size}
                    </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeSize(size)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                  ))}
                </div>
                  
                {produto.sizes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Tamanhos selecionados: {produto.sizes.join(", ")}</p>
                  </div>
                )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cores</CardTitle>
                <CardDescription>Selecione as cores disponíveis para este produto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Adicionar nova cor */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nova cor (ex: Azul Marinho)"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addNewColor()}
                    />
                    <Button onClick={addNewColor} variant="outline">
                      Adicionar
                    </Button>
                  </div>
                  
                  {/* Lista de cores */}
                <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <div key={color} className="relative group">
                    <Button
                      variant={produto.colors.includes(color) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleColor(color)}
                    >
                      {color}
                    </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeColor(color)}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </div>
                  ))}
                </div>
                  
                {produto.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Cores selecionadas: {produto.colors.join(", ")}</p>
                  </div>
                )}
                </div>
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
