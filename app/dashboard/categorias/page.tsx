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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, Upload, Settings, Filter, Eye, Pencil } from "lucide-react"
import Image from "next/image"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "@/components/ui/use-toast"

// Função utilitária para pegar storeId do usuário logado
const getUserStoreId = () => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.storeId || 1
  }
  return 1
}

// Adicionar detecção de mobile
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

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
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [saving, setSaving] = useState(false)

  // Carregar categorias da API ao montar
  useEffect(() => {
    const storeId = getUserStoreId()
    fetch(`/api/categories?storeId=${storeId}`)
      .then(res => res.json())
      .then(data => setCategorias(data))
  }, [])

  const reloadCategorias = () => {
    const storeId = getUserStoreId()
    fetch(`/api/categories?storeId=${storeId}`)
      .then(res => res.json())
      .then(data => setCategorias(data))
  }

  const filteredCategorias = categorias.filter((categoria: any) =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const paginatedCategorias = filteredCategorias.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredCategorias.length / itemsPerPage)

  const handleSave = async () => {
    setSaving(true)
    try {
      const storeId = getUserStoreId()
      const newCategory = {
        id: editingCategory ? editingCategory.id : undefined,
        ...formData,
        storeId: storeId, // Sempre incluir storeId
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        image: formData.image && formData.image !== '' ? formData.image : "/placeholder.svg?height=80&width=80",
        productCount: editingCategory ? editingCategory.productCount : 0,
        isActive: editingCategory ? editingCategory.isActive : true,
        order: editingCategory ? editingCategory.order : categorias.length + 1,
        subcategories: editingCategory ? editingCategory.subcategories : []
      }
      
      if (editingCategory) {
        await fetch('/api/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategory)
        })
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategory)
        })
      }
      await reloadCategorias() // Garante atualização imediata
      setFormData((prev: any) => ({
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
      }))
      setEditingCategory(null)
      setIsDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (categoria: any) => {
    setEditingCategory(categoria)
    setFormData((prev: any) => ({
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
    }))
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria e todas as suas subcategorias?")) {
      const storeId = getUserStoreId()
      await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, storeId })
      })
      reloadCategorias()
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const storeId = getUserStoreId()
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, storeId, isActive: !currentStatus })
      })
      reloadCategorias()
    } catch (error) {
      console.error('Erro ao atualizar status da categoria:', error)
    }
  }

  const handleAddSubcategory = (parentId: string, parentLevel: number) => {
    setEditingCategory(null)
    setFormData((prev: any) => ({
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
    }))
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
                src={categoria.image && categoria.image.trim() !== '' ? categoria.image : '/placeholder.svg'}
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
        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{categoria.slug}</TableCell>
        <TableCell className="hidden sm:table-cell">{categoria.productCount}</TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">{categoria.subcategories?.length || 0} subcategorias</Badge>
            <Badge variant="outline" className="text-xs">Nível {categoria.level}</Badge>
          </div>
        </TableCell>
        <TableCell>
          <Switch checked={categoria.isActive} onCheckedChange={() => toggleActive(categoria.id, categoria.isActive)} />
        </TableCell>
        <TableCell className="hidden md:table-cell">{categoria.order}</TableCell>
        <TableCell className="text-right">
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
    <div className="w-full min-w-0 p-4">
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
                setFormData((prev: any) => ({
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
                }))
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-full w-full sm:max-w-2xl p-4 sm:p-6">
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
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Vestidos"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da categoria..."
                  rows={3}
                />
              </div>
                {formData.level === 0 && (
              <div>
                <Label>Imagem da Categoria</Label>
                    <ImageUpload
                      value={formData.image}
                      onChange={url => {
                        setFormData((prev: any) => ({ ...prev, image: url }))
                      }}
                      placeholder="Clique para fazer upload"
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
                            setFormData((prev: any) => ({
                              ...prev,
                              display: { ...prev.display, showFilters: checked }
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showSorting" className="text-sm">Mostrar Ordenação</Label>
                        <Switch
                          id="showSorting"
                          checked={formData.display.showSorting}
                          onCheckedChange={(checked) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              display: { ...prev.display, showSorting: checked }
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showPagination" className="text-sm">Mostrar Paginação</Label>
                        <Switch
                          id="showPagination"
                          checked={formData.display.showPagination}
                          onCheckedChange={(checked) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              display: { ...prev.display, showPagination: checked }
                            }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="showLoadMore" className="text-sm">Botão "Carregar Mais"</Label>
                        <Switch
                          id="showLoadMore"
                          checked={formData.display.showLoadMore}
                          onCheckedChange={(checked) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              display: { ...prev.display, showLoadMore: checked }
                            }))
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
                        setFormData((prev: any) => ({
                          ...prev,
                          display: { ...prev.display, defaultSort: value }
                        }))
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
                          setFormData((prev: any) => ({
                            ...prev,
                            display: { ...prev.display, itemsPerPage: parseInt(value) }
                          }))
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
                    onChange={(e) => setFormData((prev: any) => ({
                      ...prev,
                      seo: { ...prev.seo, title: e.target.value }
                    }))}
                    placeholder="Ex: Vestidos Femininos - Bella Store"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">Descrição SEO</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seo.description}
                    onChange={(e) => setFormData((prev: any) => ({
                      ...prev,
                      seo: { ...prev.seo, description: e.target.value }
                    }))}
                    placeholder="Descrição para SEO..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="seoKeywords">Palavras-chave (separadas por vírgula)</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seo.keywords.join(", ")}
                    onChange={(e) => setFormData((prev: any) => ({
                      ...prev,
                      seo: { 
                        ...prev.seo, 
                        keywords: e.target.value.split(",").map(k => k.trim()).filter(k => k)
                      }
                    }))}
                    placeholder="Ex: vestidos, moda feminina, roupas"
                  />
              </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 py-3 text-base">Cancelar</Button>
              <Button onClick={() => { handleSave(); }} disabled={saving} className="flex-1 py-3 text-base">{saving ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                editingCategory ? 'Salvar Alterações' : 'Criar Categoria'
              )}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Input placeholder="Buscar categoria..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
      </div>

      {isMobile ? (
        <div className="flex flex-col gap-3 mt-4">
          {paginatedCategorias.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white shadow-sm">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={cat.image && cat.image.trim() !== '' ? cat.image : '/placeholder.svg'} alt={cat.name} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{cat.isActive ? 'ativo' : 'inativo'}</span>
                  <span className="text-xs text-muted-foreground">{cat.id}</span>
                </div>
                <div className="font-semibold truncate text-base">{cat.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5">{cat.productCount || 0} produtos</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 ml-2 items-end">
                <Switch checked={cat.isActive} onCheckedChange={checked => {/* lógica para ativar/desativar categoria */}} />
                <Button size="icon" variant="outline" className="w-8 h-8" onClick={() => handleEdit(cat)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="w-8 h-8" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          <div className="flex justify-center gap-2 mt-4">
            <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
            <span className="text-sm font-medium">Página {currentPage} de {totalPages}</span>
            <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Próxima</Button>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Categorias ({filteredCategorias.length})</CardTitle>
            <CardDescription>Gerencie suas categorias e configurações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto w-full rounded-lg border border-gray-200 bg-white shadow-sm mb-4">
              <Table className="min-w-[350px] sm:min-w-[700px] md:min-w-[900px] w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead className="hidden sm:table-cell">Produtos</TableHead>
                    <TableHead className="hidden md:table-cell">Subcategorias</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Ordem</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renderAllCategories(filteredCategorias)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="flex justify-end gap-2 mt-4">
        <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
        <span className="text-sm font-medium">Página {currentPage} de {totalPages}</span>
        <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Próxima</Button>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:space-x-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>
    </div>
  )
}
