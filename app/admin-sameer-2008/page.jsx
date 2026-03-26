'use client'
 
import { useState, useEffect } from 'react'
 
const ADMIN_PASSWORD = 'sameerkhan123.'
 
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']
 
const TAG_COLORS = [
  { label: 'Gold',   value: '#e8d5b7' },
  { label: 'Green',  value: '#10b981' },
  { label: 'Red',    value: '#ef4444' },
  { label: 'Amber',  value: '#f59e0b' },
  { label: 'Purple', value: '#6366f1' },
  { label: 'Blue',   value: '#38bdf8' },
]
 
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Jerseys' },
  { id: 2, name: 'Football Shoes' },
  { id: 3, name: 'Footballs' },
  { id: 4, name: 'Shop for Kids' },
]
 
const emptyForm = {
  category_id: '', name: '', description: '', price: '',
  image_url: '', image_urls: '', tag: '', tag_color: '#10b981',
  rating: '4.5', review_count: '0', stock: '100',
  sizes: [],
}
 
function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
 
  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('bf_admin', '1')
        onLogin()
      } else {
        setError('Incorrect password')
        setLoading(false)
      }
    }, 600)
  }
 
  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, serif' }}>
      <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '3rem 2.5rem', width: '100%', maxWidth: 400, textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.3rem', fontWeight: 500, color: '#f0ece4', letterSpacing: '0.2em' }}>BLAZE</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#e8d5b7', letterSpacing: '0.4em' }}>FITSS</span>
          </div>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#444', letterSpacing: '0.2em' }}>ADMIN PANEL</p>
        </div>
        <div style={{ width: 60, height: 60, background: '#1e1e1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '1.5rem' }}>🔐</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 300, color: '#f0ece4', marginBottom: '0.5rem' }}>Welcome Back</h2>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#555', marginBottom: '2rem' }}>ENTER ADMIN PASSWORD TO CONTINUE</p>
        <div style={{ marginBottom: '1rem' }}>
          <input type="password" placeholder="Enter password..." value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ width: '100%', background: '#161616', border: `1px solid ${error ? '#ef4444' : '#2a2a2a'}`, borderRadius: '4px', color: '#f0ece4', padding: '0.8rem 1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', outline: 'none', textAlign: 'center', letterSpacing: '0.2em' }}
          />
          {error && <p style={{ color: '#f87171', fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', marginTop: '0.5rem' }}>✕ {error}</p>}
        </div>
        <button onClick={handleLogin} disabled={loading || !password}
          style={{ width: '100%', background: '#e8d5b7', border: 'none', color: '#0c0c0c', padding: '0.9rem', fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', letterSpacing: '0.2em', borderRadius: '4px', fontWeight: 500, cursor: loading ? 'wait' : 'pointer', opacity: !password ? 0.5 : 1, transition: 'opacity 0.2s' }}>
          {loading ? 'VERIFYING...' : 'LOGIN TO ADMIN'}
        </button>
      </div>
    </div>
  )
}
 
export default function AdminPage() {
  const [authed, setAuthed]               = useState(false)
  const [checking, setChecking]           = useState(true)
  const [tab, setTab]                     = useState('products')
  const [products, setProducts]           = useState([])
  const [orders, setOrders]               = useState([])
  const [categories, setCategories]       = useState(DEFAULT_CATEGORIES)
  const [loading, setLoading]             = useState(true)
  const [showForm, setShowForm]           = useState(false)
  const [editProduct, setEditProduct]     = useState(null)
  const [form, setForm]                   = useState(emptyForm)
  const [saving, setSaving]               = useState(false)
  const [message, setMessage]             = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [search, setSearch]               = useState('')
 
  useEffect(() => {
    const isAuthed = sessionStorage.getItem('bf_admin') === '1'
    setAuthed(isAuthed)
    setChecking(false)
  }, [])
 
  useEffect(() => { if (authed) loadAll() }, [authed])
 
  const loadAll = async () => {
    setLoading(true)
    try {
      const [pRes, oRes, cRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/orders'),
        fetch('/api/admin/categories'),
      ])
      const [p, o, c] = await Promise.all([pRes.json(), oRes.json(), cRes.json()])
      if (p.success) setProducts(p.data)
      if (o.success) setOrders(o.data)
      if (c.success && c.data?.length > 0) setCategories(c.data)
      else setCategories(DEFAULT_CATEGORIES)
    } catch {
      showMsg('Failed to load data', 'error')
      setCategories(DEFAULT_CATEGORIES)
    } finally {
      setLoading(false)
    }
  }
 
  const handleLogout = () => { sessionStorage.removeItem('bf_admin'); setAuthed(false) }
 
  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(''), 5000)
  }
 
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openAdd = () => { setEditProduct(null); setForm(emptyForm); setShowForm(true) }
 
  const openEdit = (product) => {
    setEditProduct(product)
    setForm({
      category_id:  product.category_id,
      name:         product.name,
      description:  product.description || '',
      price:        product.price,
      image_url:    product.image_url || '',
      image_urls:   product.image_urls || '',
      tag:          product.tag || '',
      tag_color:    product.tag_color || '#e8d5b7',
      rating:       product.rating,
      review_count: product.review_count,
      stock:        product.stock,
      sizes: product.sizes
        ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : [],
    })
    setShowForm(true)
  }
 
  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter(s => s !== size)
        : [...f.sizes, size],
    }))
  }
 
  const handleSave = async () => {
    if (saving) return
    if (!form.name.trim())              return showMsg('Product name is required', 'error')
    if (!form.category_id)              return showMsg('Please select a category', 'error')
    if (!form.price || form.price <= 0) return showMsg('Valid price is required', 'error')
    setSaving(true)
    try {
      const url    = editProduct ? `/api/admin/products/${editProduct.id}` : '/api/admin/products'
      const method = editProduct ? 'PUT' : 'POST'
      const payload = { ...form, sizes: form.sizes.join(',') }
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      if (editProduct) {
        setProducts(prev => prev.map(p => p.id === editProduct.id ? json.data : p))
        showMsg('Product updated!')
      } else {
        setProducts(prev => prev.some(p => p.id === json.data.id) ? prev : [json.data, ...prev])
        showMsg('Product added!')
      }
      setShowForm(false)
    } catch (e) {
      showMsg(e.message, 'error')
    } finally {
      setSaving(false)
    }
  }
 
  const handleDelete = async (id) => {
    try {
      const res  = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setProducts(prev => prev.filter(p => p.id !== id))
      setDeleteConfirm(null)
      showMsg('Product deleted')
    } catch (e) { showMsg(e.message, 'error') }
  }
 
  const handleOrderStatus = async (orderId, status) => {
    try {
      const res  = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
      showMsg('Order status updated!')
    } catch (e) { showMsg(e.message, 'error') }
  }
 
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(search.toLowerCase())
  )
 
  if (checking) return null
  if (!authed)  return <AdminLogin onLogin={() => setAuthed(true)} />
 
  const s = {
    page:  { minHeight: '100vh', background: '#0c0c0c', color: '#f0ece4', fontFamily: 'Cormorant Garamond, serif', padding: '1rem' },
    header:{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #1e1e1e', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
    tabs:  { display: 'flex', gap: '0.25rem', marginBottom: '2rem' },
    tab:   (a) => ({ background: 'none', border: 'none', borderBottom: `2px solid ${a ? '#e8d5b7' : 'transparent'}`, color: a ? '#e8d5b7' : '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.15em', padding: '0.5rem 1rem 0.3rem', cursor: 'pointer' }),
    btn:   (v = 'primary') => ({ background: v === 'primary' ? '#e8d5b7' : v === 'danger' ? '#ef4444' : 'none', border: v === 'ghost' ? '1px solid #2a2a2a' : 'none', color: v === 'primary' ? '#0c0c0c' : v === 'danger' ? '#fff' : '#888', padding: '0.5rem 1.2rem', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.1em', borderRadius: '4px', cursor: 'pointer', fontWeight: v === 'primary' ? 500 : 400 }),
    table: { width: '100%', borderCollapse: 'collapse' },
    th:    { fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#444', padding: '0.75rem 1rem', borderBottom: '1px solid #1e1e1e', textAlign: 'left' },
    td:    { padding: '0.9rem 1rem', borderBottom: '1px solid #111', verticalAlign: 'middle' },
    input: { width: '100%', background: '#161616', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#f0ece4', padding: '0.6rem 0.9rem', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', outline: 'none' },
    label: { display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#555', marginBottom: '0.35rem' },
    field: { marginBottom: '1rem' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  }
 
  const extraImagePreviews = form.image_urls
    ? form.image_urls.split('\n').map(u => u.trim()).filter(Boolean)
    : []
 
  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 300 }}>Admin Panel</h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#555', marginTop: '0.25rem' }}>BLAZE FITSS — Store Management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="/" style={{ ...s.btn('ghost'), display: 'inline-block', textDecoration: 'none', padding: '0.5rem 1rem' }}>← STORE</a>
          <button style={s.btn('ghost')} onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>
 
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Products', value: products.length, color: '#e8d5b7' },
          { label: 'Total Orders',   value: orders.length,   color: '#818cf8' },
          { label: 'Pending',        value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
          { label: 'Revenue',        value: `Rs ${orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + parseFloat(o.total_amount || 0), 0).toFixed(0)}`, color: '#34d399' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#444', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>{stat.label.toUpperCase()}</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 300, color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>
 
      <div style={s.tabs}>
        {['products', 'orders'].map(t => (
          <button key={t} style={s.tab(tab === t)} onClick={() => setTab(t)}>{t.toUpperCase()}</button>
        ))}
      </div>
 
      {message && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', background: message.type === 'error' ? '#ef4444' : '#e8d5b7', color: '#0c0c0c', padding: '0.75rem 1.5rem', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', borderRadius: '4px', zIndex: 999, whiteSpace: 'nowrap' }}>
          {message.type === 'error' ? '✕' : '✓'} {message.text}
        </div>
      )}
 
      {loading && <div style={{ textAlign: 'center', padding: '4rem', color: '#444', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem' }}>Loading...</div>}
 
      {!loading && tab === 'products' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
            <input style={{ ...s.input, maxWidth: 260 }} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            <button style={s.btn('primary')} onClick={openAdd}>+ ADD PRODUCT</button>
          </div>
 
          {showForm && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 300 }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>
 
                <div style={s.field}>
                  <label style={s.label}>CATEGORY *</label>
                  <select value={form.category_id} onChange={e => set('category_id', e.target.value)} style={{ ...s.input, appearance: 'none' }}>
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
 
                <div style={s.field}>
                  <label style={s.label}>PRODUCT NAME *</label>
                  <input style={s.input} placeholder="e.g. Argentina Home 2026" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
 
                <div style={s.field}>
                  <label style={s.label}>MAIN IMAGE URL</label>
                  <input style={s.input} placeholder="/images/products/jersey1.webp" value={form.image_url} onChange={e => set('image_url', e.target.value)} />
                  {form.image_url && (
                    <img src={form.image_url} alt="preview" style={{ width: 64, height: 80, objectFit: 'cover', borderRadius: 4, marginTop: 8 }} onError={e => e.target.style.display = 'none'} />
                  )}
                </div>
 
                <div style={s.field}>
                  <label style={s.label}>EXTRA IMAGES (one path per line)</label>
                  <textarea style={{ ...s.input, minHeight: 90, resize: 'vertical', fontSize: '0.82rem' }}
                    placeholder={'/images/products/jersey1-back.webp\n/images/products/jersey1-detail.webp'}
                    value={form.image_urls || ''} onChange={e => set('image_urls', e.target.value)} />
                  {extraImagePreviews.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {extraImagePreviews.map((url, i) => (
                        <img key={i} src={url} alt={`extra-${i}`} style={{ width: 52, height: 64, objectFit: 'cover', borderRadius: 4, border: '1px solid #2a2a2a' }} onError={e => e.target.style.display = 'none'} />
                      ))}
                    </div>
                  )}
                </div>
 
                <div style={s.field}>
                  <label style={s.label}>DESCRIPTION</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description..." style={{ ...s.input, minHeight: 80, resize: 'vertical' }} />
                </div>
 
                <div style={s.grid2}>
                  <div style={s.field}>
                    <label style={s.label}>PRICE (Rs) *</label>
                    <input style={s.input} type="number" step="0.01" min="0" placeholder="1800" value={form.price} onChange={e => set('price', e.target.value)} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>STOCK</label>
                    <input style={s.input} type="number" min="0" placeholder="100" value={form.stock} onChange={e => set('stock', e.target.value)} />
                  </div>
                </div>
 
                {/* ── SIZES SELECTOR ── */}
                <div style={s.field}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ ...s.label, margin: 0 }}>AVAILABLE SIZES</label>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button type="button" onClick={() => setForm(f => ({ ...f, sizes: [...ALL_SIZES] }))}
                        style={{ background: 'none', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#e8d5b7', cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                        SELECT ALL
                      </button>
                      <button type="button" onClick={() => setForm(f => ({ ...f, sizes: [] }))}
                        style={{ background: 'none', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#555', cursor: 'pointer', letterSpacing: '0.1em', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                        CLEAR
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {ALL_SIZES.map(size => {
                      const active = form.sizes.includes(size)
                      return (
                        <button key={size} type="button" onClick={() => toggleSize(size)}
                          style={{
                            width: 50, height: 50, position: 'relative',
                            border: `1.5px solid ${active ? '#e8d5b7' : '#2a2a2a'}`,
                            borderRadius: 8,
                            background: active ? 'rgba(232,213,183,0.12)' : '#0e0e0e',
                            color: active ? '#e8d5b7' : '#444',
                            fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}>
                          {size}
                          {active && (
                            <span style={{ position: 'absolute', top: 2, right: 4, fontSize: '0.48rem', color: '#e8d5b7', lineHeight: 1 }}>✓</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: '#3a3a3a', marginTop: '0.5rem', letterSpacing: '0.08em' }}>
                    {form.sizes.length === 0
                      ? 'No sizes selected — all sizes shown as unavailable on product page'
                      : `Selected (${form.sizes.length}): ${form.sizes.join(', ')}`}
                  </p>
                </div>
 
                <div style={s.grid2}>
                  <div style={s.field}>
                    <label style={s.label}>BADGE TAG</label>
                    <input style={s.input} placeholder="NEW, SALE, HOT" value={form.tag} onChange={e => set('tag', e.target.value.toUpperCase())} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>TAG COLOR</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {TAG_COLORS.map(tc => (
                        <button key={tc.value} onClick={() => set('tag_color', tc.value)} title={tc.label}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: tc.value, border: form.tag_color === tc.value ? '3px solid #fff' : '2px solid transparent', cursor: 'pointer' }} />
                      ))}
                    </div>
                  </div>
                </div>
 
                <div style={s.grid2}>
                  <div style={s.field}>
                    <label style={s.label}>RATING (0–5)</label>
                    <input style={s.input} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>REVIEW COUNT</label>
                    <input style={s.input} type="number" min="0" value={form.review_count} onChange={e => set('review_count', e.target.value)} />
                  </div>
                </div>
 
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button style={{ ...s.btn('primary'), flex: 1, padding: '0.85rem' }} onClick={handleSave} disabled={saving}>
                    {saving ? 'SAVING...' : editProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
                  </button>
                  <button style={{ ...s.btn('ghost'), padding: '0.85rem 1.5rem' }} onClick={() => setShowForm(false)}>CANCEL</button>
                </div>
              </div>
            </div>
          )}
 
          {deleteConfirm && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '2rem', maxWidth: 360, textAlign: 'center' }}>
                <p style={{ fontSize: '1.4rem', fontWeight: 300, marginBottom: '0.5rem' }}>Delete Product?</p>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#666', marginBottom: '1.5rem' }}>"{deleteConfirm.name}" will be permanently removed.</p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button style={s.btn('danger')} onClick={() => handleDelete(deleteConfirm.id)}>DELETE</button>
                  <button style={s.btn('ghost')} onClick={() => setDeleteConfirm(null)}>CANCEL</button>
                </div>
              </div>
            </div>
          )}
 
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr style={{ background: '#0e0e0e' }}>
                  {['Images','Product','Category','Price','Stock','Sizes','Tag','Rating','Actions'].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan={9} style={{ ...s.td, textAlign: 'center', color: '#444', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', padding: '3rem' }}>
                    {search ? 'No products match your search' : 'No products yet — click Add Product'}
                  </td></tr>
                ) : filteredProducts.map(product => {
                  const extras   = product.image_urls ? product.image_urls.split('\n').map(u => u.trim()).filter(Boolean) : []
                  const sizesArr = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
                  return (
                    <tr key={product.id} onMouseEnter={e => e.currentTarget.style.background = '#161616'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {product.image_url
                            ? <img src={product.image_url} alt={product.name} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 4, border: '2px solid #e8d5b7' }} onError={e => e.target.style.display = 'none'} />
                            : <div style={{ width: 40, height: 50, background: '#1e1e1e', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>📷</div>
                          }
                          {extras.slice(0, 2).map((url, i) => (
                            <img key={i} src={url} alt={`extra-${i}`} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #2a2a2a' }} onError={e => e.target.style.display = 'none'} />
                          ))}
                          {extras.length > 2 && (
                            <div style={{ width: 40, height: 50, background: '#1e1e1e', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#666' }}>+{extras.length - 2}</div>
                          )}
                        </div>
                      </td>
                      <td style={s.td}>
                        <p style={{ fontWeight: 400, marginBottom: '0.2rem' }}>{product.name}</p>
                        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#555' }}>ID: {product.id}</p>
                      </td>
                      <td style={{ ...s.td, fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#777' }}>{product.category_name}</td>
                      <td style={{ ...s.td, fontFamily: 'DM Mono, monospace', fontSize: '0.9rem', color: '#e8d5b7' }}>Rs {parseFloat(product.price).toFixed(0)}</td>
                      <td style={{ ...s.td, fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: product.stock < 10 ? '#f87171' : '#888' }}>{product.stock}</td>
                      <td style={s.td}>
                        {sizesArr.length > 0 ? (
                          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            {sizesArr.map(sz => (
                              <span key={sz} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', background: '#1e1e1e', color: '#e8d5b7', padding: '2px 6px', borderRadius: 3, border: '1px solid #2a2a2a' }}>{sz}</span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#333', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem' }}>none</span>
                        )}
                      </td>
                      <td style={s.td}>
                        {product.tag
                          ? <span style={{ background: product.tag_color || '#e8d5b7', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: 3, fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', fontWeight: 600 }}>{product.tag}</span>
                          : <span style={{ color: '#333' }}>—</span>}
                      </td>
                      <td style={{ ...s.td, fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#888' }}>★ {parseFloat(product.rating).toFixed(1)}</td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button style={{ ...s.btn('ghost'), padding: '0.3rem 0.7rem', fontSize: '0.65rem' }} onClick={() => openEdit(product)}>EDIT</button>
                          <button style={{ ...s.btn('ghost'), padding: '0.3rem 0.7rem', fontSize: '0.65rem', color: '#f87171', borderColor: '#3a1e1e' }} onClick={() => setDeleteConfirm(product)}>DEL</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
 
      {!loading && tab === 'orders' && (
        <div>
          {orders.length === 0
            ? <div style={{ textAlign: 'center', padding: '4rem', color: '#444', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem' }}>No orders yet</div>
            : orders.map(order => <OrderCard key={order.id} order={order} onStatusChange={handleOrderStatus} />)
          }
        </div>
      )}
    </div>
  )
}
 
function OrderCard({ order, onStatusChange }) {
  const [expanded, setExpanded] = useState(false)
  const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#818cf8', shipped: '#38bdf8', delivered: '#34d399', cancelled: '#f87171' }
  const mono = { fontFamily: 'DM Mono, monospace' }
 
  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', marginBottom: '0.75rem', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.2rem', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ ...mono, fontSize: '0.72rem', color: '#e8d5b7' }}>{order.order_number}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ ...mono, fontSize: '0.58rem', color: '#444' }}>
              {new Date(order.created_at).toLocaleDateString('en-PK', { dateStyle: 'medium' })}
            </span>
            <span style={{ ...mono, fontSize: '0.75rem', color: '#555' }}>{expanded ? '▲' : '▼'}</span>
          </div>
        </div>
        <div style={{ marginBottom: '0.6rem' }}>
          <p style={{ fontSize: '0.95rem', color: '#f0ece4', margin: '0 0 0.2rem' }}>{order.customer_name}</p>
          <p style={{ ...mono, fontSize: '0.6rem', color: '#555', margin: 0 }}>{order.customer_email}</p>
          {order.customer_phone && <p style={{ ...mono, fontSize: '0.6rem', color: '#555', margin: 0 }}>{order.customer_phone}</p>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{ ...mono, color: '#e8d5b7', fontSize: '0.9rem' }}>Rs {parseFloat(order.total_amount).toFixed(0)}</span>
          <span style={{ display: 'inline-block', padding: '0.2rem 0.7rem', borderRadius: '20px', ...mono, fontSize: '0.62rem', background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status] }}>
            {order.status?.toUpperCase()}
          </span>
          <span style={{ ...mono, fontSize: '0.65rem', color: '#555' }}>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
          <span style={{ ...mono, fontSize: '0.65rem', color: '#666', textTransform: 'uppercase' }}>{order.payment_method}</span>
        </div>
        <div onClick={e => e.stopPropagation()}>
          <p style={{ ...mono, fontSize: '0.6rem', color: '#444', letterSpacing: '0.1em', margin: '0 0 0.3rem' }}>UPDATE STATUS</p>
          <select value={order.status} onChange={e => onStatusChange(order.id, e.target.value)}
            style={{ background: '#161616', border: '1px solid #2a2a2a', color: '#e8d5b7', padding: '0.5rem 0.8rem', ...mono, fontSize: '0.72rem', borderRadius: '4px', outline: 'none', cursor: 'pointer', width: '100%', maxWidth: 280 }}>
            {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(st => (
              <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid #1e1e1e', padding: '1.5rem 1.2rem', background: '#0e0e0e' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ ...mono, fontSize: '0.62rem', color: '#444', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>CUSTOMER DETAILS</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <Detail label="Name"    value={order.customer_name} />
                <Detail label="Email"   value={order.customer_email} />
                <Detail label="Phone"   value={order.customer_phone || '—'} />
                <Detail label="Payment" value={order.payment_method?.toUpperCase()} />
              </div>
            </div>
            <div>
              <p style={{ ...mono, fontSize: '0.62rem', color: '#444', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>SHIPPING ADDRESS</p>
              <p style={{ fontSize: '0.9rem', color: '#aaa', lineHeight: 1.6 }}>
                {[order.shipping_address, order.city, order.country].filter(Boolean).join(', ') || '—'}
              </p>
              {order.notes && (
                <div style={{ marginTop: '0.75rem' }}>
                  <p style={{ ...mono, fontSize: '0.62rem', color: '#444', marginBottom: '0.3rem' }}>ORDER NOTES</p>
                  <p style={{ fontSize: '0.88rem', color: '#777', fontStyle: 'italic' }}>{order.notes}</p>
                </div>
              )}
            </div>
          </div>
          <p style={{ ...mono, fontSize: '0.62rem', color: '#444', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>ORDER ITEMS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {order.items?.length > 0 ? order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', borderRadius: '6px', padding: '0.75rem 1rem' }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.product_name} style={{ width: 40, height: 50, objectFit: 'cover', borderRadius: 4 }} onError={e => e.target.style.display = 'none'} />
                  : <div style={{ width: 40, height: 50, background: '#1e1e1e', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.95rem', color: '#f0ece4', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product_name}</p>
                  {item.size && <p style={{ ...mono, fontSize: '0.62rem', color: '#666', margin: 0 }}>Size: {item.size}</p>}
                </div>
                <div style={{ ...mono, fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap' }}>x{item.quantity}</div>
                <div style={{ ...mono, fontSize: '0.82rem', color: '#e8d5b7', whiteSpace: 'nowrap' }}>Rs {(parseFloat(item.price) * item.quantity).toFixed(0)}</div>
              </div>
            )) : <p style={{ ...mono, fontSize: '0.72rem', color: '#444' }}>No items found</p>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #1e1e1e' }}>
            <p style={{ ...mono, fontSize: '0.9rem', color: '#e8d5b7' }}>TOTAL: <strong>Rs {parseFloat(order.total_amount).toFixed(0)}</strong></p>
          </div>
        </div>
      )}
    </div>
  )
}
 
function Detail({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#555', minWidth: 55 }}>{label}:</span>
      <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{value}</span>
    </div>
  )
}