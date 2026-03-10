'use client'
// app/track-order/page.jsx

import { useState } from 'react'

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setLoading(true); setError(''); setOrder(null)
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber.trim())}`)
      const json = await res.json()
      if (json.success) setOrder(json.data)
      else setError('Order not found. Please check your order number.')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusClass = (s) => `order-result__status order-result__status--${s}`

  return (
    <div className="track-page">
      <h1 className="track-page__title">Track Order</h1>
      <p className="track-page__sub">ENTER YOUR ORDER NUMBER BELOW</p>

      <form className="track-form" onSubmit={handleTrack}>
        <input
          className="track-form__input"
          placeholder="e.g. BF-1234567890-123"
          value={orderNumber}
          onChange={e => setOrderNumber(e.target.value)}
        />
        <button type="submit" className="track-form__btn" disabled={loading}>
          {loading ? '...' : 'TRACK'}
        </button>
      </form>

      {error && (
        <p style={{ fontFamily: 'DM Mono, monospace', color: '#ff6b6b', fontSize: '0.8rem', marginBottom: '1rem' }}>
          {error}
        </p>
      )}

      {order && (
        <div className="order-result">
          <p className="order-result__number">{order.order_number}</p>
          <span className={statusClass(order.status)}>{order.status.toUpperCase()}</span>

          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#555', marginBottom: '0.5rem' }}>
              CUSTOMER
            </p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>{order.customer_name} · {order.customer_email}</p>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem' }}>{order.shipping_address}, {order.city}</p>
          </div>

          {order.items?.length > 0 && (
            <div className="order-result__items">
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#555', margin: '1rem 0 0.5rem' }}>
                ITEMS
              </p>
              {order.items.map((item, i) => (
                <div key={i} className="order-result__item">
                  <span style={{ color: '#888' }}>{item.product_name} × {item.quantity}</span>
                  <span style={{ color: '#e8d5b7', fontFamily: 'DM Mono, monospace' }}>
                    Rs{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="order-result__total">
            <span style={{ color: '#666' }}>TOTAL</span>
            <span style={{ color: '#e8d5b7' }}>${parseFloat(order.total_amount).toFixed(2)}</span>
          </div>

          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#444', marginTop: '1rem' }}>
            Placed: {new Date(order.created_at).toLocaleDateString('en-PK', { dateStyle: 'long' })}
          </p>
        </div>
      )}
    </div>
  )
}
