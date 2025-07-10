"use client"
import { useEffect, useState, useCallback } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { IMaskInput } from 'react-imask'
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Edit, Pause, Play, Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { apiFetch } from '@/lib/api-client'

const PLAN_OPTIONS = [
  { value: 'Start', label: 'Start' },
  { value: 'Pro', label: 'Pro' },
  { value: 'Max', label: 'Max' },
]

export default function AdminClients() {
  const { toast } = useToast()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStore, setEditingStore] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState({ 
    id: null,
    name: '', 
    plan: 'Start',
    description: '',
    cnpj: '', 
    inscricao_estadual: '',
    whatsapp: '', 
    email: '', 
    cep: '', 
    rua: '', 
    numero: '', 
    bairro: '', 
    cidade: '', 
    uf: '',
    endereco: '',
    instagram: '',
    facebook: '',
    youtube: '',
    horarios: '',
    politicas_troca: '',
    politicas_gerais: '',
    isActive: true,
    store_code: '',
    password: '',
  })
  const [saving, setSaving] = useState(false)
  const [errors,setErrors]=useState<string[]>([])

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const json = await apiFetch('/stores/admin', { auth: true })
      if (json.success) {
        setStores(json.data || [])
      } else {
        console.error('Erro na API:', json.message)
        setStores([])
      }
    } catch (error) {
      console.error('Erro ao buscar lojas:', error)
      setStores([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const resetForm = () => {
    setForm({ 
      id: null,
      name: '', 
      plan: 'Start',
      description: '',
      cnpj: '', 
      inscricao_estadual: '',
      whatsapp: '', 
      email: '', 
      cep: '', 
      rua: '', 
      numero: '', 
      bairro: '', 
      cidade: '', 
      uf: '',
      endereco: '',
      instagram: '',
      facebook: '',
      youtube: '',
      horarios: '',
      politicas_troca: '',
      politicas_gerais: '',
      isActive: true,
      store_code: '',
      password: '',
    })
    setEditingStore(null)
  }

  const handleEdit = (store: any) => {
    setEditingStore(store)
    setForm({
      id: store.id,
      name: store.name || '',
      plan: store.plan || 'Start',
      description: store.description || '',
      cnpj: store.cnpj || '',
      inscricao_estadual: store.inscricao_estadual || '',
      whatsapp: store.whatsapp || '',
      email: store.email || '',
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: '',
      endereco: store.endereco || '',
      instagram: store.instagram || '',
      facebook: store.facebook || '',
      youtube: store.youtube || '',
      horarios: store.horarios || '',
      politicas_troca: store.politicas_troca || '',
      politicas_gerais: store.politicas_gerais || '',
      isActive: store.isActive,
      store_code: store.store_code || '',
      password: '',
    })
    setIsDialogOpen(true)
  }

  const handleToggleActive = async (store: any) => {
    try {
      const result = await apiFetch(`/stores/${store.id}`, {
        method: 'PUT',
        auth: true,
        body: JSON.stringify({
          id: store.id,
          name: store.name,
          description: store.description,
          cnpj: store.cnpj,
          inscricao_estadual: store.inscricao_estadual,
          whatsapp: store.whatsapp,
          email: store.email,
          endereco: store.endereco,
          instagram: store.instagram,
          facebook: store.facebook,
          youtube: store.youtube,
          horarios: store.horarios,
          politicas_troca: store.politicas_troca,
          politicas_gerais: store.politicas_gerais,
          plan: store.plan,
          isActive: !store.isActive,
          store_code: store.store_code,
          password: '',
        })
      });
      if (result.success) {
        toast({
          title: !store.isActive ? 'Loja ativada' : 'Loja pausada',
          description: 'Status atualizado com sucesso.',
        })
        reload()
      } else {
        throw new Error(result.message || 'Erro ao atualizar')
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: 'Erro ao atualizar status da loja',
        description: (error as Error).message ?? 'Tente novamente',
        variant: 'destructive'
      })
    }
  }

  const handleSave = async () => {
    const missing:string[]=[]
    if(!form.store_code) missing.push('Código')
    if(!editingStore && !form.password) missing.push('Senha')
    if(!form.name) missing.push('Nome')
    if(!form.email) missing.push('Email')
    if(!form.cnpj) missing.push('CNPJ/CPF')
    if(missing.length){
      setErrors(missing)
      toast({title:'Campos obrigatórios',description:`Preencha: ${missing.join(', ')}`,variant:'destructive'})
      return
    }
    setErrors([])
    setSaving(true)
    try {
      const method = editingStore ? 'PUT' : 'POST'
      const result = await apiFetch(`/stores${editingStore ? `/${form.id}` : ''}`, {
        method: method,
        auth: true,
        body: JSON.stringify(form)
      })
      if (result.success) {
        toast({
          title: editingStore ? 'Loja atualizada' : 'Loja cadastrada',
          description: 'Alterações salvas com sucesso.',
        })
        resetForm()
        setIsDialogOpen(false)
        reload()
      } else {
        throw new Error(result.message || 'Erro ao salvar')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast({
        title: 'Erro ao salvar loja',
        description: (error as Error).message ?? 'Tente novamente',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const buscaCep = useCallback(async (cep: string) => {
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const json = await res.json()
      if (!json.erro) {
        setForm(f => ({ ...f, rua: json.logradouro, bairro: json.bairro, cidade: json.localidade, uf: json.uf }))
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }, [])

  const handleDelete = async (id: number) => {
    try {
      const result = await apiFetch(`/stores/${id}`, {
        method: 'DELETE',
        auth: true
      })
      if (result.success) {
        toast({
          title: 'Loja deletada',
          description: 'Loja deletada com sucesso.',
        })
        reload()
      } else {
        throw new Error(result.message || 'Erro ao deletar')
      }
    } catch (error) {
      console.error('Erro ao deletar loja:', error)
      toast({
        title: 'Erro ao deletar loja',
        description: (error as Error).message ?? 'Tente novamente',
        variant: 'destructive'
      })
    }
  }

  if (loading) return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lojas Cadastradas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Loja
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStore ? 'Editar Loja' : 'Nova Loja'}</DialogTitle>
            </DialogHeader>
            
            {/* Formulário de loja */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome da Loja *</label>
                <Input 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  placeholder="Nome da Loja" 
                  className={errors.includes('Nome')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-mail *</label>
                <Input 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  placeholder="contato@loja.com" 
                  className={errors.includes('Email')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">CNPJ</label>
                <IMaskInput
                  mask="00.000.000/0000-00"
                  value={form.cnpj}
                  unmask={true}
                  onAccept={(value: string) => setForm({ ...form, cnpj: value })}
                  className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", errors.includes('CNPJ/CPF') && 'border-destructive')}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Inscrição Estadual</label>
                <Input 
                  value={form.inscricao_estadual} 
                  onChange={(e) => setForm({ ...form, inscricao_estadual: e.target.value })} 
                  placeholder="123.456.789.012" 
                  className={errors.includes('Inscrição Estadual')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">WhatsApp</label>
                <IMaskInput
                  mask="+{55} (00) 00000-0000"
                  value={form.whatsapp}
                  unmask={true}
                  onAccept={(value: string) => setForm({ ...form, whatsapp: value })}
                  className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", errors.includes('WhatsApp') && 'border-destructive')}
                  placeholder="+55 (00) 00000-0000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Plano</label>
                <Select value={form.plan} onValueChange={(v)=>setForm({...form, plan: v})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_OPTIONS.map(p=>(<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Instagram</label>
                <Input 
                  value={form.instagram} 
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })} 
                  placeholder="@loja" 
                  className={errors.includes('Instagram')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Facebook</label>
                <Input 
                  value={form.facebook} 
                  onChange={(e) => setForm({ ...form, facebook: e.target.value })} 
                  placeholder="facebook.com/loja" 
                  className={errors.includes('Facebook')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">YouTube</label>
                <Input 
                  value={form.youtube} 
                  onChange={(e) => setForm({ ...form, youtube: e.target.value })} 
                  placeholder="youtube.com/loja" 
                  className={errors.includes('YouTube')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">CEP</label>
                <IMaskInput
                  mask="00000-000"
                  value={form.cep}
                  unmask={true}
                  onAccept={(value: string) => {
                    setForm({ ...form, cep: value });
                    if (value.length === 8) buscaCep(value);
                  }}
                  className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", errors.includes('CEP') && 'border-destructive')}
                  placeholder="00000-000"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Rua</label>
                <Input 
                  value={form.rua} 
                  onChange={(e) => setForm({ ...form, rua: e.target.value })} 
                  placeholder="Rua" 
                  className={errors.includes('Rua')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Número</label>
                <Input 
                  value={form.numero} 
                  onChange={(e) => setForm({ ...form, numero: e.target.value })} 
                  placeholder="123" 
                  className={errors.includes('Número')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bairro</label>
                <Input 
                  value={form.bairro} 
                  onChange={(e) => setForm({ ...form, bairro: e.target.value })} 
                  placeholder="Bairro" 
                  className={errors.includes('Bairro')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Cidade</label>
                <Input 
                  value={form.cidade} 
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })} 
                  placeholder="Cidade" 
                  className={errors.includes('Cidade')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">UF</label>
                <Input 
                  value={form.uf} 
                  onChange={(e) => setForm({ ...form, uf: e.target.value })} 
                  placeholder="UF" 
                  maxLength={2} 
                  className={errors.includes('UF')?'border-destructive':undefined}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Endereço completo</label>
                <Textarea value={form.endereco} onChange={(e)=>setForm({...form,endereco:e.target.value})} placeholder="Rua, Número - Bairro, Cidade/UF - CEP" rows={2} className={errors.includes('Endereço')?'border-destructive':undefined}/>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea 
                  value={form.description} 
                  onChange={(e) => setForm({ ...form, description: e.target.value })} 
                  placeholder="Descrição da loja" 
                  rows={3}
                  className={errors.includes('Descrição')?'border-destructive':undefined}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Horários de Funcionamento</label>
                <Textarea 
                  value={form.horarios} 
                  onChange={(e) => setForm({ ...form, horarios: e.target.value })} 
                  placeholder="Segunda a Sexta: 8h às 18h" 
                  rows={2}
                  className={errors.includes('Horários')?'border-destructive':undefined}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Políticas de Troca</label>
                <Textarea 
                  value={form.politicas_troca} 
                  onChange={(e) => setForm({ ...form, politicas_troca: e.target.value })} 
                  placeholder="Políticas de troca e devolução" 
                  rows={3}
                  className={errors.includes('Políticas de Troca')?'border-destructive':undefined}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Políticas Gerais</label>
                <Textarea 
                  value={form.politicas_gerais} 
                  onChange={(e) => setForm({ ...form, politicas_gerais: e.target.value })} 
                  placeholder="Políticas gerais da loja" 
                  rows={3}
                  className={errors.includes('Políticas Gerais')?'border-destructive':undefined}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Código *</label>
                <Input value={form.store_code} onChange={(e)=>setForm({...form,store_code:e.target.value})} placeholder="loja123" disabled={!!editingStore} className={errors.includes('Código')?'border-destructive':undefined}/>
              </div>
              <div>
                <label className="text-sm font-medium">Senha *</label>
                <Input type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} placeholder="senha" className={errors.includes('Senha')?'border-destructive':undefined}/>
              </div>
              <div className="md:col-span-2 flex gap-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : (editingStore ? 'Atualizar' : 'Adicionar')} Loja
                </Button>
                <Button variant="outline" onClick={() => { resetForm(); setIsDialogOpen(false) }}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Instagram</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastrado</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.id}</TableCell>
                <TableCell>{store.store_code}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{store.name}</div>
                    {store.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {store.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{store.cnpj || '-'}</TableCell>
                <TableCell>{store.whatsapp || '-'}</TableCell>
                <TableCell>{store.email || '-'}</TableCell>
                <TableCell>{store.total_products}</TableCell>
                <TableCell>{store.plan}</TableCell>
                <TableCell>
                  <Badge variant={store.isActive ? 'default' : 'secondary'}>
                    {store.isActive ? 'Ativa' : 'Pausada'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {store.createdAt ? new Date(store.createdAt).toLocaleDateString('pt-BR') : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(store)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(store)}
                    >
                      {store.isActive ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(store.id)}
                    >
                      Del
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {stores.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            Nenhuma loja encontrada.
          </div>
        )}
      </div>
    </div>
  )
} 