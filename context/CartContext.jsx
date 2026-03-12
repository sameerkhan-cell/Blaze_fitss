'use client'
// context/CartContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart]               = useState({ items: [], total: 0 })
  const [cartOpen, setCartOpen]       = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [notification, setNotification] = useState('')
  const [loading, setLoading]         = useState(false)

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart')
      const json = await res.json()
      if (json.success) setCart(json.data)
    } catch (err) {
      console.error('fetchCart error:', err)
    }
  }, [])

  useEffect(() => { fetchCart() }, [fetchCart])

  const showNotification = (msg) => {
    setNotification(msg)
    setTimeout(() => setNotification(''), 3000)
  }

  const addToCart = async (productId, quantity = 1, size = null) => {
    setLoading(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity, size }),
      })
      const json = await res.json()
      if (json.success) {
        setCart(json.data)
        showNotification('Added to cart')
      }
    } catch (err) {
      console.error('addToCart error:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateItem = async (itemId, quantity) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      const json = await res.json()
      if (json.success) setCart(json.data)
    } catch (err) {
      console.error('updateItem error:', err)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) setCart(json.data)
    } catch (err) {
      console.error('removeItem error:', err)
    }
  }

  const placeOrder = async (customerData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      })
      const json = await res.json()
      if (json.success) {
        setCart({ items: [], total: 0 })
        setCheckoutOpen(false)
        showNotification(`Order ${json.data.order_number} placed!`)
        return json.data
      } else {
        throw new Error(json.error)
      }
    } catch (err) {
      console.error('placeOrder error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ✅ FIXED: single function — closes cart AND opens checkout atomically
  // Avoids the race condition where CartPanel unmounts before checkoutOpen=true takes effect
  const openCheckout = useCallback(() => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }, [])

  const cartCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0

  return (
    <CartContext.Provider value={{
      cart, cartCount, cartOpen, setCartOpen,
      checkoutOpen, setCheckoutOpen,
      openCheckout,
      notification, loading,
      addToCart, updateItem, removeItem, placeOrder,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}