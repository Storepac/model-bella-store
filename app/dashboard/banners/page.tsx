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
import { Plus, Upload, MoreHorizontal, Edit, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"
import { bannerPositions } from "@/lib/banner-data"

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    buttonText: "",
    position: "homepage-middle-1",
  })

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/banners')
        const data = await res.json()
        setBanners(data.banners || [])
      } catch (err) {
        setBanners([])
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [])

  const handleSave = () => {
    if (editingBanner) {
      setBanners(
        banners.map((banner) =>
          banner.id === editingBanner.id
            ? {
                ...banner,
                ...formData,
              }
            : banner,
        ),
      )
    } else {
      const newBanner = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
      }
      setBanners([...banners, newBanner])
    }

    setFormData({
      title: "",
      description: "",
      image: "",
      link: "",
      buttonText: "",
      position: "homepage-middle-1",
    })
    setEditingBanner(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description || "",
      image: banner.image,
      link: banner.link,
      buttonText: banner.buttonText || "",
      position: banner.position,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este banner?")) {
      setBanners(banners.filter((banner) => banner.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setBanners(banners.map((banner) => (banner.id === id ? { ...banner, isActive: !banner.isActive } : banner)))
  }

  const getPositionLabel = (position: string) => {
    return bannerPositions.find((p) => p.value === position)?.label || position
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-muted-foreground">Gerencie os banners da sua loja</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBanner(null)
                setFormData({
                  title: "",
                  description: "",
                  image: "",
                  link: "",
                  buttonText: "",
                  position: "homepage-middle-1",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Editar Banner" : "Novo Banner"}</DialogTitle>
              <DialogDescription>
                {editingBanner ? "Edite as informações do banner" : "Crie um novo banner para sua loja"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Título do Banner</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Nova Coleção Verão"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Posição</Label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    {bannerPositions.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do banner..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Imagem do Banner</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Clique para fazer upload da imagem</p>
                  <p className="text-xs text-gray-500 mb-4">PNG ou JPG (URL da imagem por enquanto)</p>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://.../imagem.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="link">Link do Banner</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/categoria/vestidos"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonText">Texto do Botão (opcional)</Label>
                  <Input
                    id="buttonText"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Ver Coleção"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>{editingBanner ? "Salvar Alterações" : "Criar Banner"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Banners</p>
                <p className="text-2xl font-bold">{banners.length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Banners Ativos</p>
                <p className="text-2xl font-bold text-green-600">{banners.filter((b) => b.isActive).length}</p>
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
                <p className="text-sm text-muted-foreground">Header</p>
                <p className="text-2xl font-bold">{banners.filter((b) => b.position === "header").length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outros</p>
                <p className="text-2xl font-bold">{banners.filter((b) => b.position !== "header").length}</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Banners Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Banners</CardTitle>
          <CardDescription>Gerencie todos os banners da sua loja</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Posição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative w-24 h-12 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={banner.image || "/placeholder.svg"}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{banner.title}</p>
                        <p className="text-sm text-muted-foreground">{banner.link}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getPositionLabel(banner.position)}</Badge>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleActive(banner.id)}>
                      <Badge
                        variant={banner.isActive ? "default" : "secondary"}
                        className={banner.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {banner.isActive ? "Ativo" : "Inativo"}
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
                        <DropdownMenuItem onClick={() => handleEdit(banner)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(banner.id)}>
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
