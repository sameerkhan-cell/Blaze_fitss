// app/contact/page.jsx
'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setSent(true)
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="simple-page">
      <h1>Contact Us</h1>
      <p className="subtitle">WE&apos;D LOVE TO HEAR FROM YOU</p>

      {sent ? (
        <div style={{ maxWidth: 480, textAlign: 'center', padding: '2rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <p style={{ color: '#e8d5b7', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            MESSAGE SENT!
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            We&apos;ll get back to you within 24 hours.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
            style={{ marginTop: '1.5rem', background: 'none', border: '1px solid #2a2a2a', color: '#888', padding: '0.5rem 1.5rem', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer', letterSpacing: '0.1em' }}
          >
            SEND ANOTHER
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 480 }}>
          <div className="checkout-field">
            <label>NAME *</label>
            <input type="text" placeholder="Your name" required value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="checkout-field">
            <label>EMAIL *</label>
            <input type="email" placeholder="your@email.com" required value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="checkout-field">
            <label>SUBJECT *</label>
            <input type="text" placeholder="What is this about?" required value={form.subject} onChange={e => set('subject', e.target.value)} />
          </div>
          <div className="checkout-field">
            <label>MESSAGE *</label>
            <textarea
              placeholder="Your message..."
              style={{ minHeight: 120 }}
              required
              value={form.message}
              onChange={e => set('message', e.target.value)}
            />
          </div>

          {error && (
            <p style={{ color: '#f87171', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem' }}>✕ {error}</p>
          )}

          <button
            type="submit"
            className="checkout-submit-btn"
            disabled={loading}
            style={{ width: 'auto', padding: '0.8rem 2rem', marginTop: 0 }}
          >
            {loading ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      )}

      <h2 style={{ marginTop: '3rem' }}>Other Ways to Reach Us</h2>
      <p>📧 sameerkhan031181@gmail.com</p>
      <p>📞 +92 3118186132 (24 hours open)</p>
      <p>📍 Karachi, Pakistan</p>
    </div>
  )
}