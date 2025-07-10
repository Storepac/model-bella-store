'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Copy, Clock, CreditCard, Smartphone } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

const PLANS = {
  'Start': { name: 'Start', price: 29.90, features: ['Até 500 produtos', 'Até 2 fotos por produto', 'Suporte básico'] },
  'Pro': { name: 'Pro', price: 59.90, features: ['Até 1000 produtos', 'Até 3 fotos por produto', 'Suporte prioritário'] },
  'Max': { name: 'Max', price: 99.90, features: ['Produtos ilimitados', 'Até 4 fotos por produto', 'Suporte VIP'] }
}

const IMPLEMENTATION_FEE = 997.00

export default function PagamentoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [paymentStep, setPaymentStep] = useState<'pending' | 'processing' | 'completed'>('pending')
  const [countdown, setCountdown] = useState(5)
  const [storeData, setStoreData] = useState<any>(null)
  
  const plan = searchParams.get('plan') || 'Start'
  const storeId = searchParams.get('storeId')
  const storeCode = searchParams.get('storeCode')
  
  const selectedPlan = PLANS[plan as keyof typeof PLANS] || PLANS.Start
  const totalAmount = selectedPlan.price + IMPLEMENTATION_FEE
  
  // PIX code simulado
  const pixCode = `00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540${totalAmount.toFixed(2)}5802BR5925BELLA STORE PAGAMENTOS6009SAO PAULO62070503***6304`

  useEffect(() => {
    // Recuperar dados da loja do localStorage
    const storedData = localStorage.getItem('newStoreData')
    if (storedData) {
      setStoreData(JSON.parse(storedData))
    }
  }, [])

  useEffect(() => {
    if (paymentStep === 'completed' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (paymentStep === 'completed' && countdown === 0) {
      // Redirecionar para o dashboard
      if (storeId) {
        router.push(`/catalogo/dashboard-${storeId}`)
      } else {
        router.push('/acesso')
      }
    }
  }, [paymentStep, countdown, storeId, router])

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    toast({
      title: 'Código PIX copiado!',
      description: 'Cole no seu app de pagamentos para finalizar.',
    })
  }

  const simulatePayment = () => {
    setPaymentStep('processing')
    
    // Simular processamento do pagamento
    setTimeout(() => {
      setPaymentStep('completed')
      toast({
        title: 'Pagamento confirmado!',
        description: 'Sua loja foi ativada com sucesso.',
      })
    }, 3000)
  }

  const renderPaymentStep = () => {
    switch (paymentStep) {
      case 'pending':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Finalize seu pagamento</h2>
              <p className="text-gray-600">
                Escaneie o QR Code ou copie o código PIX para pagar
              </p>
            </div>

            {/* QR Code Simulado */}
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-black rounded-lg mb-4 mx-auto flex items-center justify-center">
                      <div className="text-white text-xs font-mono">QR PIX</div>
                    </div>
                    <p className="text-sm text-gray-600">Escaneie com seu app</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Código PIX */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Copy className="h-5 w-5 mr-2" />
                  Código PIX
                </CardTitle>
                <CardDescription>
                  Copie e cole no seu app de pagamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded-lg break-all text-sm font-mono mb-4">
                  {pixCode}
                </div>
                <Button onClick={copyPixCode} className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar código PIX
                </Button>
              </CardContent>
            </Card>

            {/* Simulação de Pagamento */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-blue-600 mb-4">
                    <strong>Modo demonstração:</strong> Clique no botão abaixo para simular o pagamento
                  </p>
                  <Button onClick={simulatePayment} className="bg-blue-600 hover:bg-blue-700">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Simular Pagamento PIX
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'processing':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Processando pagamento...</h2>
              <p className="text-gray-600">
                Aguarde enquanto confirmamos seu pagamento
              </p>
            </div>
          </div>
        )

      case 'completed':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2 text-green-600">
                Pagamento confirmado!
              </h2>
              <p className="text-gray-600 mb-4">
                Sua loja foi criada e ativada com sucesso
              </p>
              {storeData && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Loja:</strong> {storeData.name}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Código:</strong> {storeCode}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Plano:</strong> {selectedPlan.name}
                  </p>
                </div>
              )}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700 font-semibold">
                Redirecionando para seu dashboard em {countdown} segundos...
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pagamento - Bella Store
          </h1>
          <p className="text-gray-600">
            Complete seu pagamento para ativar sua loja
          </p>
        </div>

        {/* Resumo do Pedido */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Plano {selectedPlan.name}</h3>
                <p className="text-sm text-gray-600">Mensalidade</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">R$ {selectedPlan.price.toFixed(2)}</p>
                <p className="text-sm text-gray-600">por mês</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold">Taxa de Implementação</h3>
                <p className="text-sm text-gray-600">Pagamento único</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">R$ {IMPLEMENTATION_FEE.toFixed(2)}</p>
                <p className="text-sm text-gray-600">apenas uma vez</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h4 className="font-medium">Recursos inclusos:</h4>
              {selectedPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Taxa de Implementação inclui:</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Configuração completa da loja
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Personalização de cores e layout
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Treinamento inicial
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Suporte na migração de dados
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total a Pagar</span>
              <span>R$ {totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              * Após o primeiro pagamento, você pagará apenas R$ {selectedPlan.price.toFixed(2)}/mês
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo do Pagamento */}
        <Card>
          <CardContent className="pt-6">
            {renderPaymentStep()}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Pagamento seguro processado pela Bella Store</p>
          <p>Seus dados estão protegidos com criptografia SSL</p>
        </div>
      </div>
    </div>
  )
} 