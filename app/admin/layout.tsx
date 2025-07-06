'use client'

import type React from 'react'
import Link from 'next/link'
import { Home, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      window.location.href = '/login'
    }
  }
  const menu = [
    { title: 'Visão Geral', url: '/admin' },
    { title: 'Relatórios', url: '/admin/relatorios' },
    { title: 'Notificações', url: '/admin/notificacoes' },
    { title: 'Clientes', url: '/admin/clientes' },
    { title: 'Solicitações', url: '/admin/solicitacoes' },
    { title: 'Configurações', url: '/admin/configuracoes' },
  ]
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-100 border-r flex flex-col">
        <div className="font-bold text-lg p-4 border-b">Admin Master</div>
        <nav className="flex-1 flex flex-col gap-1 p-2">
          {menu.map((m) => (
            <Link key={m.url} href={m.url} className="px-4 py-2 rounded hover:bg-gray-200">
              {m.title}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="m-4 px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 font-semibold">Sair</button>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between h-14 border-b px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Home className="h-5 w-5" /> Loja
          </Link>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
} 