'use client'
import { PlusCircle, File, MoreHorizontal, Package, AlertTriangle, CheckCircle, XCircle, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from 'react'
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProdutosPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [limits, setLimits] = useState<any>(null)
  const [limitsLoading, setLimitsLoading] = useState(true)
  const [filter, setFilter] = useState("todos")
  const [categoryFilter, setCategoryFilter] = useState("todas")
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingLoading, setEditingLoading] = useState(false)
  const [editCategorias, setEditCategorias] = useState<any[]>([])
  const [editSubcategorias, setEditSubcategorias] = useState<any[]>([])
  const { toast } = useToast()

  // Função utilitária para pegar storeId do usuário logado
  const getUserStoreId = () => {
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
    return storeId;
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const storeId = getUserStoreId()
      const response = await fetch(`/api/products?storeId=${storeId}`, {
        cache: 'no-store'
      })
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
      } else {
        console.error('Erro ao carregar produtos:', data.error)
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchLimits = async () => {
      setLimitsLoading(true)
      try {
        const storeId = getUserStoreId()
        const res = await fetch(`/api/store-limits?storeId=${storeId}`)
        const data = await res.json()
        if (data.success) {
          setLimits(data.data)
        }
      } catch (err) {
        console.error('Erro ao buscar limites:', err)
      } finally {
        setLimitsLoading(false)
      }
    }
    
    loadProducts()
    fetchLimits()
  }, [])

  // Carregar categorias ao abrir modal de edição
  useEffect(() => {
    if (editModalOpen) {
      fetch('/api/categories')
        .then(res => res.json())
        .then(data => setEditCategorias(data))
        .catch(() => setEditCategorias([]))
    }
  }, [editModalOpen])

  // Atualizar subcategorias ao selecionar categoria
  useEffect(() => {
    if (editingProduct && editCategorias.length > 0) {
      const cat = editCategorias.find((c) => String(c.id) === String(editingProduct.category))
      setEditSubcategorias(cat && cat.subcategories ? cat.subcategories : [])
    }
  }, [editingProduct?.category, editCategorias])

  // Formatação monetária
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    const formattedValue = (parseInt(numericValue) / 100).toFixed(2)
    return formattedValue
  }

  const handleEditPriceChange = (field: 'price' | 'original_price', value: string) => {
    const formatted = formatCurrency(value)
    setEditingProduct({ ...editingProduct, [field]: formatted })
  }

  const openEditModal = (product: any) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price.replace('R$ ', ''),
      original_price: product.original_price ? product.original_price.replace('R$ ', '') : '',
      stock: product.stock,
      sku: product.sku || '',
      brand: product.brand || '',
      status: product.status === 'active' ? 'ativo' : 'inativo',
      category: product.categoryId || '',
      subcategory: ''
    })
    setEditModalOpen(true)
  }

  const handleEditProduct = async () => {
    try {
      setEditingLoading(true)
      const storeId = getUserStoreId()
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...editingProduct, storeId }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        // Recarregar produtos
        loadProducts()
        setEditModalOpen(false)
        setEditingProduct(null)
        toast({
          title: "Produto atualizado",
          description: "Produto editado com sucesso",
        })
      } else {
        toast({
          title: "Erro ao atualizar produto",
          description: data.error || 'Erro desconhecido',
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar produto",
        variant: "destructive",
      })
    } finally {
      setEditingLoading(false)
    }
  }

  const toggleProductStatus = async (productId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo'
      
      // Pegar storeId do usuário logado
      const storeId = getUserStoreId()
      
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, storeId: storeId }),
      })
      
      if (response.ok) {
        setProducts(products.map(product => 
          product.id === productId 
            ? { ...product, status: newStatus === 'ativo' ? 'active' : 'inactive' }
            : product
        ))
        toast({
          title: "Status atualizado",
          description: `Produto ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso`,
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do produto",
        variant: "destructive",
      })
    }
  }

  const filteredProducts = products.filter(product => {
    if (filter === "ativos") return product.status === 'active'
    if (filter === "inativos") return product.status === 'inactive'
    if (filter === "rascunho") return product.status === 'draft'
    if (filter === "arquivados") return product.status === 'archived'
    return true // todos
  })

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500"
    if (percentage >= 80) return "bg-yellow-500"
    if (percentage >= 60) return "bg-orange-500"
    return "bg-green-500"
  }

  // Componente do contador de limites
  const LimitsCard = () => {
    if (limitsLoading || !limits) return null;
    
    const { products } = limits;
    const progressColor = products.status === 'exceeded' ? 'bg-red-500' : 
                         products.status === 'warning' ? 'bg-yellow-500' : 
                         products.status === 'caution' ? 'bg-orange-500' : 'bg-green-500';
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">Produtos do Plano {limits.plano}</CardTitle>
              <CardDescription>
                {products.current} de {products.limit} produtos usados
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{products.percentUsed}%</div>
              <div className="text-xs text-muted-foreground">
                {products.remaining} restantes
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Progress value={products.percentUsed} className="h-2" />
          
          {products.status === 'exceeded' && (
            <Alert className="mt-3" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Limite de produtos atingido! Atualize seu plano para cadastrar mais produtos.
              </AlertDescription>
            </Alert>
          )}
          
          {products.status === 'warning' && (
            <Alert className="mt-3" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Você está próximo do limite! Restam apenas {products.remaining} produtos.
              </AlertDescription>
            </Alert>
          )}
          
          {products.status === 'caution' && (
            <Alert className="mt-3">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Você já usou {products.percentUsed}% do seu limite de produtos.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Produtos</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1 bg-transparent">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
          </Button>
          <Link href="/dashboard/produtos/novo">
            <Button 
              size="sm" 
              className="h-8 gap-1"
              disabled={limits && !limits.products.canAdd}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Novo Produto</span>
            </Button>
          </Link>
        </div>
      </div>
      
      <LimitsCard />
      
      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativo">Ativo</TabsTrigger>
          <TabsTrigger value="rascunho">Rascunho</TabsTrigger>
          <TabsTrigger value="arquivado" className="hidden sm:flex">
            Arquivado
          </TabsTrigger>
        </TabsList>
        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>
                Gerencie seus produtos e visualize as vendas
              </CardDescription>
              <div className="flex gap-4 items-center">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="ativos">Ativos</SelectItem>
                    <SelectItem value="inativos">Inativos</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="arquivados">Arquivados</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="vestidos">Vestidos</SelectItem>
                    <SelectItem value="blusas">Blusas</SelectItem>
                    <SelectItem value="calcas">Calças</SelectItem>
                    <SelectItem value="sapatos">Sapatos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[100px] sm:table-cell">
                        <span className="sr-only">Imagem</span>
                      </TableHead>
                      <TableHead className="w-[80px]">Código</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Preço</TableHead>
                      <TableHead className="hidden md:table-cell">Estoque</TableHead>
                      <TableHead className="hidden md:table-cell">Vendidos</TableHead>
                      <TableHead className="hidden md:table-cell">Criado</TableHead>
                      <TableHead>
                        <span className="sr-only">Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                        <TableCell className="hidden sm:table-cell">
                        {product.images && product.images.length > 0 ? (
                          <img
                            alt="Product image"
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={product.images[0]}
                            width="64"
                          />
                        ) : (
                          <div className="aspect-square rounded-md bg-gray-100 flex items-center justify-center w-16 h-16">
                            <span className="text-gray-400 text-xs">Sem foto</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {product.sku || `#${product.id}`}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.brand || 'Sem marca'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {product.category || 'Sem categoria'}
                        </TableCell>
                        <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.status === 'active'}
                            onCheckedChange={() => toggleProductStatus(product.id, product.status === 'active' ? 'ativo' : 'inativo')}
                          />
                          <span className="text-sm">
                            {product.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{product.price}</TableCell>
                        <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.sold || 0}
                      </TableCell>
                        <TableCell className="hidden md:table-cell">{product.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => window.open(`/produto/${product.id}`, '_blank')}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver na loja
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditModal(product)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> produtos
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Edição */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no produto.
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Preço
                </Label>
                <Input
                  id="price"
                  type="text"
                  value={editingProduct.price}
                  onChange={(e) => handleEditPriceChange('price', e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="original_price" className="text-right">
                  Preço Original
                </Label>
                <Input
                  id="original_price"
                  type="text"
                  value={editingProduct.original_price}
                  onChange={(e) => handleEditPriceChange('original_price', e.target.value)}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Estoque
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={editingProduct.sku}
                  readOnly
                  className="col-span-3 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">
                  Marca
                </Label>
                <Input
                  id="brand"
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="col-span-3"
                  placeholder="Ex: Nike, Adidas, etc."
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Categoria</Label>
                <select
                  value={editingProduct.category}
                  onChange={e => {
                    setEditingProduct({ ...editingProduct, category: e.target.value, subcategory: '' })
                    const cat = editCategorias.find((c) => String(c.id) === e.target.value)
                    setEditSubcategorias(cat && cat.subcategories ? cat.subcategories : [])
                  }}
                  className="col-span-3 p-2 border rounded-md mb-2"
                >
                  <option value="">Selecione uma categoria</option>
                  {editCategorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {editSubcategorias.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Subcategoria</Label>
                  <select
                    value={editingProduct.subcategory}
                    onChange={e => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    className="col-span-3 p-2 border rounded-md"
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {editSubcategorias.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditProduct} disabled={editingLoading}>
                  {editingLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 008-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"></path>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
