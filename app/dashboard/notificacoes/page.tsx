"use client"

import { useState, type ChangeEvent, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Send } from "lucide-react"

export default function NotificacoesPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [notificacoes, setNotificacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  useEffect(() => {
    const fetchNotificacoes = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/notifications')
        const data = await res.json()
        setNotificacoes(data.notifications || [])
      } catch (err) {
        setNotificacoes([])
      } finally {
        setLoading(false)
      }
    }
    fetchNotificacoes()
  }, [])

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notificações e Cobranças</h1>
          <p className="text-muted-foreground">Envie mensagens e boletos para seus clientes.</p>
        </div>
      </div>

      <Tabs defaultValue="existing-customer" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 max-w-md">
          <TabsTrigger value="existing-customer">Cliente Cadastrado</TabsTrigger>
          <TabsTrigger value="manual-send">Envio Avulso</TabsTrigger>
        </TabsList>
        <TabsContent value="existing-customer">
          <Card>
            <CardHeader>
              <CardTitle>Enviar para Cliente Cadastrado</CardTitle>
              <CardDescription>
                Selecione um cliente da sua lista para enviar uma mensagem e/ou arquivo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Cliente</Label>
                <Select>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {notificacoes.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message-existing">Mensagem</Label>
                <Textarea
                  id="message-existing"
                  placeholder="Digite sua mensagem aqui. Ex: Olá, [nome_cliente]! Segue o boleto para pagamento."
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-existing">Anexar Boleto (PDF)</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Input id="file-existing" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Label htmlFor="file-existing" className="cursor-pointer w-full flex justify-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Escolher Arquivo
                    </Label>
                  </Button>
                  {selectedFile && <span className="text-sm text-muted-foreground">{selectedFile.name}</span>}
                </div>
              </div>
              <Button className="w-full sm:w-auto py-3 text-base sm:py-2">
                <Send className="mr-2 h-4 w-4" />
                Enviar para Cliente
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manual-send">
          <Card>
            <CardHeader>
              <CardTitle>Envio Avulso</CardTitle>
              <CardDescription>Digite um número de telefone para enviar uma mensagem e/ou arquivo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone-manual">Número do WhatsApp</Label>
                <Input id="phone-manual" type="tel" placeholder="(XX) XXXXX-XXXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message-manual">Mensagem</Label>
                <Textarea id="message-manual" placeholder="Digite sua mensagem aqui." rows={5} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-manual">Anexar Boleto (PDF)</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Input id="file-manual" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  <Button asChild variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Label htmlFor="file-manual" className="cursor-pointer w-full flex justify-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Escolher Arquivo
                    </Label>
                  </Button>
                  {selectedFile && <span className="text-sm text-muted-foreground">{selectedFile.name}</span>}
                </div>
              </div>
              <Button className="w-full sm:w-auto py-3 text-base sm:py-2">
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
