"use client"

import { useState } from "react"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, Upload } from "lucide-react"
import Image from "next/image"

// Mock data para categorias
const mockCategorias = [
  {
    id: "1",
    name: "Vestidos",
    description: "Vestidos para todas as ocasiões",
    slug: "vestidos",
    image: "/placeholder.svg?height=80&width=80",
    productCount: 45,
    isActive: true,
    order: 1,
  },
  {
    id: "2",
    name: "Blusas",
    description: "Blusas casuais e sociais",
    slug: "blusas",
    image: "/placeholder.svg?height=80&width=80",
    productCount: 32,
    isActive: true,
    order: 2,
  },
  {
    id: "3",
    name: "Calças",
    description: "Calças jeans, sociais e leggings",
    slug: "calcas",
    image: "/placeholder.svg?height=80&width=80",
    productCount: 28,
    isActive: true,
    order: 3,
  },
  {
    id: "4",
    name: "Sapatos",
    description: "Calçados femininos variados",
    slug: "sapatos",
    image: "/placeholder.svg?height=80&width=80",
    productCount: 21,
    isActive: true,
    order: 4,
  },
  {
    id: "5",
    name: "Acessórios",
    description: "Bolsas, bijuterias e acessórios",
    slug: "acessorios",
    image: "/placeholder.svg?height=80&width=80",
    productCount: 15,
    isActive: false,
    order: 5,
  },
]

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState(mockCategorias)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  })

  const filteredCategorias = categorias.filter((categoria) =>
    categoria.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSave = () => {
    if (editingCategory) {
      // Editar categoria existente
      setCategorias(
        categorias.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
                slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
              }
            : cat,
        ),
      )
    } else {
      // Criar nova categoria
      const newCategory = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        image: "/placeholder.svg?height=80&width=80",
        productCount: 0,
        isActive: true,
        order: categorias.length + 1,
      }
      setCategorias([...categorias, newCategory])
    }

    setFormData({ name: "", description: "", image: "" })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (categoria: any) => {
    setEditingCategory(categoria)
    setFormData({
      name: categoria.name,
      description: categoria.description,
      image: categoria.image,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      setCategorias(categorias.filter((cat) => cat.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setCategorias(categorias.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat)))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">Organize seus produtos em categorias</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setFormData({ name: "", description: "", image: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Edite as informações da categoria" : "Crie uma nova categoria para seus produtos"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
              <div>
                <Label>Imagem da Categoria</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Clique para fazer upload</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Escolher Imagem
                  </Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>{editingCategory ? "Salvar" : "Criar"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Categorias</p>
                <p className="text-2xl font-bold">{categorias.length}</p>
              </div>
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categorias Ativas</p>
                <p className="text-2xl font-bold text-green-600">{categorias.filter((c) => c.isActive).length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Produtos</p>
                <p className="text-2xl font-bold">{categorias.reduce((total, cat) => total + cat.productCount, 0)}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar categorias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>{filteredCategorias.length} categoria(s) encontrada(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={categoria.image || "/placeholder.svg"}
                          alt={categoria.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{categoria.name}</p>
                        <p className="text-sm text-muted-foreground">/{categoria.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{categoria.description}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{categoria.productCount} produtos</Badge>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleActive(categoria.id)}>
                      <Badge
                        variant={categoria.isActive ? "default" : "secondary"}
                        className={categoria.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {categoria.isActive ? "Ativa" : "Inativa"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(categoria)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(categoria.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
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
