"use client"

import { useEffect } from "react"
import { CheckCircle, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"

interface CartToastProps {
  show: boolean
  onClose: () => void
  productName: string
}

export function CartToast({ show, onClose, productName }: CartToastProps) {
  const { toggleCart } = useCart()

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div className="fixed top-20 right-4 z-50 bg-white border border-green-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right">
      <div className="flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">Produto adicionado!</p>
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">{productName}</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={toggleCart} className="bg-pink-500 hover:bg-pink-600 text-white">
              <ShoppingBag className="h-3 w-3 mr-1" />
              Ver Carrinho
            </Button>
            <Button size="sm" variant="outline" onClick={onClose} className="bg-transparent">
              Continuar
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
