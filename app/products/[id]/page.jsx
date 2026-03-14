'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '../../../context/CartContext'

// ── Size chart data from uploaded images ──────────────────────────────────────
const SIZE_CHART = [
  { size: 'S',   shoulder: '—',      length: '26"', chest: '19"' },
  { size: 'M',   shoulder: '17½"',   length: '28"', chest: '19"' },
  { size: 'L',   shoulder: '18½"',   length: '29"', chest: '20"' },
  { size: 'XL',  shoulder: '—',      length: '29"', chest: '22"' },
  { size: 'XXL', shoulder: '—',      length: '30"', chest: '23"' },
  { size: '3XL', shoulder: '—',      length: '30"', chest: '24"' },
  { size: '4XL', shoulder: '—',      length: '30"', chest: '25"' },
]

function SizeChartModal({ onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#111', border: '1px solid #2a2a2a', borderRadius: 12,
        width: '100%', maxWidth: 520, overflow: 'hidden',
        animation: 'scaleIn 0.2s cubic-bezier(0.34,1.4,0.64,1) forwards',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e1e1e' }}>
          <div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', margin: '0 0 4px' }}>BLAZE FITSS</p>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 300, color: '#f0ece4' }}>Size Chart</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #2a2a2a', color: '#888', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Unit note */}
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.15em', color: '#555', textAlign: 'center', padding: '0.75rem 1.5rem 0', margin: 0 }}>
          All measurements in inches (W = Width / Chest, L = Length)
        </p>

        {/* Table */}
        <div style={{ padding: '1rem 1.5rem 1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0c0c0c' }}>
                {['Size', 'Chest (W)', 'Length (L)', 'Shoulder'].map(h => (
                  <th key={h} style={{
                    padding: '10px 14px', textAlign: 'center',
                    fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#555', fontWeight: 400, borderBottom: '1px solid #1e1e1e',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row, i) => (
                <tr key={row.size} style={{ background: i % 2 === 0 ? '#0f0f0f' : '#111' }}>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', fontWeight: 600, color: '#e8d5b7', borderBottom: '1px solid #181818' }}>
                    {row.size}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: '#aaa', borderBottom: '1px solid #181818' }}>
                    {row.chest}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: '#aaa', borderBottom: '1px solid #181818' }}>
                    {row.length}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: row.shoulder === '—' ? '#333' : '#aaa', borderBottom: '1px solid #181818' }}>
                    {row.shoulder}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <div style={{ margin: '0 1.5rem 1.5rem', padding: '0.85rem 1rem', background: '#0c0c0c', border: '1px solid #1e1e1e', borderRadius: 8 }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.12em', color: '#555', margin: 0, lineHeight: 1.7 }}>
            💡 TIP — If between sizes, size up for a relaxed fit or size down for a slim fit. Chest measurement is half-chest (multiply × 2 for full chest).
          </p>
        </div>
      </div>

      <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(0.94); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  )
}

