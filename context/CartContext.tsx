import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description?: string
  category?: string
  color?: string
  stock?: number
  sizes?: string[]
}

export interface CartItem extends Product {
  quantity: number
  selectedSize?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    const savedCart = localStorage.getItem('xulerialcorte_cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[])
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('xulerialcorte_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart: CartItem[]) => {
      const existingItem = prevCart.find((item: CartItem) => item.id === product.id)
      
      if (existingItem) {
        return prevCart.map((item: CartItem) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      return [...prevCart, { ...product, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart: CartItem[]) => prevCart.filter((item: CartItem) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart((prevCart: CartItem[]) =>
      prevCart.map((item: CartItem) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem('xulerialcorte_cart')
  }

  const getTotalPrice = () => {
    return cart.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total: number, item: CartItem) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

