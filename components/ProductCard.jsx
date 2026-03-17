'use client'
// components/ProductCard.jsx

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, loading } = useCart()
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding]   = useState(false)

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
        </div>

        {/* Body */}
        <div className="store-card__body">
          <div className="store-card__meta">
            <span className="store-card__category">{product.category_name}</span>
            <span className="store-card__rating">
              ★ {parseFloat(product.rating).toFixed(1)} ({product.review_count})
            </span>
          </div>

          <h3 className="store-card__name">{product.name}</h3>

          <div className="store-card__footer">
            <span className="store-card__price">
              Rs {parseFloat(product.price).toFixed(0)}
            </span>
            <button
              className="store-card__add-btn"
              onClick={handleAdd}
              disabled={loading || product.stock === 0 || adding}
              style={{
                background: adding ? '#34d399' : hovered ? '#e8d5b7' : '#1e1e1e',
                color: adding ? '#fff' : hovered ? '#0c0c0c' : '#f0ece4',
                borderColor: adding ? '#34d399' : hovered ? '#e8d5b7' : '#2a2a2a',
                transform: adding ? 'scale(0.97)' : 'scale(1)',
                transition: 'background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.2s ease',
              }}
            >
              {adding ? '✓ ADDED' : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </article>
    </Link>
  )
}