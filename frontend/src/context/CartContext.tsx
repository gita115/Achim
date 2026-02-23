import { createContext, useContext, useEffect, useState } from "react"
import type { Image } from "../types/models"

type CartContextType = {
  items: Image[]
  addToCart: (image: Image) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  isInCart: (id: number) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: any) => {
  const [items, setItems] = useState<Image[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) setItems(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (image: Image) => {
    if (items.find(i => i.id === image.id)) return
    setItems([...items, image])
  }

  const removeFromCart = (id: number) => {
    setItems(items.filter(i => i.id !== id))
  }

  const clearCart = () => setItems([])

  const isInCart = (id: number) => {
    return items.some(i => i.id === id)
  }

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("CartProvider missing")
  return ctx
}
