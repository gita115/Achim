import { createContext, useContext, useState } from "react"

const CartContext = createContext<any>(null)

export function CartProvider({ children }: any) {
  const [items, setItems] = useState<any[]>([])

  const addToCart = (image: any) => {
    if (!items.find(i => i.id === image.id))
      setItems([...items, image])
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
