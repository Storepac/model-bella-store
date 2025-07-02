"use client"

import { useState } from "react"
import { X, Plus, Minus, ShoppingBag, Trash2, Tag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckoutForm, type CheckoutData } from "@/components/checkout-form"
import { useCart } from "@/lib/cart-context"
import Image from "next/image"

// Cupons mockados para demonstração
const availableCoupons = [
  { code: "PRIMEIRA10", discount: 10, type: "percentage" as const, minValue: 100 },
  { code: "FRETE20", discount: 20, type: "fixed" as const },
  { code: "DESCONTO15", discount: 15, type: "percentage" as const, minValue: 150 },
]

export function CartDrawer() {
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    applyCoupon,
    removeCoupon,
    setShipping,
    getSubtotal,
    getDiscount,
    getTotal,
    getItemCount,
  } = useCart()

  const [couponCode, setCouponCode] = useState("")
  const [couponError, setCouponError] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [showCheckout, setShowCheckout] = useState(false)

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find((c) => c.code === couponCode.toUpperCase())

    if (!coupon) {
      setCouponError("Cupom inválido")
      return
    }

    const subtotal = getSubtotal()
    if (coupon.minValue && subtotal < coupon.minValue) {
      setCouponError(`Valor mínimo de R$ ${coupon.minValue.toFixed(2)} para este cupom`)
      return
    }

    applyCoupon(coupon)
    setCouponCode("")
    setCouponError("")
  }

  const calculateShipping = () => {
    if (!zipCode || zipCode.length !== 8) return

    // Simulação de cálculo de frete
    const shipping = Math.random() > 0.5 ? 15.9 : 25.9
    setShipping(shipping)
  }

  const handleCheckoutSubmit = (checkoutData: CheckoutData) => {
    const items = state.items
      .map(
        (item) =>
          `• ${item.name}${item.selectedSize ? ` (Tam: ${item.selectedSize})` : ""}${item.selectedColor ? ` (Cor: ${item.selectedColor})` : ""} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("\n")

    const subtotal = getSubtotal()
    const discount = getDiscount()
    const shipping = subtotal >= 199 ? 0 : state.shippingCost
    let total = getTotal()

    // Aplicar desconto PIX
    if (checkoutData.paymentMethod === "pix") {
      const pixDiscount = total * 0.05
      total = total - pixDiscount
    }

    const paymentMethodText = {
      pix: "PIX (5% desconto)",
      card: "Cartão de Crédito",
      boleto: "Boleto Bancário",
      conditional: "Compra Condicional - Provar na Loja",
    }

    let message = ""

    if (checkoutData.paymentMethod === "conditional") {
      message = `🛍️ *RESERVA - BELLA STORE*

👤 *CLIENTE:*
Nome: ${checkoutData.customer.name}
Telefone: ${checkoutData.customer.phone}
${checkoutData.customer.email ? `E-mail: ${checkoutData.customer.email}` : ""}

📋 *PRODUTOS RESERVADOS:*
${items}

💰 *RESUMO:*
Subtotal: R$ ${subtotal.toFixed(2)}
${discount > 0 ? `Desconto: -R$ ${discount.toFixed(2)}` : ""}
*Total: R$ ${getTotal().toFixed(2)}*

🏪 *MODALIDADE:* ${paymentMethodText[checkoutData.paymentMethod]}

${state.appliedCoupon ? `🎟️ Cupom aplicado: ${state.appliedCoupon.code}` : ""}

Gostaria de reservar estes produtos para provar na loja!`
    } else {
      message = `🛍️ *PEDIDO - BELLA STORE*

👤 *CLIENTE:*
Nome: ${checkoutData.customer.name}
Telefone: ${checkoutData.customer.phone}
${checkoutData.customer.email ? `E-mail: ${checkoutData.customer.email}` : ""}

📦 *ENDEREÇO DE ENTREGA:*
${checkoutData.address.street}, ${checkoutData.address.number}
${checkoutData.address.complement ? `${checkoutData.address.complement}` : ""}
${checkoutData.address.neighborhood} - ${checkoutData.address.city}/${checkoutData.address.state}
CEP: ${checkoutData.address.zipCode}

📋 *ITENS:*
${items}

💰 *RESUMO:*
Subtotal: R$ ${subtotal.toFixed(2)}
${discount > 0 ? `Desconto: -R$ ${discount.toFixed(2)}` : ""}
${checkoutData.paymentMethod === "pix" ? `Desconto PIX (5%): -R$ ${(getTotal() * 0.05).toFixed(2)}` : ""}
${shipping > 0 ? `Frete: R$ ${shipping.toFixed(2)}` : "Frete: GRÁTIS"}
*Total: R$ ${total.toFixed(2)}*

💳 *PAGAMENTO:* ${paymentMethodText[checkoutData.paymentMethod]}

${state.appliedCoupon ? `🎟️ Cupom aplicado: ${state.appliedCoupon.code}` : ""}

Gostaria de finalizar este pedido!`
    }

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    // Limpar carrinho após envio
    clearCart()
    setShowCheckout(false)
    toggleCart()
  }

  if (!state.isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={toggleCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl transform transition-transform overflow-hidden">
        {showCheckout ? (
          <div className="h-full overflow-y-auto">
            <CheckoutForm onSubmit={handleCheckoutSubmit} onBack={() => setShowCheckout(false)} />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">Carrinho ({getItemCount()})</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {state.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Carrinho vazio</h3>
                  <p className="text-muted-foreground mb-4">Adicione produtos para começar suas compras</p>
                  <Button onClick={toggleCart}>Continuar Comprando</Button>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Items */}
                  {state.items.map((item) => {
                    const itemKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`

                    return (
                      <div key={itemKey} className="flex gap-3 p-3 border rounded-lg">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            {item.selectedSize && <span>Tam: {item.selectedSize}</span>}
                            {item.selectedColor && <span>Cor: {item.selectedColor}</span>}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-red-500 hover:text-red-700"
                                onClick={() => removeItem(itemKey)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Cupom */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4" />
                      <span className="text-sm font-medium">Cupom de Desconto</span>
                    </div>

                    {state.appliedCoupon ? (
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {state.appliedCoupon.code}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Digite o cupom"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="text-sm"
                          />
                          <Button size="sm" onClick={handleApplyCoupon}>
                            Aplicar
                          </Button>
                        </div>
                        {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                        <div className="text-xs text-muted-foreground">
                          Cupons disponíveis: PRIMEIRA10, FRETE20, DESCONTO15
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Frete */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium">Calcular Frete</span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="CEP (apenas números)"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                        className="text-sm"
                      />
                      <Button size="sm" onClick={calculateShipping}>
                        Calcular
                      </Button>
                    </div>
                    {state.shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">Frete: R$ {state.shippingCost.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {state.items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                {/* Resumo */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>R$ {getSubtotal().toFixed(2)}</span>
                  </div>

                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto:</span>
                      <span>-R$ {getDiscount().toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Frete:</span>
                    <span>{getSubtotal() >= 199 ? "GRÁTIS" : `R$ ${state.shippingCost.toFixed(2)}`}</span>
                  </div>

                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>R$ {getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowCheckout(true)}
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                    Limpar Carrinho
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
