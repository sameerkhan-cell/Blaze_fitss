'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '../../../context/CartContext'

const SIZE_CHART = [
  { size: 'S',   shoulder: '—',    length: '26"', chest: '19"' },
  { size: 'M',   shoulder: '17½"', length: '28"', chest: '19"' },
  { size: 'L',   shoulder: '18½"', length: '29"', chest: '20"' },
  { size: 'XL',  shoulder: '—',    length: '29"', chest: '22"' },
  { size: 'XXL', shoulder: '—',    length: '30"', chest: '23"' },
  { size: '3XL', shoulder: '—',    length: '30"', chest: '24"' },
  { size: '4XL', shoulder: '—',    length: '30"', chest: '25"' },
]

const mono  = { fontFamily: 'DM Mono, monospace' }
const serif = { fontFamily: 'Cormorant Garamond, serif' }

function SizeChartModal({ onClose, availableSizes, selectedSize, onSelect }) {
  if (typeof document === 'undefined') return null
  return createPortal(
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 14, width: '100%', maxWidth: 520, overflow: 'hidden', animation: 'scaleIn 0.2s ease forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', borderBottom: '1px solid #2a2a2a' }}>
          <h3 style={{ ...serif, margin: 0, fontSize: '1.2rem', fontWeight: 300, color: '#f0ece4' }}>Size Guide</h3>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #333', color: '#888', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '0.75rem 1.4rem 1.4rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Size', 'Chest', 'Length', 'Shoulder'].map(h => (
                  <th key={h} style={{ padding: '7px 10px', textAlign: 'center', ...mono, fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#888', fontWeight: 400, borderBottom: '1px solid #2a2a2a' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_CHART.map((row, i) => {
                const avail = availableSizes.includes(row.size)
                const sel   = selectedSize === row.size
                return (
                  <tr key={row.size} onClick={() => avail && (onSelect(sel ? '' : row.size), onClose())}
                    style={{ background: sel ? 'rgba(232,213,183,0.1)' : i % 2 === 0 ? '#161616' : '#1a1a1a', cursor: avail ? 'pointer' : 'not-allowed', opacity: avail ? 1 : 0.35 }}>
                    <td style={{ padding: '9px 10px', textAlign: 'center', ...mono, fontWeight: 700, fontSize: '0.8rem', color: sel ? '#e8d5b7' : avail ? '#ddd' : '#444', borderBottom: '1px solid #222' }}>{avail ? row.size : <s>{row.size}</s>}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', ...mono, fontSize: '0.76rem', color: '#aaa', borderBottom: '1px solid #222' }}>{avail ? row.chest : '—'}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', ...mono, fontSize: '0.76rem', color: '#aaa', borderBottom: '1px solid #222' }}>{avail ? row.length : '—'}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'center', ...mono, fontSize: '0.76rem', color: '#aaa', borderBottom: '1px solid #222' }}>{avail ? row.shoulder : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p style={{ ...mono, fontSize: '0.58rem', color: '#555', textAlign: 'center', padding: '0 1.4rem 1.2rem', margin: 0 }}>💡 Between sizes? Size up for relaxed, size down for slim fit.</p>
      </div>
      <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(0.94) } to { opacity:1; transform:scale(1) } }`}</style>
    </div>,
    document.body
  )
}

export default function ProductDetailPage() {
  const { id }   = useParams()
  const router   = useRouter()
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
  const [imgZoom,       setImgZoom]       = useState(false)
  const [wishlist,      setWishlist]      = useState(false)
  const [tab,           setTab]           = useState('description')

  useEffect(() => {
    if (!imgZoom) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [imgZoom])

  useEffect(() => {
    if (!id) return
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(json => {
        if (!json.success) throw new Error('Not found')
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
    let anyAdded = false
    for (let i = 0; i < qty; i++) {
      const addedItem = await addToCart(product.id, 1, selectedSize || null)
      if (addedItem) anyAdded = true
    }
    if (anyAdded) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    }
  }

  const getImages = () => {
    if (!product) return []
    const imgs = []
    if (product.image_url?.trim()) imgs.push(product.image_url.trim())
    if (product.image_urls?.trim()) {
      product.image_urls.split('\n').map(u => u.trim()).filter(u => u && !imgs.includes(u)).forEach(u => imgs.push(u))
    }
    return imgs
  }

  const shareProduct = () => {
    if (navigator.share) navigator.share({ title: product.name, url: window.location.href })
    else navigator.clipboard?.writeText(window.location.href)
  }

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #1e1e1e', borderTopColor: '#e8d5b7', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
    </div>
  )

  if (error || !product) return (
    <div style={{ maxWidth: 500, margin: '5rem auto', padding: '0 2rem', textAlign: 'center' }}>
      <h1 style={{ ...serif, fontSize: '1.8rem', fontWeight: 300, marginBottom: '1rem' }}>Product not found</h1>
      <button onClick={() => router.back()} style={{ background: 'none', border: '1px solid #2a2a2a', color: '#888', padding: '0.6rem 1.4rem', ...mono, fontSize: '0.7rem', borderRadius: 4, cursor: 'pointer' }}>← GO BACK</button>
    </div>
  )

  const images         = getImages()
  const availableSizes = product.sizes ? product.sizes.split(',').map(s => s.trim()).filter(Boolean) : []
  const stockStatus    = product.stock === 0 ? 'out' : product.stock <= 5 ? 'low' : 'in'

  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0c' }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '1rem 1.5rem 0' }}>
        <nav style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', ...mono, fontSize: '0.6rem', color: '#333' }}>
          <Link href="/" style={{ color: '#333', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link href={`/${product.category_slug}`} style={{ color: '#333', textDecoration: 'none' }}>{product.category_name}</Link>
          <span>›</span>
          <span style={{ color: '#666' }}>{product.name}</span>
        </nav>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '1.25rem 1.5rem 4rem' }}>
        <div className="pdp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* ══ LEFT: Images ══ */}
          <div>
            {/* Main image — fixed max height so it never fills the screen */}
            <div onClick={() => setImgZoom(true)} style={{
              position: 'relative', borderRadius: 10, overflow: 'hidden',
              background: '#111', border: '1px solid #1a1a1a',
              marginBottom: '0.6rem', cursor: 'zoom-in',
              // KEY FIX: use maxHeight instead of aspectRatio
              height: 'min(480px, 55vw)',
            }}>
              {images.length > 0 ? (
                <img key={activeImg} src={images[activeImg]} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', animation: 'imgFade 0.25s ease' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.15, fontSize: '3rem' }}>📷</div>
              )}

              {/* Tag */}
              {product.tag && (
                <span style={{ position: 'absolute', top: 12, left: 12, background: product.tag_color || '#e8d5b7', color: '#0c0c0c', padding: '0.25rem 0.7rem', ...mono, fontSize: '0.58rem', letterSpacing: '0.15em', fontWeight: 700, borderRadius: 4 }}>
                  {product.tag}
                </span>
              )}

              {/* Low stock */}
              {stockStatus === 'low' && (
                <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', padding: '0.25rem 0.6rem', ...mono, fontSize: '0.56rem', borderRadius: 4 }}>
                  ONLY {product.stock} LEFT
                </span>
              )}

              {/* Zoom hint */}
              <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.07)', padding: '0.25rem 0.55rem', borderRadius: 4, ...mono, fontSize: '0.52rem', color: '#555' }}>
                🔍 ZOOM
              </div>

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i - 1 + images.length) % images.length) }}
                    style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ece4', width: 34, height: 34, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                  <button onClick={e => { e.stopPropagation(); setActiveImg(i => (i + 1) % images.length) }}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ece4', width: 34, height: 34, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} style={{
                    width: 60, height: 60, borderRadius: 7, overflow: 'hidden',
                    border: `2px solid ${activeImg === i ? '#e8d5b7' : '#1a1a1a'}`,
                    background: '#111', padding: 0, cursor: 'pointer',
                    opacity: activeImg === i ? 1 : 0.5, transition: 'all 0.2s',
                  }}>
                    <img src={img} alt={`${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges — compact 2x2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {[
                ['🚚', 'Fast Delivery',  'All Pakistan'],
                ['✅', 'Authentic',      'Guaranteed'],
                ['↩️', 'Easy Returns',   '7-Day Policy'],
                ['💬', 'WhatsApp',       '24/7 Support'],
              ].map(([icon, title, sub]) => (
                <div key={title} style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 7, padding: '0.6rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem' }}>{icon}</span>
                  <div>
                    <p style={{ ...mono, fontSize: '0.58rem', color: '#777', margin: 0 }}>{title}</p>
                    <p style={{ ...mono, fontSize: '0.52rem', color: '#333', margin: 0 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══ RIGHT: Info ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Category + stars */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href={`/${product.category_slug}`} style={{ ...mono, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#e8d5b7', textDecoration: 'none', textTransform: 'uppercase' }}>
                {product.category_name}
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{ color: s <= Math.round(parseFloat(product.rating)) ? '#e8d5b7' : '#222', fontSize: '0.7rem' }}>★</span>
                ))}
                <span style={{ ...mono, fontSize: '0.6rem', color: '#444', marginLeft: 2 }}>({product.review_count})</span>
              </div>
            </div>

            {/* Name */}
            <h1 style={{ ...serif, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, lineHeight: 1.15, color: '#f0ece4', margin: 0 }}>
              {product.name}
            </h1>

            {/* Price + stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', paddingBottom: '1rem', borderBottom: '1px solid #141414' }}>
              <span style={{ ...serif, fontSize: '2rem', fontWeight: 300, color: '#e8d5b7', lineHeight: 1 }}>
                Rs {parseFloat(product.price).toFixed(0)}
              </span>
              <span style={{
                ...mono, fontSize: '0.6rem', letterSpacing: '0.1em',
                padding: '0.28rem 0.7rem', borderRadius: 20,
                background: stockStatus === 'out' ? 'rgba(248,113,113,0.1)' : stockStatus === 'low' ? 'rgba(245,158,11,0.1)' : 'rgba(52,211,153,0.1)',
                color: stockStatus === 'out' ? '#f87171' : stockStatus === 'low' ? '#f59e0b' : '#34d399',
                border: `1px solid ${stockStatus === 'out' ? 'rgba(248,113,113,0.2)' : stockStatus === 'low' ? 'rgba(245,158,11,0.2)' : 'rgba(52,211,153,0.2)'}`,
              }}>
                {stockStatus === 'out' ? 'OUT OF STOCK' : stockStatus === 'low' ? `ONLY ${product.stock} LEFT` : 'IN STOCK'}
              </span>
            </div>

            {/* Size */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <p style={{ ...mono, fontSize: '0.62rem', letterSpacing: '0.15em', color: '#555', margin: 0 }}>
                  SIZE {selectedSize && <span style={{ color: '#e8d5b7' }}>— {selectedSize}</span>}
                </p>
                <button onClick={() => setSizeChartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', ...mono, fontSize: '0.58rem', letterSpacing: '0.1em', color: '#e8d5b7', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>
                  📏 SIZE GUIDE
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {SIZE_CHART.map(({ size: s }) => {
                  const avail = availableSizes.includes(s)
                  const sel   = selectedSize === s
                  return (
                    <button key={s} onClick={() => avail && setSelectedSize(s === sel ? '' : s)} disabled={!avail}
                      style={{
                        width: 44, height: 44, position: 'relative',
                        border: `1.5px solid ${sel ? '#e8d5b7' : avail ? '#1e1e1e' : '#111'}`,
                        borderRadius: 7, overflow: 'hidden',
                        background: sel ? 'rgba(232,213,183,0.12)' : avail ? '#0f0f0f' : 'transparent',
                        color: sel ? '#e8d5b7' : avail ? '#777' : '#222',
                        ...mono, fontSize: '0.68rem',
                        cursor: avail ? 'pointer' : 'not-allowed',
                        transition: 'all 0.15s',
                        transform: sel ? 'scale(1.07)' : 'scale(1)',
                      }}>
                      {s}
                      {!avail && (
                        <svg viewBox="0 0 44 44" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                          <line x1="7" y1="37" x2="37" y2="7" stroke="#222" strokeWidth="1.5" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p style={{ ...mono, fontSize: '0.62rem', letterSpacing: '0.15em', color: '#555', marginBottom: '0.5rem' }}>QUANTITY</p>
              <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', color: '#888', width: 40, height: 40, fontSize: '1.1rem', borderRadius: '7px 0 0 7px', cursor: 'pointer' }}>−</button>
                <span style={{ ...mono, fontSize: '0.88rem', minWidth: 48, textAlign: 'center', background: '#0a0a0a', border: '1px solid #1e1e1e', borderLeft: 'none', borderRight: 'none', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f0ece4' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ background: '#0f0f0f', border: '1px solid #1e1e1e', color: '#888', width: 40, height: 40, fontSize: '1.1rem', borderRadius: '0 7px 7px 0', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            {/* Add to cart + actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAddToCart} disabled={cartLoading || product.stock === 0 || added}
                style={{
                  flex: 1, padding: '0.9rem 1rem', border: 'none',
                  ...mono, fontSize: '0.75rem', letterSpacing: '0.2em',
                  background: added ? '#34d399' : '#e8d5b7',
                  color: added ? '#fff' : '#0c0c0c',
                  borderRadius: 8, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.25s',
                  opacity: (cartLoading || product.stock === 0) ? 0.5 : 1,
                }}>
                {added ? '✓ ADDED' : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
              </button>
              <button onClick={() => setWishlist(v => !v)} title="Wishlist" style={{ width: 46, height: 46, border: `1.5px solid ${wishlist ? '#e8d5b7' : '#1e1e1e'}`, background: wishlist ? 'rgba(232,213,183,0.08)' : '#0f0f0f', borderRadius: 8, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                {wishlist ? '❤️' : '🤍'}
              </button>
              <button onClick={shareProduct} title="Share" style={{ width: 46, height: 46, border: '1.5px solid #1e1e1e', background: '#0f0f0f', borderRadius: 8, cursor: 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🔗</button>
            </div>

            {/* WhatsApp */}
            <a href={`https://wa.me/923118186132?text=${encodeURIComponent(`Hi, I want to order:\n*${product.name}*\nSize: ${selectedSize || 'TBD'}\nQty: ${qty}\nPrice: Rs ${parseFloat(product.price).toFixed(0)}`)}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', border: '1px solid rgba(37,211,102,0.25)', background: 'rgba(37,211,102,0.04)', borderRadius: 8, ...mono, fontSize: '0.68rem', letterSpacing: '0.1em', color: '#25d366', textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              ORDER VIA WHATSAPP
            </a>

            {/* Info tabs */}
            <div style={{ border: '1px solid #1a1a1a', borderRadius: 9, overflow: 'hidden' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #1a1a1a' }}>
                {['description', 'details', 'shipping'].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    flex: 1, padding: '0.65rem 0.25rem',
                    ...mono, fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                    background: tab === t ? '#111' : '#0a0a0a', border: 'none', cursor: 'pointer',
                    color: tab === t ? '#e8d5b7' : '#333',
                    borderBottom: `2px solid ${tab === t ? '#e8d5b7' : 'transparent'}`,
                    transition: 'all 0.18s',
                  }}>{t}</button>
                ))}
              </div>
              <div style={{ padding: '1rem', background: '#0a0a0a', minHeight: 80 }}>
                {tab === 'description' && (
                  <p style={{ color: '#777', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>
                    {product.description || 'Premium quality football gear crafted for performance and style.'}
                  </p>
                )}
                {tab === 'details' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      ['Category',        product.category_name],
                      ['Stock',           `${product.stock} units`],
                      ['Rating',          `${parseFloat(product.rating).toFixed(1)} / 5.0`],
                      ['Available Sizes', availableSizes.length > 0 ? availableSizes.join(', ') : '—'],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.4rem', borderBottom: '1px solid #111' }}>
                        <span style={{ ...mono, fontSize: '0.6rem', color: '#333' }}>{label}</span>
                        <span style={{ ...mono, fontSize: '0.68rem', color: '#666' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {tab === 'shipping' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {[
                      ['🚚', 'Standard Delivery', '3–5 business days across Pakistan'],
                      ['⚡', 'Express Available', 'Contact us on WhatsApp for express'],
                      ['↩️', 'Returns',           '7-day return policy on unworn items'],
                    ].map(([icon, title, desc]) => (
                      <div key={title} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.95rem', flexShrink: 0, marginTop: 1 }}>{icon}</span>
                        <div>
                          <p style={{ ...mono, fontSize: '0.62rem', color: '#777', margin: '0 0 1px' }}>{title}</p>
                          <p style={{ fontSize: '0.82rem', color: '#3a3a3a', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid #141414' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ ...serif, fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 300, color: '#f0ece4' }}>
                More from {product.category_name}
              </h2>
              <Link href={`/${product.category_slug}`} style={{ ...mono, fontSize: '0.6rem', color: '#e8d5b7', letterSpacing: '0.15em', textDecoration: 'none' }}>
                VIEW ALL →
              </Link>
            </div>
            <div className="store-grid">
              {related.map(p => (
                <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                  <article className="store-card">
                    <div className="store-card__img-wrap">
                      <img src={p.image_url || '/images/placeholder.webp'} alt={p.name} className="store-card__img" loading="lazy" />
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
                        <span style={{ ...mono, fontSize: '0.62rem', color: '#444' }}>VIEW →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom modal */}
      {imgZoom && images.length > 0 && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setImgZoom(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '1.5rem',
            overflow: 'hidden',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(1100px, 100%)',
              height: 'min(88vh, 820px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <img
              src={images[activeImg]}
              alt={product.name}
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                objectPosition: 'center',
                borderRadius: 12,
                boxShadow: '0 28px 80px rgba(0,0,0,0.45)',
              }}
            />
          </div>
          <button
            onClick={e => {
              e.stopPropagation()
              setImgZoom(false)
            }}
            aria-label="Close image preview"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(12,12,12,0.82)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#f0ece4',
              width: 42,
              height: 42,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            x
          </button>
        </div>,
        document.body
      )}
      {false && imgZoom && images.length > 0 && (
        <div onClick={() => setImgZoom(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '1.5rem' }}>
          <img src={images[activeImg]} alt={product.name} style={{ maxWidth: '92vw', maxHeight: '92vh', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={() => setImgZoom(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ece4', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}

      {sizeChartOpen && (
        <SizeChartModal onClose={() => setSizeChartOpen(false)} availableSizes={availableSizes} selectedSize={selectedSize} onSelect={setSelectedSize} />
      )}

      <style>{`
        @keyframes imgFade { from { opacity:0 } to { opacity:1 } }
        @media (max-width: 860px) {
          .pdp-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 860px) {
          .pdp-grid > div:first-child { height: auto !important; }
        }
      `}</style>
    </div>
  )
}
