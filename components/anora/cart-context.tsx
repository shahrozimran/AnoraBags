"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { OrderItem } from "@/lib/types"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  color: string
  image: string
  currency: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: { id: string; name: string; price: number; color?: string; image?: string; currency?: string }, quantity?: number) => void
  updateQuantity: (id: string, color: string, quantity: number) => void
  removeItem: (id: string, color: string) => void
  clearCart: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  itemCount: number
  subtotal: number
  shippingFee: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "anora_bag_cart_v1"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setItems(parsed.filter(item => item && typeof item.id === "string" && Number.isFinite(item.price) && Number.isInteger(item.quantity) && item.quantity > 0).slice(0, 20).map(item => ({ ...item, quantity: Math.min(20, item.quantity) })))
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage", e)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (e) {
        console.warn("Could not save cart to localStorage", e)
      }
    }
  }, [items, isHydrated])

  const addItem = useCallback(
    (product: { id: string; name: string; price: number; color?: string; image?: string; currency?: string }, quantity = 1) => {
      const selectedColor = product.color || "Rich Bordeaux"
      const selectedImage = product.image || "/images/products/bordeaux-crossbody-hero.jpeg"
      const currency = product.currency || "Rs."

      setItems((prev) => {
        const existingIdx = prev.findIndex((i) => i.id === product.id && i.color === selectedColor)
        if (existingIdx > -1) {
          const updated = [...prev]
          updated[existingIdx] = { ...updated[existingIdx], quantity: Math.min(20, updated[existingIdx].quantity + quantity) }
          return updated
        } else {
          return [
            ...prev,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: Math.max(1, Math.min(20, Math.floor(quantity))),
              color: selectedColor,
              image: selectedImage,
              currency
            }
          ]
        }
      })
      setIsOpen(true)
    },
    []
  )

  const updateQuantity = useCallback((id: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, color)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.color === color ? { ...i, quantity: Math.max(1, Math.min(20, Math.floor(quantity))) } : i))
    )
  }, [])

  const removeItem = useCallback((id: string, color: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.color === color)))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = 0 // Free Express Cash on Delivery Nationwide
  const total = subtotal + shippingFee

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isOpen,
        setIsOpen,
        itemCount,
        subtotal,
        shippingFee,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
