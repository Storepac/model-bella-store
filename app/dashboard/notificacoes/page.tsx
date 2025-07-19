"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, Send, Bell, Eye, MoreHorizontal, Trash2, CheckCircle, Clock, AlertCircle, Package, User, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Função utilitária para pegar storeId do usuário logado
const getUserStoreId = () => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.storeId || 1
  }
  return 1
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "order": return Package
    case "product": return Package
    case "customer": return User
    case "system": return Settings
    case "promotion": return Bell
    default: return Bell
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "order": return "bg-blue-100 text-blue-800"
    case "product": return "bg-yellow-100 text-yellow-800"
    case "customer": return "bg-green-100 text-green-800"
    case "system": return "bg-purple-100 text-purple-800"
    case "promotion": return "bg-orange-100 text-orange-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800"
    case "high": return "bg-orange-100 text-orange-800"
    case "medium": return "bg-yellow-100 text-yellow-800"
    case "low": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "read": return CheckCircle
    case "unread": return Clock
    case "archived": return Eye
    default: return Bell
  }
}

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "system",
    priority: "medium",
    data: {}
  })

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const storeId = getUserStoreId()
      const response = await fetch(`/api/notifications?storeId=${storeId}&limit=100`)
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications || [])
      } else {
        setNotifications([])
      }
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha título e mensagem.',
        variant: 'destructive'
      })
      return
    }

    setSending(true)
    try {
      const storeId = getUserStoreId()
      const payload = {
        ...formData,
        storeId
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Notificação enviada',
          description: 'Notificação criada com sucesso.'
        })
        setIsDialogOpen(false)
        resetForm()
        fetchNotifications()
      } else {
        throw new Error(data.message || 'Erro ao enviar notificação')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao enviar notificação.',
        variant: 'destructive'
      })
    } finally {
      setSending(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}&action=mark-read`, {
        method: 'PATCH'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Marcada como lida',
          description: 'Notificação marcada como lida.'
        })
        fetchNotifications()
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar notificação.',
        variant: 'destructive'
      })
    }
  }

  const deleteNotification = async (notificationId: number) => {
    if (!confirm('Tem certeza que deseja excluir esta notificação?')) return

    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Notificação excluída',
          description: 'Notificação excluída com sucesso.'
        })
        fetchNotifications()
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir notificação.',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "system",
      priority: "medium",
      data: {}
    })
    setSelectedFile(null)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus = statusFilter === "all" || notification.status === statusFilter
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter
    
    return matchesType && matchesStatus && matchesPriority
  })

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
          <h1 className="text-3xl font-bold">Notificações</h1>
          <p className="text-muted-foreground">
            Gerencie notificações e comunicações da sua loja
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} não lidas
              </Badge>
            )}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Send className="h-4 w-4 mr-2" />
              Nova Notificação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Notificação</DialogTitle>
              <DialogDescription>
                Crie uma nova notificação para o sistema
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Título da notificação"
                />
              </div>

              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Conteúdo da notificação..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Pedido</SelectItem>
                      <SelectItem value="product">Produto</SelectItem>
                      <SelectItem value="customer">Cliente</SelectItem>
                      <SelectItem value="promotion">Promoção</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendNotification} disabled={sending}>
                  {sending ? 'Enviando...' : 'Enviar Notificação'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="order">Pedidos</SelectItem>
            <SelectItem value="product">Produtos</SelectItem>
            <SelectItem value="customer">Clientes</SelectItem>
            <SelectItem value="promotion">Promoções</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
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
            <SelectItem value="archived">Arquivadas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as prioridades</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
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
                <p className="text-sm text-muted-foreground">Lidas</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'read').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgentes</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.priority === 'urgent').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
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
              const StatusIcon = getStatusIcon(notification.status)
              
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
                          <h3 className="font-semibold text-lg">{notification.title}</h3>
                          <Badge variant="outline" className={getTypeColor(notification.type)}>
                            {notification.type}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{new Date(notification.createdAt).toLocaleString('pt-BR')}</span>
                          <div className="flex items-center space-x-1">
                            <StatusIcon className="h-3 w-3" />
                            <span>{notification.status === 'unread' ? 'Não lida' : 'Lida'}</span>
                          </div>
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
                          {notification.status === 'unread' && (
                            <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marcar como lida
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
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
    </div>
  )
}
