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

// Hook para detecção de mobile responsiva
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return isMobile
}

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
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [brandFilter, setBrandFilter] = useState("todas")
  const [searchName, setSearchName] = useState("")
  const [searchSku, setSearchSku] = useState("")
  const [searchBrand, setSearchBrand] = useState("")
  const [searchPriceMin, setSearchPriceMin] = useState("")
  const [searchPriceMax, setSearchPriceMax] = useState("")
  const [searchStock, setSearchStock] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const isMobile = useIsMobile()
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'createdAt'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

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

  const loadProducts = async (forceReload = false) => {
    setLoading(true)
    try {
      const storeId = getUserStoreId()
      const timestamp = forceReload ? `&_t=${Date.now()}` : ''
      const response = await fetch(`/api/products?storeId=${storeId}${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.products)
        
        // Extrair marcas únicas dos produtos
        const uniqueBrands = [...new Set(data.products
          .map((p: any) => p.brand)
          .filter((brand: string) => brand && brand.trim() !== '')
        )].sort() as string[]
        setBrands(uniqueBrands)
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
    
    const fetchCategories = async () => {
      try {
        const storeId = getUserStoreId()
        const res = await fetch(`/api/categories?storeId=${storeId}`)
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(data)
        }
      } catch (err) {
        console.error('Erro ao buscar categorias:', err)
      }
    }
    
    loadProducts()
    fetchLimits()
    fetchCategories()
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
        // Primeiro fechar o modal para melhor UX
        setEditModalOpen(false)
        setEditingProduct(null)
        
        // Recarregar produtos com cache invalidado
        await loadProducts(true)
        await reloadLimits()
        setCurrentPage(1) // Resetar para primeira página
        
        toast({
          title: "Produto atualizado",
          description: "Produto editado com sucesso",
        })
        
        // Forçar reload da tabela e disparar evento
        window.dispatchEvent(new Event('productsChanged'))
        
        // Força um re-render adicional
        setTimeout(() => {
          setFilter("todos") // Reset filtros pode ajudar a forçar reload
          setCurrentPage(1)
        }, 100)
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
    setDeleteModalOpen(true)
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
      setDeleteModalOpen(false);
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
    if (brandFilter !== "todas" && brandFilter && product.brand !== brandFilter) return false;
    if (searchName && !product.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    if (searchSku && (!product.sku || !product.sku.toLowerCase().includes(searchSku.toLowerCase()))) return false;
    if (searchBrand && (!product.brand || !product.brand.toLowerCase().includes(searchBrand.toLowerCase()))) return false;
    if (searchPriceMin && Number(product.price) < Number(searchPriceMin)) return false;
    if (searchPriceMax && Number(product.price) > Number(searchPriceMax)) return false;
    if (searchStock === "com" && (!product.stock || Number(product.stock) <= 0)) return false;
    if (searchStock === "sem" && Number(product.stock) > 0) return false;
    if (searchStock === "baixo" && Number(product.stock) > 10) return false;
    if (searchStock === "critico" && Number(product.stock) > 5) return false;
    return true;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'price':
        aValue = Number(a.price.replace(/[^\d.-]/g, ''));
        bValue = Number(b.price.replace(/[^\d.-]/g, ''));
        break;
      case 'stock':
        aValue = Number(a.stock);
        bValue = Number(b.stock);
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt || 0).getTime();
        bValue = new Date(b.createdAt || 0).getTime();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
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

  // Função para exportar produtos melhorada
  const exportProducts = (format: 'csv' | 'excel' = 'csv') => {
    try {
      if (filteredProducts.length === 0) {
        toast({
          title: "Nenhum produto para exportar",
          description: "Ajuste os filtros para encontrar produtos",
          variant: "destructive",
        })
        return
      }

      const exportData = filteredProducts.map(product => ({
        'ID': product.id,
        'Nome do Produto': product.name,
        'SKU': product.sku || '-',
        'Marca': product.brand || '-',
        'Categoria': product.category || '-',
        'Preço de Venda': product.price,
        'Preço Original': product.original_price || '-',
        'Quantidade em Estoque': product.stock,
        'Status': product.isActive ? 'Ativo' : 'Inativo',
        'Descrição': product.description?.replace(/"/g, '""') || '-',
        'Data de Criação': new Date(product.createdAt || Date.now()).toLocaleDateString('pt-BR'),
        'Situação do Estoque': product.stock <= 0 ? 'Sem estoque' : 
                               product.stock <= 5 ? 'Estoque crítico' :
                               product.stock <= 10 ? 'Baixo estoque' : 'Estoque normal'
      }))

      const headers = Object.keys(exportData[0])
      const timestamp = new Date().toISOString().split('T')[0]
      const storeInfo = getUserStoreId()
      
      if (format === 'csv') {
        // Exportar como CSV
        const csvContent = [
          `# Relatório de Produtos - ${new Date().toLocaleDateString('pt-BR')}`,
          `# Total: ${exportData.length} produtos`,
          `# Filtros aplicados: ${searchName ? 'Nome: ' + searchName + '; ' : ''}${filter !== 'todos' ? 'Status: ' + filter + '; ' : ''}${categoryFilter !== 'todas' ? 'Categoria: ' + categoryFilter + '; ' : ''}`,
          '',
          headers.join(','),
          ...exportData.map(row => 
            headers.map(header => {
              const value = row[header as keyof typeof row]
              return `"${String(value).replace(/"/g, '""')}"`
            }).join(',')
          )
        ].join('\n')

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
        downloadFile(blob, `produtos_loja_${storeInfo}_${timestamp}.csv`)
      } else {
        // Exportar como Excel (HTML table que o Excel pode abrir)
        const excelContent = `
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; font-weight: bold; }
                .header { background-color: #4CAF50; color: white; }
              </style>
            </head>
            <body>
              <h2>Relatório de Produtos - ${new Date().toLocaleDateString('pt-BR')}</h2>
              <p><strong>Total:</strong> ${exportData.length} produtos</p>
              <p><strong>Exportado em:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              <table>
                <thead>
                  <tr class="header">
                    ${headers.map(header => `<th>${header}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${exportData.map(row => 
                    `<tr>${headers.map(header => `<td>${row[header as keyof typeof row]}</td>`).join('')}</tr>`
                  ).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `
        
        const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' })
        downloadFile(blob, `produtos_loja_${storeInfo}_${timestamp}.xls`)
      }

      toast({
        title: "✅ Exportação concluída",
        description: `${exportData.length} produtos exportados em ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Erro na exportação:', error)
      toast({
        title: "Erro na exportação",
        description: "Erro ao exportar produtos. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Função auxiliar para download
  const downloadFile = (blob: Blob, filename: string) => {
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-1 bg-transparent w-full sm:w-auto"
                disabled={filteredProducts.length === 0}
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Exportar ({filteredProducts.length})
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>📊 Formato de Exportação</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => exportProducts('csv')}>
                <File className="h-4 w-4 mr-2" />
                CSV (Excel, Google Sheets)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportProducts('excel')}>
                <Package className="h-4 w-4 mr-2" />
                Excel (.xls)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Alerta de baixo estoque */}
      {(() => {
        const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0).length;
        const outOfStockProducts = products.filter(p => p.stock <= 0).length;
        
        if (lowStockProducts > 0 || outOfStockProducts > 0) {
          return (
            <Alert className="mb-4" variant={outOfStockProducts > 0 ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {outOfStockProducts > 0 && (
                  <span className="font-semibold text-red-700">
                    {outOfStockProducts} produto(s) sem estoque
                  </span>
                )}
                {outOfStockProducts > 0 && lowStockProducts > 0 && " • "}
                {lowStockProducts > 0 && (
                  <span className="font-semibold text-yellow-700">
                    {lowStockProducts} produto(s) com baixo estoque
                  </span>
                )}
                . Considere reabastecer ou atualizar o estoque.
              </AlertDescription>
            </Alert>
          );
        }
        return null;
      })()}

      {/* Filtros melhorados */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">🔍 Filtros de Produtos</CardTitle>
          <CardDescription className="text-xs">
            Use os filtros abaixo para encontrar produtos específicos de forma rápida e precisa
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">📝 Nome do produto</Label>
              <Input
                placeholder="Digite o nome do produto..." 
                value={searchName} 
                onChange={e => setSearchName(e.target.value)} 
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">🏷️ Código SKU</Label>
              <Input
                placeholder="Digite o código SKU..." 
                value={searchSku} 
                onChange={e => setSearchSku(e.target.value)} 
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">🏢 Marca do produto</Label>
              <Input
                placeholder="Digite o nome da marca..." 
                value={searchBrand}
                onChange={e => setSearchBrand(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">✅ Status do produto</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">📦 Todos os produtos</SelectItem>
                  <SelectItem value="ativos">✅ Apenas ativos</SelectItem>
                  <SelectItem value="inativos">❌ Apenas inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">📁 Categoria</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">📁 Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">🏷️ Filtrar por marca</Label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione a marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">🏷️ Todas as marcas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">💰 Preço mínimo</Label>
              <Input
                placeholder="R$ 0,00" 
                type="number"
                step="0.01"
                value={searchPriceMin}
                onChange={e => setSearchPriceMin(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">💰 Preço máximo</Label>
              <Input
                placeholder="R$ 999,99" 
                type="number"
                step="0.01"
                value={searchPriceMax}
                onChange={e => setSearchPriceMax(e.target.value)}
                className="text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">📦 Situação do estoque</Label>
              <Select value={searchStock || "todos"} onValueChange={v => setSearchStock(v === "todos" ? "" : v)}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">📦 Todas as situações</SelectItem>
                  <SelectItem value="com">✅ Com estoque</SelectItem>
                  <SelectItem value="sem">❌ Sem estoque</SelectItem>
                  <SelectItem value="baixo">⚠️ Baixo estoque (≤ 10)</SelectItem>
                  <SelectItem value="critico">🚨 Estoque crítico (≤ 5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Ordenação e botão para limpar filtros */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Label className="text-xs font-medium text-gray-700">📊 Ordenar por:</Label>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'stock' | 'createdAt') => setSortBy(value)}>
                  <SelectTrigger className="text-sm w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">📝 Nome</SelectItem>
                    <SelectItem value="price">💰 Preço</SelectItem>
                    <SelectItem value="stock">📦 Estoque</SelectItem>
                    <SelectItem value="createdAt">📅 Data</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3"
                  title={sortOrder === 'asc' ? 'Ordenar decrescente' : 'Ordenar crescente'}
                >
                  {sortOrder === 'asc' ? '⬆️ A-Z' : '⬇️ Z-A'}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-gray-500 self-center">
                {filteredProducts.length} de {products.length} produtos
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchName("")
                  setSearchSku("")
                  setSearchBrand("")
                  setSearchPriceMin("")
                  setSearchPriceMax("")
                  setSearchStock("")
                  setFilter("todos")
                  setCategoryFilter("todas")
                  setBrandFilter("todas")
                  setSortBy("name")
                  setSortOrder("asc")
                  setCurrentPage(1)
                }}
                className="whitespace-nowrap"
              >
                🔄 Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Renderização condicional: cards no mobile, tabela no desktop */}
      {isMobile ? (
        <div className="space-y-3">
          {paginatedProducts.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? '✅ ativo' : '❌ inativo'}
                      </span>
                      <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-1 rounded">#{product.sku || product.id}</span>
                    </div>
                    <h3 className="font-semibold text-base mb-2 leading-tight">{product.name}</h3>
                    
                    {product.brand && (
                      <div className="text-sm text-blue-600 mb-2 font-medium">🏢 {product.brand}</div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">💰 Preço:</span>
                        <div className="font-bold text-lg text-green-600">{product.price}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">📦 Estoque:</span>
                        <div className={`font-semibold ${
                          product.stock <= 0 ? 'text-red-600' :
                          product.stock <= 5 ? 'text-red-500' :
                          product.stock <= 10 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {product.stock} un.
                          {product.stock <= 5 && product.stock > 0 && ' ⚠️'}
                          {product.stock <= 0 && ' 🚫'}
                        </div>
                      </div>
                    </div>
                    
                    {product.category && (
                      <div className="text-xs text-gray-500 mt-2">
                        📁 {product.category}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Ações mobile organizadas */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={product.isActive} 
                      onCheckedChange={checked => toggleProductStatus(product.id, product.isActive ? 'inactive' : 'active')}
                      className="scale-90"
                    />
                    <span className="text-xs text-gray-600">Ativo</span>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="w-8 h-8" 
                      asChild
                      title="Ver na loja"
                    >
                      <Link href={`/produto/${product.slug || product.id}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="w-8 h-8" 
                      onClick={() => openEditModal(product)} 
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => { setProductToDelete(product); setDeleteModalOpen(true); }} 
                      title="Excluir"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Controles de paginação mobile melhorados */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex flex-col items-center gap-3">
                <div className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages} • {filteredProducts.length} produtos
                </div>
                <div className="flex gap-2 w-full">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="flex-1"
                  >
                    ← Anterior
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="flex-1"
                  >
                    Próxima →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Tabela responsiva */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
              <CardDescription>Gerencie seus produtos e visualize as vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">📷</TableHead>
                        <TableHead className="min-w-[180px]">📝 Produto</TableHead>
                        <TableHead className="hidden md:table-cell min-w-[120px]">📁 Categoria</TableHead>
                        <TableHead className="w-[90px]">✅ Status</TableHead>
                        <TableHead className="hidden sm:table-cell min-w-[100px]">💰 Preço</TableHead>
                        <TableHead className="hidden lg:table-cell min-w-[100px]">📦 Estoque</TableHead>
                        <TableHead className="w-[140px]">⚙️ Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <img src={product.images?.[0] || '/placeholder.svg'} alt={product.name} className="w-12 h-12 rounded-lg object-cover border" />
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-sm truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.sku || product.id}</div>
                          {product.brand && (
                            <div className="text-xs text-blue-600">{product.brand}</div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-xs text-muted-foreground">{product.category && product.category.trim() !== '' ? product.category : '-'}</span>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.isActive ? 'ativo' : 'inativo'}</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-bold text-sm">{product.price}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            product.stock <= 0 ? 'bg-red-50 text-red-700' :
                            product.stock <= 5 ? 'bg-red-100 text-red-800' :
                            product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-50 text-green-700'
                          }`}>
                            {product.stock} unidades
                            {product.stock <= 5 && product.stock > 0 && (
                              <span className="ml-1 text-xs">⚠️</span>
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 items-center">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="w-7 h-7" 
                              asChild
                              title="Ver na loja"
                            >
                              <Link href={`/produto/${product.slug || product.id}`} target="_blank">
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </Button>
                            <Switch 
                              checked={product.isActive} 
                              onCheckedChange={checked => toggleProductStatus(product.id, product.isActive ? 'inactive' : 'active')}
                              className="scale-75"
                            />
                            <Button size="icon" variant="outline" className="w-7 h-7" onClick={() => openEditModal(product)} title="Editar">
                              <Pencil className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => { setProductToDelete(product); setDeleteModalOpen(true); }} title="Excluir">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  </Table>
                </div>
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

      {/* Modal de exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
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
              onClick={() => setDeleteModalOpen(false)} 
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
