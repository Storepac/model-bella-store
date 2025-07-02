"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description?: string
  sizes?: string[]
  colors?: string[]
  stock?: number
  isNew?: boolean
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export interface Coupon {
  code: string
  discount: number
  type: "percentage" | "fixed"
  minValue?: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  appliedCoupon?: Coupon
  shippingCost: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; size?: string; color?: string } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "APPLY_COUPON"; payload: Coupon }
  | { type: "REMOVE_COUPON" }
  | { type: "SET_SHIPPING"; payload: number }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, color } = action.payload
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += 1
        return { ...state, items: updatedItems }
      }

      const newItem: CartItem = {
        ...product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color,
      }

      return { ...state, items: [...state.items, newItem] }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) =>
            !(item.id === action.payload || `${item.id}-${item.selectedSize}-${item.selectedColor}` === action.payload),
        ),
      }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) => {
          const itemKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`
          if (itemKey === action.payload.id || item.id === action.payload.id) {
            return { ...item, quantity: Math.max(0, action.payload.quantity) }
          }
          return item
        })
        .filter((item) => item.quantity > 0)

      return { ...state, items: updatedItems }
    }

    case "CLEAR_CART":
      return { ...state, items: [], appliedCoupon: undefined }

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen }

    case "APPLY_COUPON":
      return { ...state, appliedCoupon: action.payload }

    case "REMOVE_COUPON":
      return { ...state, appliedCoupon: undefined }

    case "SET_SHIPPING":
      return { ...state, shippingCost: action.payload }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (product: Product, size?: string, color?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  setShipping: (cost: number) => void
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const initialState: CartState = {
  items: [],
  isOpen: false,
  shippingCost: 0,
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      parsedCart.items.forEach((item: CartItem) => {
        dispatch({
          type: "ADD_ITEM",
          payload: {
            product: item,
            size: item.selectedSize,
            color: item.selectedColor,
          },
        })
      })
    }
  }, [])

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state))
  }, [state])

  const addItem = (product: Product, size?: string, color?: string) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size, color } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" })
  }

  const applyCoupon = (coupon: Coupon) => {
    dispatch({ type: "APPLY_COUPON", payload: coupon })
  }

  const removeCoupon = () => {
    dispatch({ type: "REMOVE_COUPON" })
  }

  const setShipping = (cost: number) => {
    dispatch({ type: "SET_SHIPPING", payload: cost })
  }

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getDiscount = () => {
    if (!state.appliedCoupon) return 0

    const subtotal = getSubtotal()
    if (state.appliedCoupon.minValue && subtotal < state.appliedCoupon.minValue) {
      return 0
    }

    if (state.appliedCoupon.type === "percentage") {
      return (subtotal * state.appliedCoupon.discount) / 100
    }

    return state.appliedCoupon.discount
  }

  const getTotal = () => {
    const subtotal = getSubtotal()
    const discount = getDiscount()
    const shipping = subtotal >= 199 ? 0 : state.shippingCost
    return Math.max(0, subtotal - discount + shipping)
  }

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
