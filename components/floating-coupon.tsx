"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Tag, 
  X, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Percent, 
  Calendar,
  ShoppingBag,
  Gift
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Coupon {
  id: string
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  minValue: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
  usageLimit?: number
  usedCount: number
  description?: string
}

interface FloatingCouponProps {
  storeId?: number
}

export function FloatingCoupon({ storeId }: FloatingCouponProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Buscar cupom ativo da loja
  useEffect(() => {
    const fetchActiveCoupon = async () => {
      if (!storeId) return
      
      try {
        const response = await fetch(`/api/coupons/active?storeId=${storeId}`)
        const data = await response.json()
        
        if (data.success && data.coupon) {
          setCoupon(data.coupon)
        }
      } catch (error) {
        // Silenciar erro - cupom não é crítico
      }
    }

    fetchActiveCoupon()
  }, [storeId])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Cupom copiado!",
        description: "Código do cupom copiado para a área de transferência.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o cupom.",
        variant: "destructive"
      })
    }
  }

  const isCouponValid = (coupon: Coupon) => {
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)
    
    return now >= validFrom && now <= validUntil && coupon.isActive
  }

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discount}% OFF`
    } else {
      return `R$ ${coupon.discount.toFixed(2).replace('.', ',')} OFF`
    }
  }

  const getMinValueText = (coupon: Coupon) => {
    return `Mínimo R$ ${coupon.minValue.toFixed(2).replace('.', ',')}`
  }

  // Se não há cupom ativo, não mostrar nada
  if (!coupon || !isCouponValid(coupon)) {
    return null
  }

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Gift className="h-6 w-6 text-white" />
          <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-xs p-0 flex items-center justify-center">
            !
          </Badge>
        </Button>
      </div>

      {/* Modal do Cupom */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative w-full max-w-md">
            <Card className="relative">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl">Cupom Especial!</CardTitle>
                <CardDescription>
                  Aproveite este desconto exclusivo
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Cupom Principal */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border-2 border-dashed border-pink-300">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600 mb-2">
                      {getDiscountText(coupon)}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {coupon.description || "Desconto especial para você!"}
                    </div>
                    
                    {/* Código do Cupom */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-lg font-bold text-gray-800">
                          {coupon.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(coupon.code)}
                          className="ml-2"
                        >
                          <Copy className={`h-4 w-4 ${copied ? 'text-green-500' : 'text-gray-500'}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detalhes do Cupom */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Valor mínimo:</span>
                    <span className="font-medium">{getMinValueText(coupon)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Válido até:</span>
                    <span className="font-medium">
                      {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {coupon.usageLimit && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Usos restantes:</span>
                      <span className="font-medium">
                        {coupon.usageLimit - coupon.usedCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Como usar */}
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Como usar:</strong> Copie o código e cole no campo "Cupom" durante o checkout.
                  </AlertDescription>
                </Alert>

                {/* Botões */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Fechar
                  </Button>
                  <Button
                    onClick={() => {
                      copyToClipboard(coupon.code)
                      setIsOpen(false)
                    }}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Cupom
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
} 