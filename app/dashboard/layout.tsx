"use client"

import type React from "react"
import DashboardSidebar from "@/components/dashboard/sidebar"
import {
  Bell,
  Home,
  Package,
  Users,
  Store,
  Settings,
  Palette,
  ImageIcon,
  Gift,
  Tag,
  TrendingUp,
  Menu,
  LogOut,
  BarChart3,
  Moon,
  Sun,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

// Menu items organizados por grupos como no sidebar desktop
const mobileMenuGroups = [
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState('')
  const [isAdminMaster, setIsAdminMaster] = useState(false)
  const [planInfo, setPlanInfo] = useState<any>(null)
  const [planLoading, setPlanLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

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

      // Carregar preferência de modo escuro
      const savedDarkMode = localStorage.getItem('darkMode')
      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode))
      }
    }
  }, [])

  useEffect(() => {
    // Aplicar modo escuro
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
    }
  }, [darkMode])

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
    // Adicionar listener para atualizar plano/limite quando produtos mudarem
    const handler = () => fetchPlan()
    window.addEventListener('productsChanged', handler)
    return () => window.removeEventListener('productsChanged', handler)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      window.location.href = '/login'
    }
  }

  // Menu items para Admin Master
  const adminMasterItems = [
    { title: "Visão Geral", url: "/dashboard", icon: BarChart3 },
    { title: "Relatórios", url: "/dashboard/relatorios", icon: TrendingUp },
    { title: "Notificações", url: "/dashboard/notificacoes", icon: Bell },
    { title: "Clientes", url: "/dashboard/clientes", icon: Users },
    { title: "Solicitações Pendentes", url: "/dashboard/solicitacoes", icon: Package },
    { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white dark:bg-gray-900 dark:border-gray-800 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 bg-transparent md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0 w-80">
                {/* Header do Mobile Sidebar */}
                <div className="border-b p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-600">
                      <Store className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{userName}</h2>
                      <p className="text-xs text-muted-foreground">Dashboard</p>
                    </div>
                  </div>
                </div>

                {/* Informações do Plano - Mobile */}
                <div className="px-4 py-3 border-b">
                  {!planLoading && planInfo && (
                    <div className="text-xs text-gray-700 bg-gray-100 rounded p-3">
                      <div className="font-semibold mb-1">Plano: {planInfo.plano}</div>
                      <div className="space-y-1">
                        <div><b>Produtos:</b> {planInfo.products.current} / {planInfo.products.limit} usados</div>
                        <div><b>Restantes:</b> {planInfo.products.remaining}</div>
                      </div>
                    </div>
                  )}
                  {!planLoading && !planInfo && (
                    <div className="text-xs text-red-600 bg-red-50 rounded p-3">
                      Não foi possível carregar informações do plano.
                    </div>
                  )}
                </div>

                {/* Menu de Navegação - Mobile */}
                <nav className="flex-1 overflow-y-auto p-4">
                  {isAdminMaster ? (
                    // Menu para Admin Master
                    <div className="space-y-4">
                      {adminMasterItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.url}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-gray-100"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    // Menu normal organizado por grupos
                    <div className="space-y-6">
                      {mobileMenuGroups.map((group) => (
                        <div key={group.title}>
                          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
                            {group.title}
                          </h3>
                          <div className="space-y-1">
                            {group.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.url}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-gray-100"
                              >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </nav>

                {/* Footer com botões - Mobile */}
                <div className="border-t p-4 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start bg-transparent"
                    onClick={() => {
                      // Pegar storeId do usuário logado
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
                      window.open(`/?store=${storeId}`, '_blank')
                    }}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Ver Loja
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1" />
            
            {/* Botão de Modo Escuro */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={toggleDarkMode}
              title={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">
                {darkMode ? "Ativar modo claro" : "Ativar modo escuro"}
              </span>
            </Button>

            {/* Botão de Notificações */}
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificações</span>
            </Button>
          </header>
          <main className="flex-1 flex flex-col gap-4 overflow-x-auto w-full p-4 lg:gap-6 lg:p-6 min-w-0 bg-gray-50 dark:bg-gray-900">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
