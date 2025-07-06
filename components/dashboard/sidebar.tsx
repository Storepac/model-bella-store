"use client"

import {
  BarChart3,
  Package,
  Palette,
  Settings,
  Store,
  Tag,
  Users,
  ImageIcon,
  Gift,
  TrendingUp,
  Bell,
  LogOut,
  Home,
} from "lucide-react"
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: "Visão Geral",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
      { title: "Relatórios", url: "/dashboard/relatorios", icon: TrendingUp },
      { title: "Notificações", url: "/dashboard/notificacoes", icon: Bell },
    ],
  },
  {
    title: "Produtos",
    items: [
      { title: "Produtos", url: "/dashboard/produtos", icon: Package },
      { title: "Categorias", url: "/dashboard/categorias", icon: Tag },
      { title: "Kits e Combos", url: "/dashboard/kits", icon: Gift },
    ],
  },
  {
    title: "Personalização",
    items: [
      { title: "Aparência", url: "/dashboard/aparencia", icon: Palette },
      { title: "Banners", url: "/dashboard/banners", icon: ImageIcon },
    ],
  },
  {
    title: "Loja",
    items: [
      { title: "Pedidos", url: "/dashboard/pedidos", icon: Package },
      { title: "Informações", url: "/dashboard/loja", icon: Store },
      { title: "Cupons", url: "/dashboard/cupons", icon: Tag },
      { title: "Clientes", url: "/dashboard/clientes", icon: Users },
    ],
  },
  {
    title: "Configurações",
    items: [{ title: "Configurações", url: "/dashboard/configuracoes", icon: Settings }],
  },
]

export default function DashboardSidebar() {
  const [isAdminMaster, setIsAdminMaster] = useState(false)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [planLoading, setPlanLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          if (user.email === 'admin@bella.com') {
            setIsAdminMaster(true)
            setUserName('Admin Master')
          } else {
            setUserName(user.name || user.email || 'Usuário')
          }
        } catch {}
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const fetchPlan = async () => {
      setPlanLoading(true)
      try {
        let storeId = 1;
        if (typeof window !== 'undefined') {
          const userStr = localStorage.getItem('user')
          if (userStr) {
            try {
              const user = JSON.parse(userStr)
              if (user.storeId) {
                storeId = user.storeId
              }
            } catch {}
          }
        }
        const res = await fetch(`/api/store-limits?storeId=${storeId}`)
        const data = await res.json()
        if (data.success) {
          setPlanInfo(data.data)
        }
      } catch (err) {
        setPlanInfo(null)
      } finally {
        setPlanLoading(false)
      }
    }
    fetchPlan()
  }, [])

  if (isLoading) {
    return null // ou um loader se preferir
  }

  if (isAdminMaster) {
    const handleLogout = () => {
      if (typeof window !== 'undefined') {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return (
      <aside className="w-56 bg-gray-100 border-r flex flex-col">
        <div className="font-bold text-lg p-4 border-b">Admin Master</div>
        <nav className="flex-1 flex flex-col gap-1 p-2">
          <a href="/dashboard" className="px-4 py-2 rounded hover:bg-gray-200">Visão Geral</a>
          <a href="/dashboard/relatorios" className="px-4 py-2 rounded hover:bg-gray-200">Relatórios</a>
          <a href="/dashboard/notificacoes" className="px-4 py-2 rounded hover:bg-gray-200">Notificações</a>
          <a href="/dashboard/clientes" className="px-4 py-2 rounded hover:bg-gray-200">Clientes</a>
          <a href="/dashboard/solicitacoes" className="px-4 py-2 rounded hover:bg-gray-200">Solicitações Pendentes</a>
          <a href="/dashboard/configuracoes" className="px-4 py-2 rounded hover:bg-gray-200">Configurações</a>
        </nav>
        <button onClick={handleLogout} className="m-4 px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 font-semibold">Sair</button>
      </aside>
    )
  }

  return (
    <UISidebar className="hidden border-r md:block">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-600">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      {/* Bloco separado para plano/limite */}
      <div className="px-4">
        {!planLoading && planInfo && (
          <div className="mt-2 mb-2 text-xs text-gray-700 bg-gray-100 rounded p-2">
            <div><b>Plano:</b> {planInfo.plano}</div>
            <div><b>Produtos:</b> {planInfo.products.current} / {planInfo.products.limit} usados</div>
            <div><b>Restantes:</b> {planInfo.products.remaining}</div>
          </div>
        )}
        {!planLoading && !planInfo && (
          <div className="mt-2 mb-2 text-xs text-red-600 bg-red-50 rounded p-2">
            Não foi possível carregar informações do plano.
          </div>
        )}
      </div>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start bg-transparent"
            onClick={() => window.open('/', '_blank')}
          >
            <Home className="mr-2 h-4 w-4" />
            Ver Loja
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-red-600 hover:text-red-700"
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </UISidebar>
  )
}
