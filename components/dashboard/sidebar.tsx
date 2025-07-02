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
  Sidebar,
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

export function DashboardSidebar() {
  return (
    <Sidebar className="hidden border-r md:block">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-600">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Bella Store</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

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
          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ver Loja
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Link>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
