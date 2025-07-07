'use client'
import { PlusCircle, File, MoreHorizontal, Package, AlertTriangle, CheckCircle, XCircle, Eye, ExternalLink, Pencil, Trash2 } from "lucide-react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Adicionar detecção de mobile
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchSku, setSearchSku] = useState("")
  const [searchBrand, setSearchBrand] = useState("")
  const [searchPriceMin, setSearchPriceMin] = useState("")
  const [searchPriceMax, setSearchPriceMax] = useState("")
  const [searchStock, setSearchStock] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
      const storeId = getUserStoreId();
      fetch(`/api/categories?storeId=${storeId}`)
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
        await loadProducts()
        await reloadLimits()
        setEditModalOpen(false)
        setEditingProduct(null)
        toast({
          title: "Produto atualizado",
          description: "Produto editado com sucesso",
        })
        window.dispatchEvent(new Event('productsChanged'))
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
        await reloadLimits()
        toast({
          title: "Status atualizado",
          description: `Produto ${newStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso`,
        })
        window.dispatchEvent(new Event('productsChanged'))
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do produto",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    setProductToDelete(products.find(p => p.id === productId))
    setIsDialogOpen(true)
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const storeId = getUserStoreId()
      const response = await fetch(`/api/products/${productToDelete.id}?storeId=${storeId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Produto excluído com sucesso.',
        });
        // Remover produto da lista local
        setProducts(products.filter(p => p.id !== productToDelete.id));
        // Disparar evento para atualizar plano/limite
        window.dispatchEvent(new Event('productsChanged'));
      } else {
        const errorData = await response.json();
        toast({
          title: 'Erro',
          description: errorData.error || 'Erro ao excluir produto.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir produto.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setIsDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter !== "todos" && filter) {
      if (filter === "ativos" && product.status !== 'active') return false;
      if (filter === "inativos" && product.status !== 'inactive') return false;
      if (filter === "rascunho" && product.status !== 'draft') return false;
      if (filter === "arquivados" && product.status !== 'archived') return false;
    }
    if (categoryFilter !== "todas" && categoryFilter && product.category !== categoryFilter) return false;
    if (searchName && !product.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (searchSku && (!product.sku || !product.sku.toLowerCase().includes(searchSku.toLowerCase()))) return false;
    if (searchBrand && (!product.brand || !product.brand.toLowerCase().includes(searchBrand.toLowerCase()))) return false;
    if (searchPriceMin && Number(product.price) < Number(searchPriceMin)) return false;
    if (searchPriceMax && Number(product.price) > Number(searchPriceMax)) return false;
    if (searchStock === "com" && (!product.stock || Number(product.stock) <= 0)) return false;
    if (searchStock === "sem" && Number(product.stock) > 0) return false;
    return true;
  })

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

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

  // Adicionar função para reload dos limites
  const reloadLimits = async () => {
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

  return (
    <div className="flex flex-col gap-4">
      {/* Header responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">Produtos</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-auto">
          <Button size="sm" variant="outline" className="h-8 gap-1 bg-transparent w-full sm:w-auto">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Exportar</span>
          </Button>
          {limits && !limits.products.canAdd ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="w-full sm:w-auto">
                    <Button disabled className="w-full sm:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Novo Produto
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  Limite de produtos atingido para seu plano.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button asChild className="w-full sm:w-auto py-3 text-base sm:py-2 mt-2 sm:mt-0">
          <Link href="/dashboard/produtos/novo">
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Produto
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      <LimitsCard />

      {/* Filtro no topo */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input placeholder="Buscar por nome, código, SKU..." value={searchName} onChange={e => setSearchName(e.target.value)} className="w-full sm:w-64" />
        {/* Adicione outros filtros/selects conforme necessário */}
      </div>

      {/* Renderização condicional: cards no mobile, tabela no desktop */}
      {isMobile ? (
        <div className="flex flex-col gap-3 mt-4">
          {paginatedProducts.map(product => (
            <div key={product.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white shadow-sm">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.isActive ? 'ativo' : 'inativo'}</span>
                  <span className="text-xs text-muted-foreground">{product.sku || product.id}</span>
                </div>
                <div className="font-semibold truncate text-base">{product.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-gray-800">{product.price}</span>
                  <span className="text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">{product.stock} unidades</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-2 items-end">
                <Switch checked={product.isActive} onCheckedChange={checked => {/* lógica para ativar/desativar produto */}} />
                <Button size="icon" variant="outline" className="w-8 h-8" onClick={() => openEditModal(product)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => { setProductToDelete(product); setDeleteModalOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          {/* Controles de paginação mobile */}
          <div className="flex justify-center gap-2 mt-4">
            <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
            <span className="text-sm font-medium">Página {currentPage} de {totalPages}</span>
            <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Próxima</Button>
          </div>
        </div>
      ) : (
        <>
          {/* Tabela tradicional desktop */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>Gerencie seus produtos e visualize as vendas</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tabela responsiva */}
              <div className="w-full overflow-x-auto max-w-full">
                <Table className="min-w-full table-auto">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden w-[60px] xs:table-cell"> <span className="sr-only">Imagem</span> </TableHead>
                      <TableHead className="w-[80px] xs:w-[60px]">Código</TableHead>
                      <TableHead className="min-w-[100px] xs:min-w-[150px]">Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Categoria</TableHead>
                      <TableHead className="w-[80px] xs:w-[100px]">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Preço</TableHead>
                      <TableHead className="hidden lg:table-cell">Estoque</TableHead>
                      <TableHead className="hidden xl:table-cell">Vendidos</TableHead>
                      <TableHead className="hidden xl:table-cell">Criado</TableHead>
                      <TableHead> <span className="sr-only">Ações</span> </TableHead>
                    </TableRow>
                    {/* Linha de filtros */}
                    <TableRow className="bg-muted/50">
                      <TableCell className="hidden sm:table-cell"></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row">
                          <Input
                            placeholder="SKU"
                            className="w-full text-xs px-2 py-1"
                            value={searchSku}
                            onChange={e => setSearchSku(e.target.value)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row">
                          <Input
                            placeholder="Nome"
                            className="w-full text-xs px-2 py-1"
                            value={searchName}
                            onChange={e => setSearchName(e.target.value)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row">
                          <Input
                            placeholder="Marca"
                            className="w-full text-xs px-2 py-1"
                            value={searchBrand}
                            onChange={e => setSearchBrand(e.target.value)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-full text-xs px-2 py-1">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            <SelectItem value="vestidos">Vestidos</SelectItem>
                            <SelectItem value="blusas">Blusas</SelectItem>
                            <SelectItem value="calcas">Calças</SelectItem>
                            <SelectItem value="sapatos">Sapatos</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={filter} onValueChange={setFilter}>
                          <SelectTrigger className="w-full text-xs px-2 py-1">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="ativos">Ativos</SelectItem>
                            <SelectItem value="inativos">Inativos</SelectItem>
                            <SelectItem value="rascunho">Rascunho</SelectItem>
                            <SelectItem value="arquivados">Arquivados</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row">
                          <Input
                            placeholder="Mín"
                            className="w-full sm:w-16 text-xs px-2 py-1"
                            type="number"
                            value={searchPriceMin}
                            onChange={e => setSearchPriceMin(e.target.value)}
                          />
                          <Input
                            placeholder="Máx"
                            className="w-full sm:w-16 text-xs px-2 py-1"
                            type="number"
                            value={searchPriceMax}
                            onChange={e => setSearchPriceMax(e.target.value)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Select value={searchStock || "todos"} onValueChange={v => setSearchStock(v === "todos" ? "" : v)}>
                          <SelectTrigger className="w-full text-xs px-2 py-1">
                            <SelectValue placeholder="Estoque" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="com">Com estoque</SelectItem>
                            <SelectItem value="sem">Sem estoque</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell"></TableCell>
                      <TableCell className="hidden xl:table-cell"></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="w-20">
                          <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-12 h-12 rounded-lg object-cover border" />
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-base truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.sku || product.id}</div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{product.category && product.category.trim() !== '' ? product.category : '-'}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.isActive ? 'ativo' : 'inativo'}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold">{product.price}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">{product.stock} unidades</span>
                        </TableCell>
                        <TableCell className="flex gap-2 items-center">
                          <Switch checked={product.isActive} onCheckedChange={checked => {/* lógica para ativar/desativar produto */}} />
                          <Button size="icon" variant="outline" className="w-8 h-8" onClick={() => openEditModal(product)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => { setProductToDelete(product); setDeleteModalOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> produtos
              </div>
            </CardFooter>
          </Card>
          {/* Controles de paginação desktop */}
          <div className="flex justify-end gap-2 mt-4">
            <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
            <span className="text-sm font-medium">Página {currentPage} de {totalPages}</span>
            <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Próxima</Button>
          </div>
        </>
      )}

      {/* Modal de Edição - Melhorado para responsividade */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Faça as alterações necessárias no produto.
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="col-span-1 sm:col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="col-span-1 sm:col-span-3"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Preço
                </Label>
                <Input
                  id="price"
                  type="text"
                  value={editingProduct.price}
                  onChange={(e) => handleEditPriceChange('price', e.target.value)}
                  className="col-span-1 sm:col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="original_price" className="text-right">
                  Preço Original
                </Label>
                <Input
                  id="original_price"
                  type="text"
                  value={editingProduct.original_price}
                  onChange={(e) => handleEditPriceChange('original_price', e.target.value)}
                  className="col-span-1 sm:col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Estoque
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                  className="col-span-1 sm:col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={editingProduct.sku}
                  readOnly
                  className="col-span-1 sm:col-span-3 bg-gray-100 cursor-not-allowed"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label htmlFor="brand" className="text-right">
                  Marca
                </Label>
                <Input
                  id="brand"
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="col-span-1 sm:col-span-3"
                  placeholder="Ex: Nike, Adidas, etc."
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                <Label className="text-right">Categoria</Label>
                <select
                  value={editingProduct.category}
                  onChange={e => {
                    setEditingProduct({ ...editingProduct, category: e.target.value, subcategory: '' })
                    const cat = editCategorias.find((c) => String(c.id) === e.target.value)
                    setEditSubcategorias(cat && cat.subcategories ? cat.subcategories : [])
                  }}
                  className="col-span-1 sm:col-span-3 p-2 border rounded-md mb-2"
                >
                  <option value="">Selecione uma categoria</option>
                  {editCategorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              {editSubcategorias.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label className="text-right">Subcategoria</Label>
                  <select
                    value={editingProduct.subcategory}
                    onChange={e => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    className="col-span-1 sm:col-span-3 p-2 border rounded-md"
                  >
                    <option value="">Selecione uma subcategoria</option>
                    {editSubcategorias.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setEditModalOpen(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button onClick={handleEditProduct} disabled={editingLoading} className="w-full sm:w-auto">
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

      {/* Modal de exclusão - Corrigido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirmar exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto <strong>{productToDelete?.name}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)} 
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteProduct} 
              disabled={deleting}
              className="w-full sm:w-auto"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 008-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"></path>
                  </svg>
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
