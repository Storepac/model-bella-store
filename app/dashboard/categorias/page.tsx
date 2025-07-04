"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, Upload, Settings, Filter, Eye } from "lucide-react"
import Image from "next/image"
import { ImageUpload } from "@/components/ui/image-upload"

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    image: "",
    parentId: null,
    level: 0,
    display: {
      showFilters: true,
      showSorting: true,
      defaultSort: "relevance",
      itemsPerPage: 24,
      showPagination: true,
      showLoadMore: true
    },
    seo: {
      title: "",
      description: "",
      keywords: []
    }
  })

  // Carregar categorias da API ao montar
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategorias(data))
  }, [])

  const reloadCategorias = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategorias(data))
  }

  const filteredCategorias = categorias.filter((categoria: any) =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSave = async () => {
    const newCategory = {
      id: editingCategory ? editingCategory.id : undefined,
      ...formData,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
      image: formData.image || "/placeholder.svg?height=80&width=80",
      productCount: editingCategory ? editingCategory.productCount : 0,
      isActive: editingCategory ? editingCategory.isActive : true,
      order: editingCategory ? editingCategory.order : categorias.length + 1,
      subcategories: editingCategory ? editingCategory.subcategories : []
    }

    if (editingCategory) {
      // Editar categoria existente
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })
    } else {
      // Criar nova categoria
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })
    }
    reloadCategorias()
    setFormData({
      name: "",
      description: "",
      image: "",
      parentId: null,
      level: 0,
      display: {
        showFilters: true,
        showSorting: true,
        defaultSort: "relevance",
        itemsPerPage: 24,
        showPagination: true,
        showLoadMore: true
      },
      seo: {
        title: "",
        description: "",
        keywords: []
      }
    })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (categoria: any) => {
    setEditingCategory(categoria)
    setFormData({
      name: categoria.name,
      description: categoria.description,
      image: categoria.image,
      parentId: categoria.parentId || null,
      level: categoria.level || 0,
      display: categoria.display || {
        showFilters: true,
        showSorting: true,
        defaultSort: "relevance",
        itemsPerPage: 24,
        showPagination: true,
        showLoadMore: true
      },
      seo: categoria.seo || {
        title: "",
        description: "",
        keywords: []
      }
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria e todas as suas subcategorias?")) {
      await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      reloadCategorias()
    }
  }

  const toggleActive = (id: string) => {
    setCategorias(categorias.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat)))
  }

  const handleAddSubcategory = (parentId: string, parentLevel: number) => {
    setEditingCategory(null)
    setFormData({
      name: "",
      description: "",
      image: "",
      parentId: parentId,
      level: parentLevel + 1,
      display: {
        showFilters: true,
        showSorting: true,
        defaultSort: "relevance",
        itemsPerPage: 24,
        showPagination: true,
        showLoadMore: true
      },
      seo: {
        title: "",
        description: "",
        keywords: []
      }
    })
    setIsDialogOpen(true)
  }

  // Função recursiva para renderizar categorias hierárquicas
  const renderCategoryRow = (categoria: any, level: number = 0) => {
    const indent = level * 20
    return (
      <TableRow key={categoria.id}>
        <TableCell>
          <div className="flex items-center space-x-2" style={{ paddingLeft: `${indent}px` }}>
            {categoria.level === 0 && (
              <Image
                src={categoria.image}
                alt={categoria.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            )}
            <div>
              <div className="font-medium">{categoria.name}</div>
              <div className="text-sm text-muted-foreground">{categoria.description}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{categoria.slug}</TableCell>
        <TableCell>{categoria.productCount}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {categoria.subcategories?.length || 0} subcategorias
            </Badge>
            <Badge variant="outline" className="text-xs">
              Nível {categoria.level}
            </Badge>
          </div>
        </TableCell>
        <TableCell>
          <Switch
            checked={categoria.isActive}
            onCheckedChange={() => toggleActive(categoria.id)}
          />
        </TableCell>
        <TableCell>{categoria.order}</TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(categoria)}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddSubcategory(categoria.id, categoria.level)}
            >
              + Subcategoria
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(categoria.id)}
              className="text-destructive"
            >
              Excluir
            </Button>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  // Função recursiva para renderizar todas as categorias e subcategorias
  const renderAllCategories = (categories: any[], level: number = 0) => {
    return categories.map(categoria => {
      const rows = [renderCategoryRow(categoria, level)]
      if (categoria.subcategories && categoria.subcategories.length > 0) {
        rows.push(...renderAllCategories(categoria.subcategories, level + 1))
      }
      return rows
    }).flat()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Organize seus produtos em categorias e configure filtros</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setFormData({
                  name: "",
                  description: "",
                  image: "",
                  parentId: null,
                  level: 0,
                  display: {
                    showFilters: true,
                    showSorting: true,
                    defaultSort: "relevance",
                    itemsPerPage: 24,
                    showPagination: true,
                    showLoadMore: true
                  },
                  seo: {
                    title: "",
                    description: "",
                    keywords: []
                  }
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Edite as informações da categoria" : "Crie uma nova categoria para seus produtos"}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="display">Exibição</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Vestidos"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da categoria..."
                  rows={3}
                />
              </div>
                {formData.level === 0 && (
              <div>
                <Label>Imagem da Categoria</Label>
                    <ImageUpload
                      value={formData.image}
                      onChange={(value) => setFormData({ ...formData, image: value })}
                      placeholder="Clique para fazer upload da imagem da categoria"
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="display" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Configurações de Exibição</Label>
                    <div className="space-y-4 mt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showFilters" className="text-sm">Mostrar Filtros</Label>
                        <Switch
                          id="showFilters"
                          checked={formData.display.showFilters}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              display: { ...formData.display, showFilters: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showSorting" className="text-sm">Mostrar Ordenação</Label>
                        <Switch
                          id="showSorting"
                          checked={formData.display.showSorting}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              display: { ...formData.display, showSorting: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showPagination" className="text-sm">Mostrar Paginação</Label>
                        <Switch
                          id="showPagination"
                          checked={formData.display.showPagination}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              display: { ...formData.display, showPagination: checked }
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showLoadMore" className="text-sm">Botão "Carregar Mais"</Label>
                        <Switch
                          id="showLoadMore"
                          checked={formData.display.showLoadMore}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              display: { ...formData.display, showLoadMore: checked }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Ordenação Padrão</Label>
                    <Select
                      value={formData.display.defaultSort}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          display: { ...formData.display, defaultSort: value }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Mais Relevantes</SelectItem>
                        <SelectItem value="price-asc">Menor Preço</SelectItem>
                        <SelectItem value="price-desc">Maior Preço</SelectItem>
                        <SelectItem value="newest">Mais Novos</SelectItem>
                        <SelectItem value="name">A-Z</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="mt-4">
                      <Label>Itens por Página</Label>
                      <Select
                        value={formData.display.itemsPerPage.toString()}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            display: { ...formData.display, itemsPerPage: parseInt(value) }
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 itens</SelectItem>
                          <SelectItem value="16">16 itens</SelectItem>
                          <SelectItem value="20">20 itens</SelectItem>
                          <SelectItem value="24">24 itens</SelectItem>
                          <SelectItem value="32">32 itens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">Título da Página</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seo.title}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, title: e.target.value }
                    })}
                    placeholder="Ex: Vestidos Femininos - Bella Store"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">Descrição SEO</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seo.description}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { ...formData.seo, description: e.target.value }
                    })}
                    placeholder="Descrição para SEO..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords">Palavras-chave (separadas por vírgula)</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seo.keywords.join(", ")}
                    onChange={(e) => setFormData({
                      ...formData,
                      seo: { 
                        ...formData.seo, 
                        keywords: e.target.value.split(",").map(k => k.trim()).filter(k => k)
                      }
                    })}
                    placeholder="Ex: vestidos, moda feminina, roupas"
                  />
              </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              <Button onClick={handleSave}>
                {editingCategory ? "Salvar Alterações" : "Criar Categoria"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias ({filteredCategorias.length})</CardTitle>
          <CardDescription>Gerencie suas categorias e configurações</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Subcategorias</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderAllCategories(filteredCategorias)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
