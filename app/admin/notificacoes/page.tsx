"use client"
import { useEffect, useState } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

export default function AdminNotifications() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/notifications')
        const json = await res.json()
        setItems(json.notifications || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Carregando...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notificações Enviadas</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Mensagem</TableHead>
            <TableHead>Enviado em</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((n) => (
            <TableRow key={n.id}>
              <TableCell>{n.id}</TableCell>
              <TableCell>{n.whatsapp}</TableCell>
              <TableCell className="max-w-[300px] truncate">{n.mensagem}</TableCell>
              <TableCell>{n.enviado_em ? new Date(n.enviado_em).toLocaleString('pt-BR') : '-'}</TableCell>
              <TableCell>{n.status || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {items.length === 0 && <p className="text-muted-foreground mt-4">Nenhuma notificação encontrada.</p>}
    </div>
  )
} 