"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Save, ArrowLeft, Video, ImageIcon, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { VariantManager } from "@/components/variant-manager"
import { ProductVariants } from "@/components/product-variants"
import CategorySelector from "@/components/category-selector"
import ProductBadges from "@/components/product-badges"

// Função utilitária para pegar storeId do usuário logado
const getUserStoreId = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        return user.storeId || 1
      } catch {}
    }
  }
  return 1
}

export default function NovoProdutoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [photoLimit, setPhotoLimit] = useState(2)
  const [produto, setProduto] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    categories: [] as number[],
    brandId: "",
    stock: "",
    sku: "",
    isActive: true,
    isNew: false,
    isLaunch: false,
    isPromotion: false,
    images: [] as string[],
    video: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    variants: [] as any[],
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categorias, setCategorias] = useState<any[]>([])
  const [subcategorias, setSubcategorias] = useState<any[]>([])
  const [marcas, setMarcas] = useState<any[]>([])
  const [novaMarca, setNovaMarca] = useState("")
  const [addingBrand, setAddingBrand] = useState(false)
  const [variantUpdate, setVariantUpdate] = useState(0)

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const storeId = getUserStoreId()
        const res = await fetch(`/api/categories?storeId=${storeId}`)
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
    fetchMarcas()
  }, [])

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
    // Validação básica - considerar múltiplas categorias
    // Garante que pelo menos uma categoria principal está selecionada
    if (!produto.name || !produto.price || produto.categories.length === 0 || produto.images.length === 0) {
      toast({ title: 'Preencha todos os campos obrigatórios, selecione pelo menos uma categoria principal e envie pelo menos uma imagem.', variant: 'destructive' })
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
        // Sempre usar a primeira categoria principal selecionada como categoryId
        const mainCategoryId = produto.categories[0];
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: produto.name,
            description: produto.description,
            price: Number(produto.price),
            original_price: produto.originalPrice ? Number(produto.originalPrice) : null,
            categoryId: mainCategoryId, // sempre um id válido
            categories: produto.categories,
            sku: produto.sku,
            isActive: produto.isActive,
            isNew: produto.isNew,
            isLaunch: produto.isLaunch,
            isPromotion: produto.isPromotion,
            stock: produto.stock ? Number(produto.stock) : null,
            images: produto.images,
            video: produto.video,
            weight: produto.weight,
            dimensions: produto.dimensions,
            brandId: produto.brandId ? Number(produto.brandId) : null,
            storeId: storeId,
            variants: produto.variants,
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold leading-tight">{produto.name || 'Novo Produto'}</h1>
              {produto.sku && (
                <span className="text-xs text-muted-foreground">Código: {produto.sku}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 ml-auto">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
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

      {/* Tabs responsivos */}
      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="midia">Mídia</TabsTrigger>
          <TabsTrigger value="variantes">Variantes</TabsTrigger>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
        </TabsList>

        {/* Informações Gerais */}
        <TabsContent value="geral">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Nome do Produto</Label>
              <Input id="name" className="w-full" value={produto.name} onChange={(e) => setProduto({ ...produto, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" className="w-full" value={produto.sku} onChange={(e) => setProduto({ ...produto, sku: e.target.value })} />
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
              <Label htmlFor="brand">Marca</Label>
              <div className="flex flex-col sm:flex-row gap-2">
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
                <div className="flex gap-2">
                  <Input
                    value={novaMarca}
                    onChange={e => setNovaMarca(e.target.value)}
                    placeholder="Nova marca"
                    className="flex-1"
                    disabled={addingBrand}
                  />
                  <Button onClick={handleAddMarca} disabled={addingBrand || !novaMarca.trim()} type="button" size="sm">
                    {addingBrand ? 'Adicionando...' : 'Adicionar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>Selecione as categorias do produto</CardDescription>
            </CardHeader>
            <CardContent>
              <CategorySelector
                storeId={getUserStoreId()}
                selectedCategories={produto.categories}
                onCategoriesChange={(categories) => setProduto({ ...produto, categories })}
                isPromotion={produto.isPromotion}
                isLaunch={produto.isLaunch}
                onSpecialChange={(type, value) => {
                  if (type === 'promotion') {
                    setProduto({ ...produto, isPromotion: value })
                  } else if (type === 'launch') {
                    setProduto({ ...produto, isLaunch: value })
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Badges do Produto */}
          <ProductBadges
            isNew={produto.isNew}
            isLaunch={produto.isLaunch}
            isPromotion={produto.isPromotion}
            onNewChange={(value) => setProduto({ ...produto, isNew: value })}
            onLaunchChange={(value) => setProduto({ ...produto, isLaunch: value })}
            onPromotionChange={(value) => setProduto({ ...produto, isPromotion: value })}
          />

          <Card>
            <CardHeader>
              <CardTitle>Status do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3 mt-6">
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
                  <span className="text-sm">Disponível em todos os canais</span>
                  <Switch checked={produto.isActive} onCheckedChange={v => setProduto({ ...produto, isActive: v })} className="scale-125" />
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
                  <span className="text-sm flex items-center gap-1">Exibir selo destaque no produto <span title="Exibe um selo de destaque no card do produto."><i>i</i></span></span>
                  <Switch checked={produto.isNew} onCheckedChange={v => setProduto({ ...produto, isNew: v })} className="scale-125" />
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
                  <span className="text-sm flex items-center gap-1">Exibir selo lançamento no produto <span title="Exibe um selo de lançamento no card do produto."><i>i</i></span></span>
                  <Switch checked={produto.isLaunch} onCheckedChange={v => setProduto({ ...produto, isLaunch: v })} className="scale-125" />
                </div>
                <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border">
                  <span className="text-sm flex items-center gap-1">Exibir selo adicional no produto <span title="Exibe um selo adicional personalizado."><i>i</i></span></span>
                  <Switch checked={produto.isPromotion} onCheckedChange={v => setProduto({ ...produto, isPromotion: v })} className="scale-125" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {produto.images.slice(0, 4).map((image, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-100 flex-shrink-0">
                      <Image src={image || '/placeholder.svg'} alt={`Produto ${idx + 1}`} fill className="object-cover" />
                      <Button size="icon" variant="ghost" className="absolute top-1 right-1 bg-white/80" onClick={() => removeImage(idx)}>
                        <X className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                  {produto.images.length > 4 && (
                    <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                      +{produto.images.length - 4}
                    </div>
                  )}
                  <Button asChild size="icon" variant="outline" className="w-20 h-20 flex-shrink-0">
                    <label htmlFor="image-upload"> <Upload className="h-6 w-6" /> </label>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">JPG, JPEG e PNG até 350Kb e 2000px</p>
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
            {/* Gerenciar Variantes Personalizadas */}
            <VariantManager storeId={getUserStoreId()} onVariantCreated={() => setVariantUpdate(v => v + 1)} />
            {/* Botão de atualizar variantes */}
            <div className="flex justify-end mb-2">
              <Button size="sm" variant="outline" onClick={() => setVariantUpdate(v => v + 1)}>
                Atualizar Variantes
              </Button>
            </div>
            {/* Variantes do Produto */}
            <Card>
              <CardHeader>
                <CardTitle>Variantes do Produto</CardTitle>
                <CardDescription>Selecione as variantes disponíveis para este produto específico</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductVariants 
                  storeId={getUserStoreId()}
                  variantUpdate={variantUpdate}
                  selectedVariants={produto.variants}
                  onVariantsChange={variants => setProduto({ ...produto, variants })}
                />
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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
