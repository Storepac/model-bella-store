"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Copy, Tag, Calendar, Percent, DollarSign } from "lucide-react"

// Mock data para cupons
const mockCupons = [
  {
    id: "1",
    code: "PRIMEIRA10",
    description: "10% de desconto na primeira compra",
    type: "percentage",
    value: 10,
    minValue: 100,
    maxUses: 100,
    currentUses: 45,
    expiresAt: "2024-12-31",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    code: "FRETE20",
    description: "R$ 20 de desconto no frete",
    type: "fixed",
    value: 20,
    minValue: 0,
    maxUses: 500,
    currentUses: 234,
    expiresAt: "2024-06-30",
    isActive: true,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    code: "DESCONTO15",
    description: "15% de desconto acima de R$ 150",
    type: "percentage",
    value: 15,
    minValue: 150,
    maxUses: 200,
    currentUses: 89,
    expiresAt: "2024-08-15",
    isActive: false,
    createdAt: "2024-01-20",
  },
]

export default function CuponsPage() {
  const [cupons, setCupons] = useState(mockCupons)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCupon, setEditingCupon] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    minValue: "",
    maxUses: "",
    expiresAt: "",
  })

  const filteredCupons = cupons.filter(
    (cupon) =>
      cupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cupon.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, code: result })
  }

  const handleSave = () => {
    if (editingCupon) {
      // Editar cupom existente
      setCupons(
        cupons.map((cupon) =>
          cupon.id === editingCupon.id
            ? {
                ...cupon,
                code: formData.code,
                description: formData.description,
                type: formData.type,
                value: Number.parseFloat(formData.value),
                minValue: Number.parseFloat(formData.minValue) || 0,
                maxUses: Number.parseInt(formData.maxUses) || 0,
                expiresAt: formData.expiresAt,
              }
            : cupon,
        ),
      )
    } else {
      // Criar novo cupom
      const newCupon = {
        id: Date.now().toString(),
        code: formData.code,
        description: formData.description,
        type: formData.type,
        value: Number.parseFloat(formData.value),
        minValue: Number.parseFloat(formData.minValue) || 0,
        maxUses: Number.parseInt(formData.maxUses) || 0,
        currentUses: 0,
        expiresAt: formData.expiresAt,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setCupons([...cupons, newCupon])
    }

    setFormData({
      code: "",
      description: "",
      type: "percentage",
      value: "",
      minValue: "",
      maxUses: "",
      expiresAt: "",
    })
    setEditingCupon(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (cupon: any) => {
    setEditingCupon(cupon)
    setFormData({
      code: cupon.code,
      description: cupon.description,
      type: cupon.type,
      value: cupon.value.toString(),
      minValue: cupon.minValue.toString(),
      maxUses: cupon.maxUses.toString(),
      expiresAt: cupon.expiresAt,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cupom?")) {
      setCupons(cupons.filter((cupon) => cupon.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setCupons(cupons.map((cupon) => (cupon.id === id ? { ...cupon, isActive: !cupon.isActive } : cupon)))
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert(`Código ${code} copiado!`)
  }

  const getStatusBadge = (cupon: any) => {
    const now = new Date()
    const expires = new Date(cupon.expiresAt)

    if (!cupon.isActive) {
      return <Badge variant="secondary">Inativo</Badge>
    }

    if (expires < now) {
      return <Badge variant="destructive">Expirado</Badge>
    }

    if (cupon.maxUses > 0 && cupon.currentUses >= cupon.maxUses) {
      return <Badge variant="destructive">Esgotado</Badge>
    }

    return (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Ativo
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Cupons de Desconto</h1>
          <p className="text-muted-foreground">Gerencie os cupons da sua loja</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCupon(null)
                setFormData({
                  code: "",
                  description: "",
                  type: "percentage",
                  value: "",
                  minValue: "",
                  maxUses: "",
                  expiresAt: "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCupon ? "Editar Cupom" : "Novo Cupom"}</DialogTitle>
              <DialogDescription>
                {editingCupon ? "Edite as informações do cupom" : "Crie um novo cupom de desconto"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código do Cupom</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="DESCONTO10"
                    />
                    <Button type="button" variant="outline" onClick={generateCode}>
                      Gerar
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Desconto</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border rounded-md bg-white"
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do cupom..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="value">Valor {formData.type === "percentage" ? "(%)" : "(R$)"}</Label>
                  <Input
                    id="value"
                    type="number"
                    step={formData.type === "percentage" ? "1" : "0.01"}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === "percentage" ? "10" : "20.00"}
                  />
                </div>

                <div>
                  <Label htmlFor="minValue">Valor Mínimo (R$)</Label>
                  <Input
                    id="minValue"
                    type="number"
                    step="0.01"
                    value={formData.minValue}
                    onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                    placeholder="100.00"
                  />
                </div>

                <div>
                  <Label htmlFor="maxUses">Limite de Uso</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expiresAt">Data de Expiração</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>{editingCupon ? "Salvar" : "Criar"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Cupons</p>
                <p className="text-2xl font-bold">{cupons.length}</p>
              </div>
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cupons Ativos</p>
                <p className="text-2xl font-bold text-green-600">{cupons.filter((c) => c.isActive).length}</p>
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
                <p className="text-sm text-muted-foreground">Total de Usos</p>
                <p className="text-2xl font-bold">{cupons.reduce((total, cupon) => total + cupon.currentUses, 0)}</p>
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
                <p className="text-sm text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold text-red-600">
                  {cupons.filter((c) => new Date(c.expiresAt) < new Date()).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-500 rounded-full"></div>
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
              placeholder="Buscar cupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cupons Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Cupons</CardTitle>
          <CardDescription>{filteredCupons.length} cupom(ns) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Uso</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCupons.map((cupon) => (
                  <TableRow key={cupon.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded">
                            {cupon.code}
                          </code>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(cupon.code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{cupon.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {cupon.type === "percentage" ? (
                          <Percent className="h-4 w-4 text-green-600" />
                        ) : (
                          <DollarSign className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="font-medium">
                          {cupon.type === "percentage" ? `${cupon.value}%` : `R$ ${cupon.value.toFixed(2)}`}
                        </span>
                      </div>
                      {cupon.minValue > 0 && (
                        <p className="text-xs text-muted-foreground">Mín: R$ {cupon.minValue.toFixed(2)}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {cupon.currentUses}
                          {cupon.maxUses > 0 && ` / ${cupon.maxUses}`}
                        </p>
                        {cupon.maxUses > 0 && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min((cupon.currentUses / cupon.maxUses) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(cupon.expiresAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => toggleActive(cupon.id)}>{getStatusBadge(cupon)}</button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyCode(cupon.code)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar Código
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(cupon)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(cupon.id)}>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
