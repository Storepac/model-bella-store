"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SidebarProvider } from "@/components/ui/sidebar"

const mobileMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Pedidos", url: "/dashboard/pedidos", icon: Package },
  { title: "Produtos", url: "/dashboard/produtos", icon: Package },
  { title: "Categorias", url: "/dashboard/categorias", icon: Tag },
  { title: "Kits e Combos", url: "/dashboard/kits", icon: Gift },
  { title: "Clientes", url: "/dashboard/clientes", icon: Users },
  { title: "Relatórios", url: "/dashboard/relatorios", icon: TrendingUp },
  { title: "Aparência", url: "/dashboard/aparencia", icon: Palette },
  { title: "Banners", url: "/dashboard/banners", icon: ImageIcon },
  { title: "Notificações", url: "/dashboard/notificacoes", icon: Bell },
  { title: "Configurações", url: "/dashboard/configuracoes", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DashboardSidebar />
        <div className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 bg-transparent md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <div className="border-b p-4">
                  <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-600">
                      <Store className="h-5 w-5 text-white" />
                    </div>
                    <span>Bella Store</span>
                  </Link>
                </div>
                <nav className="grid gap-2 p-4 text-base font-medium">
                  {mobileMenuItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1" />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notificações</span>
            </Button>
          </header>
          <main className="flex flex-1 flex-col gap-4 overflow-auto p-4 lg:gap-6 lg:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
