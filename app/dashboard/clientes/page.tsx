"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Eye, MessageSquare, Users, ShoppingBag, Calendar, Star } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

const statusConfig = {
  new: { label: "Novo", color: "bg-blue-100 text-blue-800" },
  active: { label: "Ativo", color: "bg-green-100 text-green-800" },
  vip: { label: "VIP", color: "bg-purple-100 text-purple-800" },
  inactive: { label: "Inativo", color: "bg-gray-100 text-gray-800" },
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCliente, setSelectedCliente] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/clients')
        const data = await res.json()
        setClientes(data.clients || [])
      } catch (err) {
        setClientes([])
      } finally {
        setLoading(false)
      }
    }
    fetchClientes()
  }, [])

  const filteredClientes = clientes.filter((cliente) => {
    const matchesSearch =
      cliente.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.phone.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || cliente.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sendWhatsApp = (cliente: any) => {
    const message = `Olá ${cliente.name}! 👋

Tudo bem? Sou da *Bella Store* e queria agradecer por ser nossa cliente! 

🛍️ Temos novidades incríveis que você vai amar! Que tal dar uma olhadinha na nossa nova coleção?

Qualquer dúvida, estou aqui para ajudar! 😊`

    const whatsappUrl = `https://wa.me/55${cliente.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gerencie sua base de clientes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold">{clientes.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes VIP</p>
                <p className="text-2xl font-bold text-purple-600">
                  {clientes.filter((c) => c.status === "vip").length}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  R$ {(clientes.reduce((sum, c) => sum + c.averageTicket, 0) / clientes.length).toFixed(2)}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos (30 dias)</p>
                <p className="text-2xl font-bold text-blue-600">{clientes.filter((c) => c.status === "new").length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:gap-4 w-full mb-4">
            <Input className="w-full" placeholder="Buscar por nome, email ou telefone..." />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-white"
            >
              <option value="all">Todos os Status</option>
              {Object.entries(statusConfig).map(([status, config]) => (
                <option key={status} value={status}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Clientes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>{filteredClientes.length} cliente(s) encontrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full rounded-lg border border-gray-200 bg-white shadow-sm">
            <Table className="min-w-[700px] w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Total Gasto</TableHead>
                  <TableHead>Último Pedido</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cliente.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Cliente desde {new Date(cliente.firstOrder).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{cliente.email}</p>
                        <p className="text-sm text-muted-foreground">{cliente.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cliente.totalOrders} pedidos</p>
                        <p className="text-sm text-muted-foreground">
                          Ticket médio: R$ {cliente.averageTicket.toFixed(2)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">R$ {cliente.totalSpent.toFixed(2)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{new Date(cliente.lastOrder).toLocaleDateString("pt-BR")}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(cliente.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCliente(cliente)
                              setIsDetailOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => sendWhatsApp(cliente)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Enviar WhatsApp
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

      {/* Detalhes do Cliente */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-full w-full sm:max-w-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>Informações completas do cliente</DialogDescription>
          </DialogHeader>

          {selectedCliente && (
            <div className="space-y-6 py-4 max-h-[80vh] overflow-y-auto">
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{selectedCliente.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail</p>
                      <p className="font-medium">{selectedCliente.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{selectedCliente.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      {getStatusBadge(selectedCliente.status)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estatísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                      <p className="font-medium">{selectedCliente.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Gasto</p>
                      <p className="font-medium">R$ {selectedCliente.totalSpent.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ticket Médio</p>
                      <p className="font-medium">R$ {selectedCliente.averageTicket.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Primeiro Pedido</p>
                      <p className="font-medium">{new Date(selectedCliente.firstOrder).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Endereço */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Endereço</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p>{selectedCliente.address.street}</p>
                    <p>
                      {selectedCliente.address.neighborhood} - {selectedCliente.address.city}/
                      {selectedCliente.address.state}
                    </p>
                    <p>CEP: {selectedCliente.address.zipCode}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Histórico de Pedidos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Últimos Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCliente.orders.map((order: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                        <div>
                          <p className="font-medium">{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ {order.total.toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button onClick={() => { sendWhatsApp(selectedCliente); toast({ title: 'Mensagem enviada!', description: 'O WhatsApp foi aberto para contato com o cliente.', variant: 'success' }) }} className="flex-1 py-3 text-base">Enviar WhatsApp</Button>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)} className="flex-1 py-3 text-base">Fechar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Button className="w-full py-3 text-base md:w-auto md:py-2 mt-2 md:mt-0">Novo Cliente</Button>
    </div>
  )
}
