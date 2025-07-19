"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Edit, Eye, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

// Função utilitária para pegar storeId do usuário logado
const getUserStoreId = () => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.storeId || 1
  }
  return 1
}

export default function KitsPage() {
  const [kits, setKits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingKit, setEditingKit] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    category: "",
    isActive: true,
    featured: false,
    image: "",
    products: [] as any[]
  })

  useEffect(() => {
    fetchKits()
  }, [])

  const fetchKits = async () => {
    setLoading(true)
    try {
      const storeId = getUserStoreId()
      const response = await fetch(`/api/kits?storeId=${storeId}`)
      const data = await response.json()
      
      if (data.success) {
        setKits(data.kits || [])
      } else {
        setKits([])
      }
    } catch (error) {
      console.error('Erro ao carregar kits:', error)
      setKits([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.price || formData.products.length === 0) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, preço e adicione pelo menos um produto.',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      const storeId = getUserStoreId()
      const payload = {
        ...formData,
        storeId,
        priceValue: parseFloat(formData.price.replace(/[^\d,]/g, '').replace(',', '.')),
        originalPriceValue: formData.originalPrice ? 
          parseFloat(formData.originalPrice.replace(/[^\d,]/g, '').replace(',', '.')) : null
      }

      const url = editingKit ? `/api/kits?id=${editingKit.id}` : '/api/kits'
      const method = editingKit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: editingKit ? 'Kit atualizado' : 'Kit criado',
          description: `Kit ${editingKit ? 'atualizado' : 'criado'} com sucesso.`
        })
        setIsDialogOpen(false)
        resetForm()
        fetchKits()
      } else {
        throw new Error(data.message || 'Erro ao salvar kit')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar kit.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (kitId: number) => {
    if (!confirm('Tem certeza que deseja excluir este kit?')) return

    try {
      const response = await fetch(`/api/kits?id=${kitId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Kit excluído',
          description: 'Kit excluído com sucesso.'
        })
        fetchKits()
      } else {
        throw new Error(data.message || 'Erro ao excluir kit')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir kit.',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      stock: "",
      category: "",
      isActive: true,
      featured: false,
      image: "",
      products: []
    })
    setEditingKit(null)
  }

  const openEditDialog = (kit: any) => {
    setEditingKit(kit)
    setFormData({
      name: kit.name || "",
      description: kit.description || "",
      price: kit.price || "",
      originalPrice: kit.originalPrice || "",
      stock: kit.stock?.toString() || "",
      category: kit.category || "",
      isActive: kit.isActive ?? true,
      featured: kit.featured ?? false,
      image: kit.image || "",
      products: kit.products || []
    })
    setIsDialogOpen(true)
  }

  const filteredKits = kits.filter(kit => {
    const matchesSearch = kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kit.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && kit.isActive) ||
                         (statusFilter === "inactive" && !kit.isActive)
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Kits de Produtos</h1>
          <p className="text-muted-foreground">Crie e gerencie kits de produtos com preços especiais</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Novo Kit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingKit ? 'Editar Kit' : 'Novo Kit'}</DialogTitle>
              <DialogDescription>
                {editingKit ? 'Edite as informações do kit' : 'Crie um novo kit de produtos'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Kit *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Kit Look Completo"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Conjuntos"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descrição do kit..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Preço do Kit *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="R$ 299,90"
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Preço Original</Label>
                  <Input
                    id="originalPrice"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                    placeholder="R$ 399,90"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                  />
                  <Label htmlFor="isActive">Ativo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                  />
                  <Label htmlFor="featured">Destaque</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : (editingKit ? 'Atualizar' : 'Criar Kit')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar kits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-80"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Kits</p>
                <p className="text-2xl font-bold">{kits.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kits Ativos</p>
                <p className="text-2xl font-bold">{kits.filter(k => k.isActive).length}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Destaque</p>
                <p className="text-2xl font-bold">{kits.filter(k => k.featured).length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  R$ {kits.reduce((sum, kit) => sum + (kit.priceValue || 0), 0).toLocaleString()}
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Kits */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Kits</CardTitle>
          <CardDescription>
            {filteredKits.length} kit(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kit</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKits.map((kit) => (
                <TableRow key={kit.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {kit.image && (
                        <Image
                          src={kit.image}
                          alt={kit.name}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{kit.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {kit.products?.length || 0} produto(s)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{kit.category}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{kit.price}</div>
                      {kit.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {kit.originalPrice}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{kit.stock}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={kit.isActive ? "default" : "secondary"}>
                        {kit.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                      {kit.featured && (
                        <Badge variant="outline">Destaque</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          ⋮
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(kit)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(kit.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
