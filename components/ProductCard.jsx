'use client'
// components/ProductCard.jsx

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, loading } = useCart()
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding]   = useState(false)
  const price = Number.parseFloat(product.price || 0)
  const rating = Number.parseFloat(product.rating || 4.7)
  const reviews = Number(product.review_count || 0)
  const stock = Number(product.stock || 0)
  const isLowStock = stock > 0 && stock <= 3
  const stockLabel = stock <= 0 ? 'Sold out' : isLowStock ? `${stock} left` : 'In stock'
  const stockTone = stock <= 0
    ? { color: '#fca5a5', background: 'rgba(127,29,29,0.45)', border: '1px solid rgba(248,113,113,0.35)' }
    : isLowStock
      ? { color: '#fcd34d', background: 'rgba(120,53,15,0.38)', border: '1px solid rgba(250,204,21,0.28)' }
      : { color: '#b7f0cc', background: 'rgba(20,83,45,0.34)', border: '1px solid rgba(52,211,153,0.22)' }

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (adding || loading) return
    setAdding(true)
    await addToCart(product.id)
    setTimeout(() => setAdding(false), 800)
  }

  return (
    <Link
      href={`/products/${product.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
      className="product-card-link"
    >
      <article
        className="store-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
          border: '1px solid rgba(255,255,255,0.06)',
          background: '#0f0f0f',
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,213,183,0.15)'
            : '0 2px 8px rgba(0,0,0,0.3)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.4s ease',
          willChange: 'transform',
        }}
      >
        {/* Image */}
        <div className="store-card__img-wrap" style={{ overflow: 'hidden', position: 'relative' }}>
          <img
            src={product.image_url || '/images/placeholder.webp'}
            alt={product.name}
            className="store-card__img"
            loading="lazy"
            decoding="async"
            width={400}
            height={533}
            style={{
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.34,1,0.64,1)',
              willChange: 'transform',
            }}
          />

          {/* Overlay on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }} />

          {/* Quick view hint */}
          <div style={{
            position: 'absolute', bottom: '1rem', left: '50%',
            transform: hovered ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(12px)',
            opacity: hovered ? 1 : 0,
            transition: 'all 0.35s cubic-bezier(0.34,1.4,0.64,1)',
            background: 'rgba(232,213,183,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(232,213,183,0.3)',
            borderRadius: '4px',
            padding: '0.35rem 0.9rem',
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: '#e8d5b7',
            whiteSpace: 'nowrap',
          }}>
            VIEW PRODUCT →
          </div>

          {product.tag && (
            <span
              className="store-card__tag"
              style={{
                background: product.tag_color || '#e8d5b7',
                transform: hovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              {product.tag}
            </span>
          )}

          <span
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              padding: '0.32rem 0.55rem',
              borderRadius: 999,
              fontFamily: 'DM Mono, monospace',
              fontSize: '0.52rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(8px)',
              ...stockTone,
            }}
          >
            {stockLabel}
          </span>
        </div>

        {/* Body */}
        <div className="store-card__body">
          <div className="store-card__meta" style={{ marginBottom: '0.7rem' }}>
            <span className="store-card__category" style={{ padding: '0.25rem 0.5rem', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {product.category_name || 'Football Essential'}
            </span>
            <span className="store-card__rating" style={{ padding: '0.25rem 0.5rem', borderRadius: 999, background: 'rgba(232,213,183,0.08)', border: '1px solid rgba(232,213,183,0.12)', color: '#d9c9af' }}>
              {rating.toFixed(1)} / {reviews}
            </span>
          </div>

          <h3 className="store-card__name">{product.name}</h3>

          <p style={{ margin: '0 0 0.9rem', color: '#7e766b', lineHeight: 1.65, fontSize: '0.78rem' }}>
            {stock > 0 ? 'Fast dispatch, secure checkout, and WhatsApp support if you need sizing help.' : 'Join the next restock and keep this pick on your radar.'}
          </p>

          <div className="store-card__footer">
            <div>
              <span className="store-card__price">
                Rs {price.toFixed(0)}
              </span>
              <p style={{ margin: '0.3rem 0 0', color: '#5f584f', fontSize: '0.72rem' }}>
                {price >= 5000 ? 'Free delivery eligible' : 'COD available nationwide'}
              </p>
            </div>
            <button
              className="store-card__add-btn"
              onClick={handleAdd}
              disabled={loading || stock === 0 || adding}
              style={{
                background: adding ? '#34d399' : hovered ? '#e8d5b7' : '#1e1e1e',
                color: adding ? '#fff' : hovered ? '#0c0c0c' : '#f0ece4',
                borderColor: adding ? '#34d399' : hovered ? '#e8d5b7' : '#2a2a2a',
                transform: adding ? 'scale(0.97)' : 'scale(1)',
                transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.2s ease',
              }}
            >
              {adding ? 'ADDED' : stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </article>
    </Link>
  )
}
