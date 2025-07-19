"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Eye, MoreHorizontal, CheckCircle, Clock, AlertCircle, Package, User, Settings, Store } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminNotificacoesPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [storeFilter, setStoreFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Erro ao carregar notificações')
      }
      
      const data = await response.json()
      if (data.success) {
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
      // Dados mock para demonstração
      const mockNotifications = [
        {
          id: 1,
          title: "Nova Loja Cadastrada",
          message: "A loja 'Fashion Boutique' foi cadastrada e aguarda aprovação",
          type: "store",
          status: "unread",
          priority: "high",
          storeId: 6,
          storeName: "Fashion Boutique",
          createdAt: "2024-01-20T10:30:00Z",
          readAt: null,
          data: {
            storeId: 6,
            storeName: "Fashion Boutique",
            ownerEmail: "maria@fashionboutique.com"
          }
        },
        {
          id: 2,
          title: "Pagamento Aprovado",
          message: "Pagamento do plano Pro foi aprovado para Bella Store Fashion",
          type: "payment",
          status: "read",
          priority: "medium",
          storeId: 1,
          storeName: "Bella Store Fashion",
          createdAt: "2024-01-19T14:20:00Z",
          readAt: "2024-01-19T15:30:00Z",
          data: {
            amount: 59.90,
            plan: "Pro",
            paymentMethod: "PIX"
          }
        },
        {
          id: 3,
          title: "Limite de Produtos Atingido",
          message: "A loja Moda Elegante atingiu 95% do limite de produtos do plano Start",
          type: "limit",
          status: "unread",
          priority: "medium",
          storeId: 2,
          storeName: "Moda Elegante",
          createdAt: "2024-01-18T09:15:00Z",
          readAt: null,
          data: {
            currentProducts: 475,
            limitProducts: 500,
            percentUsed: 95
          }
        },
        {
          id: 4,
          title: "Suporte Técnico Solicitado",
          message: "Cliente da Style Express solicitou suporte para upload de imagens",
          type: "support",
          status: "unread",
          priority: "high",
          storeId: 3,
          storeName: "Style Express",
          createdAt: "2024-01-17T16:45:00Z",
          readAt: null,
          data: {
            ticketId: 12345,
            issue: "Upload de imagens",
            clientEmail: "carlos@styleexpress.com"
          }
        },
        {
          id: 5,
          title: "Backup Completado",
          message: "Backup diário do sistema foi executado com sucesso",
          type: "system",
          status: "read",
          priority: "low",
          storeId: null,
          storeName: "Sistema",
          createdAt: "2024-01-17T02:00:00Z",
          readAt: "2024-01-17T08:30:00Z",
          data: {
            backupSize: "2.4 GB",
            duration: "12 minutos"
          }
        },
        {
          id: 6,
          title: "Novo Pedido Processado",
          message: "Pedido #12345 foi processado na loja Outlet Moda",
          type: "order",
          status: "read",
          priority: "low",
          storeId: 5,
          storeName: "Outlet Moda",
          createdAt: "2024-01-16T11:20:00Z",
          readAt: "2024-01-16T14:15:00Z",
          data: {
            orderId: 12345,
            amount: 129.90,
            customer: "Beatriz Lima"
          }
        }
      ]
      setNotifications(mockNotifications)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: 'Marcada como lida',
          description: 'Notificação marcada como lida.'
        })
        fetchNotifications()
      } else {
        throw new Error('Erro ao marcar como lida')
      }
    } catch (error) {
      toast({
        title: 'Marcada como lida',
        description: 'Notificação marcada como lida (local).',
      })
      // Atualizar localmente
      setNotifications(prev => prev.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'read', readAt: new Date().toISOString() }
          : n
      ))
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => n.status === 'unread').map(n => n.id)
      
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: unreadIds })
      })

      if (response.ok) {
        toast({
          title: 'Todas marcadas como lidas',
          description: 'Todas as notificações foram marcadas como lidas.'
        })
        fetchNotifications()
      }
    } catch (error) {
      toast({
        title: 'Todas marcadas como lidas',
        description: 'Todas as notificações foram marcadas como lidas (local).',
      })
      // Atualizar localmente
      setNotifications(prev => prev.map(n => 
        n.status === 'unread' 
          ? { ...n, status: 'read', readAt: new Date().toISOString() }
          : n
      ))
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "store": return Store
      case "payment": return CheckCircle
      case "limit": return AlertCircle
      case "support": return User
      case "system": return Settings
      case "order": return Package
      default: return Bell
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "store": return "bg-blue-100 text-blue-800"
      case "payment": return "bg-green-100 text-green-800"
      case "limit": return "bg-yellow-100 text-yellow-800"
      case "support": return "bg-red-100 text-red-800"
      case "system": return "bg-purple-100 text-purple-800"
      case "order": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "store": return "Loja"
      case "payment": return "Pagamento"
      case "limit": return "Limite"
      case "support": return "Suporte"
      case "system": return "Sistema"
      case "order": return "Pedido"
      default: return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notification.storeName && notification.storeName.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesStore = storeFilter === "all" || 
                        (notification.storeId && notification.storeId.toString() === storeFilter)
    
    return matchesSearch && matchesType && matchesStatus && matchesStore
  })

  const uniqueStores = [...new Set(notifications
    .filter(n => n.storeId)
    .map(n => ({ id: n.storeId, name: n.storeName })))]

  const unreadCount = notifications.filter(n => n.status === 'unread').length

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
          <h1 className="text-3xl font-bold">Notificações do Sistema</h1>
          <p className="text-muted-foreground">
            Gerencie todas as notificações da plataforma
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} não lidas
              </Badge>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Todas como Lidas
          </Button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar por título, mensagem ou loja..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-80"
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="store">Lojas</SelectItem>
            <SelectItem value="payment">Pagamentos</SelectItem>
            <SelectItem value="limit">Limites</SelectItem>
            <SelectItem value="support">Suporte</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
            <SelectItem value="order">Pedidos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="unread">Não lidas</SelectItem>
            <SelectItem value="read">Lidas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={storeFilter} onValueChange={setStoreFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as lojas</SelectItem>
            {uniqueStores.map((store) => (
              <SelectItem key={store.id} value={store.id.toString()}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Não Lidas</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alta Prioridade</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.priority === 'high').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => 
                    new Date(n.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Notificações */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notificações</CardTitle>
          <CardDescription>
            {filteredNotifications.length} notificação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type)
              
              return (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <Badge variant="outline" className={getTypeColor(notification.type)}>
                            {getTypeLabel(notification.type)}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {notification.status === 'unread' && (
                            <Badge variant="destructive">Nova</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{new Date(notification.createdAt).toLocaleString('pt-BR')}</span>
                          {notification.storeName && (
                            <span className="flex items-center space-x-1">
                              <Store className="h-3 w-3" />
                              <span>{notification.storeName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.status === 'unread' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como lida
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedNotification(notification)
                              setIsDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          {notification.status === 'unread' && (
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marcar como lida
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma notificação encontrada</h3>
                <p className="text-muted-foreground">
                  Não há notificações que correspondam aos filtros selecionados.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Notificação</DialogTitle>
            <DialogDescription>
              Informações completas da notificação
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedNotification.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedNotification.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Tipo</h4>
                  <Badge variant="outline" className={getTypeColor(selectedNotification.type)}>
                    {getTypeLabel(selectedNotification.type)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prioridade</h4>
                  <Badge className={getPriorityColor(selectedNotification.priority)}>
                    {selectedNotification.priority}
                  </Badge>
                </div>
              </div>

              {selectedNotification.data && (
                <div>
                  <h4 className="font-medium mb-2">Dados Adicionais</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <pre>{JSON.stringify(selectedNotification.data, null, 2)}</pre>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Criada em:</span>
                  <div className="font-medium">
                    {new Date(selectedNotification.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Lida em:</span>
                  <div className="font-medium">
                    {selectedNotification.readAt ? 
                      new Date(selectedNotification.readAt).toLocaleString('pt-BR') : 
                      'Não lida'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 