export default function ProductDetailPage() {
  const { id }    = useParams()
  const router    = useRouter()
  const { addToCart, loading: cartLoading } = useCart()

  const [product,       setProduct]       = useState(null)
  const [related,       setRelated]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState('')
  const [activeImg,     setActiveImg]     = useState(0)
  const [qty,           setQty]           = useState(1)
  const [selectedSize,  setSelectedSize]  = useState('')
  const [added,         setAdded]         = useState(false)
  const [sizeChartOpen, setSizeChartOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(json => {
        if (!json.success) throw new Error('Product not found')
        setProduct(json.data)
        setActiveImg(0)
        return fetch(`/api/categories/${json.data.category_slug}/products`)
      })
      .then(r => r.json())
      .then(json => {
        if (json.success) setRelated(json.data.filter(p => p.id !== parseInt(id)).slice(0, 4))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    for (let i = 0; i < qty; i++) await addToCart(product.id, 1, selectedSize || null)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const getImages = () => {
    if (!product) return []
    const imgs = []
    if (product.image_url?.trim()) imgs.push(product.image_url.trim())
    if (product.image_urls?.trim()) {
      product.image_urls.split('\n')
        .map(u => u.trim())
        .filter(u => u && !imgs.includes(u))
        .forEach(u => imgs.push(u))
    }
    return imgs
  }

  const prev = () => setActiveImg(i => (i - 1 + images.length) % images.length)
  const next = () => setActiveImg(i => (i + 1) % images.length)

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loading-wrap">
        <div className="loading-spinner" />
        <p className="loading-text">Loading product...</p>
      </div>
    </div>
  )

  if (error || !product) return (
    <div style={{ maxWidth: 500, margin: '5rem auto', padding: '0 2rem', textAlign: 'center' }}>
      <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</p>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '0.5rem' }}>Product not found</h1>
      <button onClick={() => router.back()} style={{ background: 'none', border: '1px solid #2a2a2a', color: '#888', padding: '0.5rem 1.2rem', fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', borderRadius: '4px', cursor: 'pointer' }}>← GO BACK</button>
    </div>
  )

  const images = getImages()
  // ✅ Parse available sizes from product DB field (comma-separated)
  const availableSizes = product.sizes
    ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
    : []
  return (
    <div style={{ minHeight: '100vh', maxWidth: 1400, margin: '0 auto', padding: '2rem' }}>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '2rem', fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#555' }}>
        <a href="/" style={{ color: '#555', textDecoration: 'none' }}>Home</a>
        <span>/</span>
        <a href={`/${product.category_slug}`} style={{ color: '#555', textDecoration: 'none' }}>{product.category_name}</a>
        <span>/</span>
        <span style={{ color: '#888' }}>{product.name}</span>
      </nav>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '5rem' }} className="product-detail-grid">

        {/* LEFT — Image gallery */}
        <div>
          <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', background: '#111', border: '1px solid #1e1e1e', marginBottom: '1rem', aspectRatio: '3/4' }}>
            {images.length > 0 ? (
              <img src={images[activeImg]} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.3s' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', opacity: 0.2 }}>📷</div>
            )}

            {product.tag && (
              <span style={{ position: 'absolute', top: 16, left: 16, background: product.tag_color || '#e8d5b7', color: '#fff', padding: '0.25rem 0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em', fontWeight: 600, borderRadius: 4 }}>
                {product.tag}
              </span>
            )}

            {images.length > 1 && (
              <>
                <button onClick={prev} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ece4', width: 40, height: 40, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(232,213,183,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.55)'}>‹</button>
                <button onClick={next} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ece4', width: 40, height: 40, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(232,213,183,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0.55)'}>›</button>
                <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} style={{ width: i === activeImg ? 20 : 8, height: 8, borderRadius: 4, background: i === activeImg ? '#e8d5b7' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.25s' }} />
                  ))}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{ width: 72, height: 90, borderRadius: 6, overflow: 'hidden', border: `2px solid ${activeImg === i ? '#e8d5b7' : '#2a2a2a'}`, background: '#111', padding: 0, cursor: 'pointer', transition: 'border-color 0.2s', opacity: activeImg === i ? 1 : 0.6 }}>
                  <img src={img} alt={`View ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Product info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href={`/${product.category_slug}`} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.2em', color: '#e8d5b7', textDecoration: 'none' }}>
              {product.category_name.toUpperCase()}
            </a>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#888' }}>
              ★ {parseFloat(product.rating).toFixed(1)} ({product.review_count} reviews)
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, lineHeight: 1.1, color: '#f0ece4' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 300, color: '#e8d5b7' }}>
              Rs {parseFloat(product.price).toFixed(0)}
            </span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: product.stock > 0 ? '#34d399' : '#f87171' }}>
              {product.stock > 10 ? 'IN STOCK' : product.stock > 0 ? `ONLY ${product.stock} LEFT` : 'OUT OF STOCK'}
            </span>
          </div>

          {product.description && (
            <p style={{ color: '#888', lineHeight: 1.8, fontSize: '1rem' }}>{product.description}</p>
          )}

          <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* ── SIZE SELECTOR ── */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.15em', color: '#555', margin: 0 }}>
                  SIZE {selectedSize && <span style={{ color: '#e8d5b7', marginLeft: 8 }}>— {selectedSize}</span>}
                </p>
                <button onClick={() => setSizeChartOpen(true)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
                  letterSpacing: '0.15em', color: '#e8d5b7',
                  textDecoration: 'underline', textUnderlineOffset: 3, padding: 0,
                }}>
                  SIZE CHART
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {SIZE_CHART.map(({ size: s }) => {
                  const avail    = availableSizes.includes(s)
                  const selected = selectedSize === s
                  return (
                    <button key={s}
                      onClick={() => avail && setSelectedSize(s === selected ? '' : s)}
                      disabled={!avail}
                      title={avail ? s : `${s} — not available`}
                      style={{
                        width: 46, height: 46, position: 'relative',
                        border: `1.5px solid ${selected ? '#e8d5b7' : avail ? '#2a2a2a' : '#181818'}`,
                        borderRadius: 6, overflow: 'hidden',
                        background: selected ? 'rgba(232,213,183,0.1)' : 'transparent',
                        color: selected ? '#e8d5b7' : avail ? '#666' : '#2a2a2a',
                        fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                        cursor: avail ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { if (avail && !selected) { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#aaa' }}}
                      onMouseLeave={e => { if (avail && !selected) { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666' }}}>
                      {s}
                      {!avail && (
                        <svg viewBox="0 0 46 46" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                          <line x1="6" y1="40" x2="40" y2="6" stroke="#2a2a2a" strokeWidth="1.5" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
              {availableSizes.length > 0 && (
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: '#333', marginTop: '0.4rem', letterSpacing: '0.08em' }}>
                  Crossed-out sizes are not available for this product
                </p>
              )}
            </div>

            {/* ── QUANTITY ── */}
            <div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.15em', color: '#555', marginBottom: '0.6rem' }}>QUANTITY</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ background: 'none', border: '1px solid #2a2a2a', color: '#888', width: 38, height: 38, fontSize: '1.1rem', borderRadius: '4px', cursor: 'pointer' }}>−</button>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', minWidth: 30, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ background: 'none', border: '1px solid #2a2a2a', color: '#888', width: 38, height: 38, fontSize: '1.1rem', borderRadius: '4px', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            {/* ── ADD TO CART ── */}
            <button onClick={handleAddToCart}
              disabled={cartLoading || product.stock === 0 || added}
              style={{
                width: '100%', padding: '1.1rem', border: 'none',
                fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', letterSpacing: '0.2em',
                background: added ? '#34d399' : '#e8d5b7', color: '#0c0c0c',
                borderRadius: '4px', fontWeight: 500, cursor: 'pointer',
                transition: 'background 0.3s',
                opacity: (cartLoading || product.stock === 0) ? 0.5 : 1,
              }}>
              {added ? '✓ ADDED TO CART' : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>

            {/* ── INLINE SIZE CHART (compact) ── */}
            <div style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', borderBottom: '1px solid #1a1a1a' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', margin: 0 }}>
                  📏 Size Guide
                </p>
                <button onClick={() => setSizeChartOpen(true)} style={{ background: 'none', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', color: '#e8d5b7', cursor: 'pointer', letterSpacing: '0.1em' }}>
                  FULL CHART →
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                  <thead>
                    <tr>
                      {['Size', 'Chest', 'Length'].map(h => (
                        <th key={h} style={{ padding: '7px 10px', fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.12em', color: '#444', fontWeight: 400, textAlign: 'center', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_CHART.map((row, i) => {
                      const avail    = availableSizes.includes(row.size)
                      const selected = selectedSize === row.size
                      return (
                        <tr key={row.size}
                          onClick={() => avail && setSelectedSize(row.size)}
                          style={{
                            background: selected ? 'rgba(232,213,183,0.07)' : i % 2 === 0 ? '#0a0a0a' : '#0e0e0e',
                            cursor: avail ? 'pointer' : 'not-allowed',
                            opacity: avail ? 1 : 0.35,
                            transition: 'background 0.15s',
                          }}>
                          <td style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: selected ? '#e8d5b7' : avail ? '#888' : '#444', borderBottom: '1px solid #141414' }}>
                            {avail ? row.size : <span style={{ textDecoration: 'line-through' }}>{row.size}</span>}
                          </td>
                          <td style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'DM Mono, monospace', color: avail ? '#666' : '#333', borderBottom: '1px solid #141414' }}>{avail ? row.chest : '—'}</td>
                          <td style={{ padding: '7px 10px', textAlign: 'center', fontFamily: 'DM Mono, monospace', color: avail ? '#666' : '#333', borderBottom: '1px solid #141414' }}>{avail ? row.length : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: '#333', textAlign: 'center', padding: '0.6rem', margin: 0 }}>
                Tap a row to select size · All measurements in inches
              </p>
            </div>
          </div>

          {/* Details table */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 8, padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              ['Product ID', `#${product.id}`],
              ['Category',   product.category_name],
              ['Stock',      `${product.stock} units`],
              ['Rating',     `${parseFloat(product.rating).toFixed(1)} / 5.0`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#555' }}>{label}</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#888' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 300, marginBottom: '1.5rem' }}>
            More from {product.category_name}
          </h2>
          <div className="store-grid">
            {related.map(p => (
              <a key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                <article className="store-card">
                  <div className="store-card__img-wrap">
                    <img src={p.image_url || '/images/placeholder.webp'} alt={p.name} className="store-card__img" />
                    {p.tag && <span className="store-card__tag" style={{ background: p.tag_color || '#e8d5b7' }}>{p.tag}</span>}
                  </div>
                  <div className="store-card__body">
                    <div className="store-card__meta">
                      <span className="store-card__category">{p.category_name}</span>
                      <span className="store-card__rating">★ {parseFloat(p.rating).toFixed(1)}</span>
                    </div>
                    <h3 className="store-card__name">{p.name}</h3>
                    <div className="store-card__footer">
                      <span className="store-card__price">Rs {parseFloat(p.price).toFixed(0)}</span>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', color: '#555' }}>VIEW →</span>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </div>
      )}

      {sizeChartOpen && <SizeChartModal onClose={() => setSizeChartOpen(false)} />}

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  )
}