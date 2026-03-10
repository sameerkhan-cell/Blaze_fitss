'use client'
// components/ProductCard.jsx

import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart, loading } = useCart()

  const handleAdd = (e) => {
    e.preventDefault()   // don't navigate when clicking Add to Cart
    e.stopPropagation()
    addToCart(product.id)
  }

  return (
    <a href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article className="store-card">
        <div className="store-card__img-wrap">
          <img
            src={product.image_url || '/images/placeholder.webp'}
            alt={product.name}
            className="store-card__img"
          />
          {product.tag && (
            <span
              className="store-card__tag"
              style={{ background: product.tag_color || '#e8d5b7' }}
            >
              {product.tag}
            </span>
          )}
        </div>

        <div className="store-card__body">
          <div className="store-card__meta">
            <span className="store-card__category">{product.category_name}</span>
            <span className="store-card__rating">
              ★ {parseFloat(product.rating).toFixed(1)} ({product.review_count})
            </span>
          </div>

          <h3 className="store-card__name">{product.name}</h3>

          <div className="store-card__footer">
            <span className="store-card__price">Rs{parseFloat(product.price).toFixed(2)}</span>
            <button
              className="store-card__add-btn"
              onClick={handleAdd}
              disabled={loading || product.stock === 0}
            >
              {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
          </div>
        </div>
      </article>
    </a>
  )
}