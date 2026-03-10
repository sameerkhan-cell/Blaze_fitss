'use client'
// components/AuthModal.jsx

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthModal() {
  const { authModal, setAuthModal, login, register } = useAuth()
  const [tab, setTab]       = useState(authModal || 'login')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' })

  if (!authModal) return null

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const handleSubmit = async () => {
    setError(''); setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.email, form.password)
      } else {
        if (!form.name.trim())            return setError('Name is required')
        if (form.password !== form.confirm) return setError('Passwords do not match')
        if (form.password.length < 6)     return setError('Password must be at least 6 characters')
        await register(form.name, form.email, form.password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div className="auth-backdrop" onClick={e => e.target === e.currentTarget && setAuthModal(null)}>
      <div className="auth-modal">

        {/* Close */}
        <button className="auth-modal__close" onClick={() => setAuthModal(null)}>✕</button>

        {/* Logo */}
        <div className="auth-modal__logo">
          <span className="navbar__logo-text">BLAZE</span>
          <span className="navbar__logo-accent">FITSS</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === 'login' ? ' auth-tab--active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            LOGIN
          </button>
          <button
            className={`auth-tab${tab === 'signup' ? ' auth-tab--active' : ''}`}
            onClick={() => { setTab('signup'); setError('') }}
          >
            SIGN UP
          </button>
        </div>

        {/* Form */}
        <div className="auth-form">
          {tab === 'signup' && (
            <div className="checkout-field">
              <label>FULL NAME</label>
              <input
                type="text" placeholder="Muhammad Ali"
                value={form.name} onChange={e => set('name', e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
          )}

          <div className="checkout-field">
            <label>EMAIL</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => set('email', e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <div className="checkout-field">
            <label>PASSWORD</label>
            <input
              type="password" placeholder="Min. 6 characters"
              value={form.password} onChange={e => set('password', e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          {tab === 'signup' && (
            <div className="checkout-field">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password" placeholder="Repeat password"
                value={form.confirm} onChange={e => set('confirm', e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
          )}

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button
            className="checkout-submit-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? '...' : tab === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>

          <p className="auth-switch">
            {tab === 'login' ? (
              <>Don&apos;t have an account?{' '}
                <button onClick={() => { setTab('signup'); setError('') }}>Sign up</button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => { setTab('login'); setError('') }}>Login</button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
