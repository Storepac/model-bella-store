"use client"

import { useState, useEffect } from "react"
import { MoreHorizontal, File, Eye, Edit, Trash2, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

// Função utilitária para pegar storeId do usuário logado
const getUserStoreId = () => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.storeId || 1
  }
  return 1
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary"
    case "confirmed":
      return "default"
    case "processing":
      return "default"
    case "shipped":
      return "outline"
    case "delivered":
      return "outline"
    case "cancelled":
      return "destructive"
    default:
      return "default"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Pendente"
    case "confirmed":
      return "Confirmado"
    case "processing":
      return "Processando"
    case "shipped":
      return "Enviado"
    case "delivered":
      return "Entregue"
    case "cancelled":
      return "Cancelado"
    default:
      return status
  }
}

export default function PedidosPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const storeId = getUserStoreId()
      const response = await fetch(`/api/orders?storeId=${storeId}`)
      const data = await response.json()
      
      if (data.success) {
        setOrders(data.orders || [])
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Status atualizado',
          description: 'Status do pedido foi atualizado com sucesso.'
        })
        fetchOrders() // Recarregar lista
      } else {
        throw new Error(data.message || 'Erro ao atualizar status')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status do pedido.',
        variant: 'destructive'
      })
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
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
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie todos os pedidos da sua loja</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar por número, cliente ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-80"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="processing">Processando</SelectItem>
            <SelectItem value="shipped">Enviados</SelectItem>
            <SelectItem value="delivered">Entregues</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmados</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'confirmed').length}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">
                  R$ {orders.reduce((sum, order) => sum + (order.totalValue || 0), 0).toLocaleString()}
                </p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>
            {filteredOrders.length} pedido(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.clientName}</div>
                      <div className="text-sm text-muted-foreground">{order.clientEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          disabled={order.status === 'confirmed'}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Confirmar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          disabled={order.status === 'cancelled'}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancelar
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

      {/* Dialog de Detalhes do Pedido */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Informações completas do pedido
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <div>
                <h3 className="font-semibold mb-2">Informações do Cliente</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <div className="font-medium">{selectedOrder.clientName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <div className="font-medium">{selectedOrder.clientEmail}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <div className="font-medium">{selectedOrder.clientPhone}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="font-medium">
                      <Badge variant={getStatusVariant(selectedOrder.status)}>
                        {getStatusLabel(selectedOrder.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="font-semibold mb-2">Endereço de Entrega</h3>
                  <div className="text-sm">
                    <div>{selectedOrder.shippingAddress.street}</div>
                    <div>{selectedOrder.shippingAddress.neighborhood}</div>
                    <div>{selectedOrder.shippingAddress.city}/{selectedOrder.shippingAddress.state}</div>
                    <div>CEP: {selectedOrder.shippingAddress.zipCode}</div>
                  </div>
                </div>
              )}

              {/* Items do Pedido */}
              <div>
                <h3 className="font-semibold mb-2">Items do Pedido</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">{item.price}</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t font-bold">
                  <span>Total:</span>
                  <span>{selectedOrder.total}</span>
                </div>
              </div>

              {/* Observações */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Observações</h3>
                  <div className="text-sm">{selectedOrder.notes}</div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
