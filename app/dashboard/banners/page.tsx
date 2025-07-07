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
import { toast } from "@/components/ui/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [storeId, setStoreId] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    buttonText: "",
    position: "homepage-middle-1",
  })

  useEffect(() => {
    // Obter storeId do usuário logado
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          if (user.storeId) {
            setStoreId(user.storeId)
          }
        } catch {}
      }
    }
  }, [])

  useEffect(() => {
    fetchBanners()
  }, [storeId])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/banners?storeId=${storeId}`)
      const data = await res.json()
      setBanners(data.banners || [])
    } catch (err) {
      console.error('Erro ao carregar banners:', err)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...formData,
        storeId,
      }

      if (editingBanner) {
        // Atualizar banner existente
        const res = await fetch('/api/banners', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingBanner.id,
            ...payload,
          }),
        })

        if (!res.ok) {
          throw new Error('Erro ao atualizar banner')
        }

        toast({
          title: "Banner atualizado!",
          description: "O banner foi atualizado com sucesso.",
        })
      } else {
        // Criar novo banner
        const res = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          throw new Error('Erro ao criar banner')
        }

        toast({
          title: "Banner criado!",
          description: "O banner foi criado com sucesso.",
        })
      }

      // Recarregar banners
      await fetchBanners()
      
      // Limpar formulário
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
    } catch (error) {
      console.error('Erro ao salvar banner:', error)
      toast({
        title: "Erro!",
        description: "Não foi possível salvar o banner. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      description: banner.description || "",
      image: banner.image,
      link: banner.link,
      buttonText: banner.buttonText || "",
      position: banner.position || "homepage-middle-1",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      const res = await fetch('/api/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: deleteId,
          storeId,
        }),
      })

      if (!res.ok) {
        throw new Error('Erro ao deletar banner')
      }

      toast({
        title: "Banner excluído!",
        description: "O banner foi excluído com sucesso.",
      })

      // Recarregar banners
      await fetchBanners()
    } catch (error) {
      console.error('Erro ao deletar banner:', error)
      toast({
        title: "Erro!",
        description: "Não foi possível excluir o banner. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  const toggleActive = async (id: string) => {
    const banner = banners.find(b => b.id === id)
    if (!banner) return

    try {
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          isActive: !banner.isActive,
          storeId,
        }),
      })

      if (!res.ok) {
        throw new Error('Erro ao atualizar status do banner')
      }

      // Recarregar banners
      await fetchBanners()
      
      toast({
        title: banner.isActive ? "Banner desativado!" : "Banner ativado!",
        description: `O banner foi ${banner.isActive ? 'desativado' : 'ativado'} com sucesso.`,
      })
    } catch (error) {
      console.error('Erro ao alterar status do banner:', error)
      toast({
        title: "Erro!",
        description: "Não foi possível alterar o status do banner.",
        variant: "destructive",
      })
    }
  }

  const getPositionLabel = (position: string) => {
    return bannerPositions.find((p) => p.value === position)?.label || position
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando banners...</p>
        </div>
      </div>
    )
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
          <DialogContent className="max-w-full w-full sm:max-w-2xl p-4 sm:p-6">
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

              <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  className="flex-1 py-3 text-base"
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="flex-1 py-3 text-base"
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : (editingBanner ? "Salvar Alterações" : "Criar Banner")}
                </Button>
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
                <p className="text-2xl font-bold">{banners.filter(b => b.isActive).length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Banners Inativos</p>
                <p className="text-2xl font-bold">{banners.filter(b => !b.isActive).length}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posições Usadas</p>
                <p className="text-2xl font-bold">{new Set(banners.map(b => b.position)).size}</p>
              </div>
              <ImageIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Banners */}
      <Card>
        <CardHeader>
          <CardTitle>Banners Cadastrados</CardTitle>
          <CardDescription>Lista de todos os banners da sua loja</CardDescription>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum banner cadastrado</p>
              <p className="text-gray-400 text-sm">Clique em "Novo Banner" para criar o primeiro</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Posição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                        {banner.image ? (
                          <Image
                            src={banner.image}
                            alt={banner.title}
                            width={64}
                            height={40}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>{getPositionLabel(banner.position)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={banner.isActive ? "default" : "secondary"}
                        className={`cursor-pointer ${banner.isActive ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                        onClick={() => toggleActive(banner.id)}
                      >
                        {banner.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(banner)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeleteId(banner.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
