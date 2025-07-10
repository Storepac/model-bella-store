'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Store, Smartphone, BarChart3, Users, ShoppingCart, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: Store,
    title: 'Loja Online Completa',
    description: 'Crie sua loja virtual com catálogo de produtos, categorias e sistema de busca'
  },
  {
    icon: Smartphone,
    title: 'Checkout via WhatsApp',
    description: 'Vendas diretas pelo WhatsApp com carrinho integrado e finalização simplificada'
  },
  {
    icon: BarChart3,
    title: 'Dashboard Completo',
    description: 'Gerencie produtos, pedidos, clientes e acompanhe relatórios de vendas'
  },
  {
    icon: Users,
    title: 'Gestão de Clientes',
    description: 'Cadastro de clientes, histórico de pedidos e relacionamento personalizado'
  },
  {
    icon: ShoppingCart,
    title: 'Carrinho Inteligente',
    description: 'Carrinho de compras com cálculo automático e envio direto para WhatsApp'
  },
  {
    icon: MessageCircle,
    title: 'Suporte Integrado',
    description: 'Suporte técnico e comercial integrado para ajudar no crescimento da sua loja'
  }
]

const plans = [
  {
    name: 'Start',
    price: 'R$ 29,90',
    period: '/mês',
    features: [
      'Até 500 produtos',
      'Até 2 fotos por produto',
      'Suporte básico',
      'Dashboard completo',
      'Checkout WhatsApp'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: 'R$ 59,90',
    period: '/mês',
    features: [
      'Até 1000 produtos',
      'Até 3 fotos por produto',
      'Suporte prioritário',
      'Relatórios avançados',
      'Integrações extras'
    ],
    popular: true
  },
  {
    name: 'Max',
    price: 'R$ 99,90',
    period: '/mês',
    features: [
      'Produtos ilimitados',
      'Até 4 fotos por produto',
      'Suporte VIP',
      'Relatórios completos',
      'Todas as integrações'
    ],
    popular: false
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Bella Store</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/demo">
                <Button variant="ghost">Ver Demo</Button>
              </Link>
              <Link href="/acesso">
                <Button variant="outline">Fazer Login</Button>
              </Link>
              <Link href="/cadastro">
                <Button>Criar Loja</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Crie sua loja online e venda pelo
            <span className="text-blue-600"> WhatsApp</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma completa para criar sua loja virtual com checkout integrado ao WhatsApp. 
            Sem complicações, sem taxas por venda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" className="text-lg px-8 py-4">
                Começar Agora - Grátis
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Ver Demonstração
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que você precisa para vender online
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais para criar, gerenciar e fazer crescer sua loja online
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Planos para todos os tamanhos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
              Escolha o plano ideal para sua loja. Sem taxas por venda, sem surpresas.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                <strong>Taxa única de implementação:</strong> R$ 997,00
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Valor cobrado apenas uma vez para configuração completa da sua loja
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 shadow-xl' : 'border shadow-lg'}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/cadastro">
                    <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                      Escolher Plano
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Crie sua loja online em minutos e comece a vender hoje mesmo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Criar Minha Loja Grátis
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                Ver Como Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
