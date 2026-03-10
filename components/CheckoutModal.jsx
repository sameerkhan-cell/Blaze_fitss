'use client'
// components/CheckoutModal.jsx

import { useState } from 'react'
import { useCart } from '../context/CartContext'

const initialForm = {
  name: '', email: '', phone: '',
  address: '', city: '', country: 'Pakistan',
  paymentMethod: 'cod', notes: '',
}

export default function CheckoutModal() {
  const { cart, checkoutOpen, setCheckoutOpen, placeOrder, loading } = useCart()
  const [form, setForm]     = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(null)

  if (!checkoutOpen) return null

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    if (!form.address.trim()) e.address = 'Address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    try {
      const order = await placeOrder(form)
      setSuccess(order)
      setForm(initialForm)
    } catch (err) {
      setErrors({ submit: err.message })
    }
  }

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="checkout-field">
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
      />
      {errors[name] && (
        <p style={{ color: '#ff6b6b', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', marginTop: '0.25rem' }}>
          {errors[name]}
        </p>
      )}
    </div>
  )

  return (
    <div className="checkout-backdrop" onClick={e => e.target === e.currentTarget && setCheckoutOpen(false)}>
      <div className="checkout-modal">
        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 300, marginBottom: '0.5rem' }}>Order Placed!</h2>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#e8d5b7', marginBottom: '0.5rem' }}>
              {success.order_number}
            </p>
            <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Thank you {success.customer_name}! We&apos;ll confirm your order shortly.
            </p>
            <button className="cart-panel__checkout-btn" onClick={() => setCheckoutOpen(false)}>
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <>
            <h2 className="checkout-modal__title">Checkout</h2>

            <div style={{ marginBottom: '1rem', padding: '1rem', background: '#0c0c0c', borderRadius: '6px' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#555', marginBottom: '0.5rem' }}>
                ORDER SUMMARY
              </p>
              {cart.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.2rem 0' }}>
                  <span style={{ color: '#888' }}>{item.name} × {item.quantity}</span>
                  <span style={{ color: '#e8d5b7', fontFamily: 'DM Mono, monospace' }}>
                    Rs{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #1e1e1e', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#666' }}>TOTAL</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', color: '#e8d5b7' }}>${cart.total?.toFixed(2)}</span>
              </div>
            </div>

            {field('name',  'FULL NAME *', 'text', 'Muhammad Ali')}
            {field('email', 'EMAIL *', 'email', 'you@example.com')}
            {field('phone', 'PHONE', 'tel', '+92 300 0000000')}
            {field('address', 'SHIPPING ADDRESS *', 'text', 'Street, Area')}

            <div className="checkout-row">
              {field('city',    'CITY',    'text', 'Karachi')}
              {field('country', 'COUNTRY', 'text', 'Pakistan')}
            </div>

            <div className="checkout-field">
              <label>PAYMENT METHOD</label>
              <select
                value={form.paymentMethod}
                onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="jazzcash">JazzCash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            <div className="checkout-field">
              <label>ORDER NOTES (optional)</label>
              <textarea
                placeholder="Any special instructions..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              />
            </div>

            {errors.submit && (
              <p style={{ color: '#ff6b6b', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                {errors.submit}
              </p>
            )}

            <button
              className="checkout-submit-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
            <button
              className="checkout-cancel-btn"
              onClick={() => setCheckoutOpen(false)}
            >
              CANCEL
            </button>
          </>
        )}
      </div>
    </div>
  )
}
