'use client'
// app/account/page.jsx

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
  const { user, logout, isLoggedIn, loading, setAuthModal } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      setAuthModal('login')
      router.push('/')
    }
  }, [loading, isLoggedIn])

  useEffect(() => {
    if (isLoggedIn) {
      setOrdersLoading(true)
      fetch('/api/orders/my')
        .then(r => r.json())
        .then(json => { if (json.success) setOrders(json.data) })
        .finally(() => setOrdersLoading(false))
    }
  }, [isLoggedIn])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (loading) return <div className="loading-wrap"><div className="loading-spinner" /></div>
  if (!user)   return null

  const statusColor = {
    pending:   '#f59e0b',
    confirmed: '#818cf8',
    shipped:   '#38bdf8',
    delivered: '#34d399',
    cancelled: '#f87171',
  }

  return (
    <div className="simple-page" style={{ maxWidth: 700 }}>
      {/* Profile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 300, marginBottom: '0.3rem' }}>
            Hello, {user.name.split(' ')[0]}
          </h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#555' }}>
            {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'none', border: '1px solid #2a2a2a', color: '#666',
            padding: '0.5rem 1.2rem', fontFamily: 'DM Mono, monospace',
            fontSize: '0.72rem', letterSpacing: '0.1em', borderRadius: '4px',
            cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
          }}
        >
          LOGOUT
        </button>
      </div>

      {/* Orders */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.5rem', color: '#e8d5b7' }}>
        My Orders
      </h2>

      {ordersLoading && <div className="loading-wrap"><div className="loading-spinner" /></div>}

      {!ordersLoading && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '1rem' }}>📦</div>
          <p style={{ fontFamily: 'DM Mono, monospace', color: '#444', fontSize: '0.8rem' }}>
            No orders yet
          </p>
          <a href="/" style={{ display: 'inline-block', marginTop: '1.5rem', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#e8d5b7', borderBottom: '1px solid #e8d5b7', paddingBottom: '2px' }}>
            START SHOPPING →
          </a>
        </div>
      )}

      {orders.map(order => (
        <div key={order.id} style={{
          background: '#111', border: '1px solid #1e1e1e',
          borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#e8d5b7' }}>
              {order.order_number}
            </span>
            <span style={{
              background: `${statusColor[order.status]}22`,
              color: statusColor[order.status],
              fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
              padding: '0.2rem 0.7rem', borderRadius: '20px', letterSpacing: '0.1em',
            }}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: '0.85rem' }}>
              {new Date(order.created_at).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', color: '#e8d5b7', fontSize: '1rem' }}>
              ${parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
