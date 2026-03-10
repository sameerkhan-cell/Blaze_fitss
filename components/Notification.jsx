'use client'
// components/Notification.jsx

import { useCart } from '../context/CartContext'

export default function Notification() {
  const { notification } = useCart()
  if (!notification) return null

  return (
    <div className="store-notification" role="status" aria-live="polite">
      ✓ {notification}
    </div>
  )
}
