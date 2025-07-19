'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { apiFetch } from '@/lib/api-client'
import { CheckCircle, Circle, Store, User, Settings, CreditCard } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Dados da Loja', icon: Store },
  { id: 2, title: 'Dados do Responsável', icon: User },
  { id: 3, title: 'Configurações', icon: Settings },
  { id: 4, title: 'Plano', icon: CreditCard },
]

const PLANS = [
  {
    id: 'Start',
    name: 'Start',
    price: 'R$ 29,90',
    features: ['Até 500 produtos', 'Até 2 fotos por produto', 'Suporte básico'],
    recommended: false
  },
  {
    id: 'Pro',
    name: 'Pro',
    price: 'R$ 59,90',
    features: ['Até 1000 produtos', 'Até 3 fotos por produto', 'Suporte prioritário', 'Relatórios avançados'],
    recommended: true
  },
  {
    id: 'Max',
    name: 'Max',
    price: 'R$ 99,90',
    features: ['Produtos ilimitados', 'Até 4 fotos por produto', 'Suporte VIP', 'Relatórios completos', 'Integrações'],
    recommended: false
  }
]

export default function CadastroWizard() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Dados da Loja
    store_name: '',
    store_description: '',
    cnpj: '',
    inscricao_estadual: '',
    
    // Dados do Responsável
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    whatsapp: '',
    
    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
    
    // Redes sociais
    instagram: '',
    facebook: '',
    youtube: '',
    
    // Configurações
    horarios: '',
    politicas_troca: '',
    politicas_gerais: '',
    
    // Cores padrão
    cor_primaria: '#000000',
    cor_secundaria: '#666666',
    cor_botoes: '#000000',
    
    // Plano
    plan: 'Start'
  })

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.store_name && formData.cnpj)
      case 2:
        return !!(formData.name && formData.email && formData.password && 
                 formData.confirmPassword && formData.password === formData.confirmPassword)
      case 3:
        return true // Configurações são opcionais
      case 4:
        return !!formData.plan
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
    } else {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios antes de continuar.',
        variant: 'destructive'
      })
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setLoading(true)
    try {
      const payload = {
        name: formData.store_name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        description: formData.store_description,
        cnpj: formData.cnpj,
        inscricao_estadual: formData.inscricao_estadual,
        endereco: `${formData.endereco}, ${formData.numero} - ${formData.bairro}, ${formData.cidade}/${formData.uf}`,
        instagram: formData.instagram,
        facebook: formData.facebook,
        youtube: formData.youtube,
        horarios: formData.horarios,
        politicas_troca: formData.politicas_troca,
        politicas_gerais: formData.politicas_gerais,
        plan: formData.plan,
        password: formData.password,
        cor_primaria: formData.cor_primaria,
        cor_secundaria: formData.cor_secundaria,
        cor_botoes: formData.cor_botoes
      }

      const result = await apiFetch('/stores/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      })

      if (result.success) {
        const { store, storeCode } = result.data
        
        // Salvar dados da loja no localStorage para a página de pagamento
        localStorage.setItem('newStoreData', JSON.stringify({
          name: formData.name,
          email: formData.email,
          plan: formData.plan,
          storeId: store.id,
          storeCode: storeCode
        }))
        
        toast({
          title: 'Loja criada com sucesso!',
          description: 'Redirecionando para o pagamento...',
        })
        
        // Redirecionar para a página de pagamento
        router.push(`/pagamento?plan=${formData.plan}&storeId=${store.id}&storeCode=${storeCode}`)
      } else {
        throw new Error(result.message || 'Erro ao criar loja')
      }
    } catch (error) {
      console.error('Erro ao criar loja:', error)
      toast({
        title: 'Erro ao criar loja',
        description: (error as Error).message || 'Tente novamente',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Funções de formatação
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const buscaCep = async (cep: string) => {
    const cleanCEP = cep.replace(/\D/g, '')
    if (cleanCEP.length !== 8) return
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
      const data = await res.json()
      if (!data.erro) {
        updateFormData('endereco', data.logradouro)
        updateFormData('bairro', data.bairro)
        updateFormData('cidade', data.localidade)
        updateFormData('uf', data.uf)
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="store_name">Nome da Loja *</Label>
                <Input
                  id="store_name"
                  value={formData.store_name}
                  onChange={(e) => updateFormData('store_name', e.target.value)}
                  placeholder="Ex: Minha Loja Fashion"
                />
              </div>
              <div>
                <Label htmlFor="store_description">Descrição da Loja</Label>
                <Input
                  id="store_description"
                  value={formData.store_description}
                  onChange={(e) => updateFormData('store_description', e.target.value)}
                  placeholder="Breve descrição da sua loja"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="store_description">Descrição da Loja</Label>
              <Textarea
                id="store_description"
                value={formData.store_description}
                onChange={(e) => updateFormData('store_description', e.target.value)}
                placeholder="Descreva sua loja..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cnpj">CNPJ/CPF *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => {
                    const formatted = formatCNPJ(e.target.value)
                    updateFormData('cnpj', formatted)
                  }}
                  placeholder="00.000.000/0000-00 ou 000.000.000-00"
                  maxLength={18}
                />
              </div>
              <div>
                <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                <Input
                  id="inscricao_estadual"
                  value={formData.inscricao_estadual}
                  onChange={(e) => updateFormData('inscricao_estadual', e.target.value)}
                  placeholder="000.000.000.000"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  placeholder="Confirme sua senha"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  updateFormData('whatsapp', formatted)
                }}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => {
                    const formatted = formatCEP(e.target.value)
                    updateFormData('cep', formatted)
                    if (e.target.value.replace(/\D/g, '').length === 8) {
                      buscaCep(e.target.value)
                    }
                  }}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => updateFormData('endereco', e.target.value)}
                  placeholder="Rua, Avenida..."
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  value={formData.numero}
                  onChange={(e) => updateFormData('numero', e.target.value)}
                  placeholder="123"
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  value={formData.bairro}
                  onChange={(e) => updateFormData('bairro', e.target.value)}
                  placeholder="Centro"
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => updateFormData('cidade', e.target.value)}
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={formData.uf}
                  onChange={(e) => updateFormData('uf', e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => updateFormData('instagram', e.target.value)}
                  placeholder="@minhalojaoficial"
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => updateFormData('facebook', e.target.value)}
                  placeholder="facebook.com/minhaloja"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={formData.youtube}
                  onChange={(e) => updateFormData('youtube', e.target.value)}
                  placeholder="youtube.com/minhaloja"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="horarios">Horários de Funcionamento</Label>
              <Textarea
                id="horarios"
                value={formData.horarios}
                onChange={(e) => updateFormData('horarios', e.target.value)}
                placeholder="Ex: Segunda a Sexta: 9h às 18h"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="politicas_troca">Políticas de Troca e Devolução</Label>
              <Textarea
                id="politicas_troca"
                value={formData.politicas_troca}
                onChange={(e) => updateFormData('politicas_troca', e.target.value)}
                placeholder="Descreva suas políticas de troca..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="politicas_gerais">Políticas Gerais</Label>
              <Textarea
                id="politicas_gerais"
                value={formData.politicas_gerais}
                onChange={(e) => updateFormData('politicas_gerais', e.target.value)}
                placeholder="Termos de uso, políticas de privacidade..."
                rows={3}
              />
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Cores da Loja</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cor_primaria">Cor Primária</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="cor_primaria"
                      value={formData.cor_primaria}
                      onChange={(e) => updateFormData('cor_primaria', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <Input
                      value={formData.cor_primaria}
                      onChange={(e) => updateFormData('cor_primaria', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cor_secundaria">Cor Secundária</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="cor_secundaria"
                      value={formData.cor_secundaria}
                      onChange={(e) => updateFormData('cor_secundaria', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <Input
                      value={formData.cor_secundaria}
                      onChange={(e) => updateFormData('cor_secundaria', e.target.value)}
                      placeholder="#666666"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cor_botoes">Cor dos Botões</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      id="cor_botoes"
                      value={formData.cor_botoes}
                      onChange={(e) => updateFormData('cor_botoes', e.target.value)}
                      className="w-12 h-10 rounded border border-gray-300"
                    />
                    <Input
                      value={formData.cor_botoes}
                      onChange={(e) => updateFormData('cor_botoes', e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Escolha seu plano</h3>
              <p className="text-muted-foreground">
                Você pode alterar seu plano a qualquer momento
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    formData.plan === plan.id 
                      ? 'ring-2 ring-primary' 
                      : 'hover:shadow-md'
                  } ${plan.recommended ? 'border-primary' : ''}`}
                  onClick={() => updateFormData('plan', plan.id)}
                >
                  <CardHeader className="text-center">
                    {plan.recommended && (
                      <Badge className="mb-2 w-fit mx-auto">Recomendado</Badge>
                    )}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-2xl font-bold text-primary">
                      {plan.price}
                      <span className="text-sm text-muted-foreground">/mês</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header com botões de navegação */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/">
                ← Voltar para Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/acesso">
                Fazer Login
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Bella Store</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Nova Loja
          </h1>
          <p className="text-gray-600">
            Configure sua loja online em poucos passos
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`ml-2 text-sm ${
                    isActive ? 'text-primary font-medium' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {index < STEPS.length - 1 && (
                    <div className={`w-8 h-0.5 ml-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription>
              Passo {currentStep} de {STEPS.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          {currentStep === STEPS.length ? (
            <Button 
              onClick={handleSubmit}
              disabled={loading || !validateStep(currentStep)}
            >
              {loading ? 'Criando...' : 'Criar Loja'}
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Próximo
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 