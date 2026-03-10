'use client'
// components/CartPanel.jsx

import { useCart } from '../context/CartContext'
import CheckoutModal from './CheckoutModal'

export default function CartPanel({ onClose }) {
  const { cart, cartCount, updateItem, removeItem, checkoutOpen, setCheckoutOpen } = useCart()

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <aside className="cart-panel">
        <div className="cart-panel__header">
          <h2 className="cart-panel__title">
            Cart
            {cartCount > 0 && (
              <span className="cart-panel__count">{cartCount}</span>
            )}
          </h2>
          <button className="cart-panel__close" onClick={onClose}>✕</button>
        </div>

        <div className="cart-panel__items">
          {!cart.items?.length ? (
            <div className="cart-panel__empty">
              <div className="cart-panel__empty-icon">🛍</div>
              <p className="cart-panel__empty-text">Your cart is empty</p>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="cart-item">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="cart-item__img" />
                )}
                <div className="cart-item__info">
                  <p className="cart-item__name">{item.name}</p>
                  {item.size && (
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#555', marginBottom: '0.3rem' }}>
                      SIZE: {item.size}
                    </p>
                  )}
                  <p className="cart-item__price">Rs{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                  <div className="cart-item__qty-row">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                    >−</button>
                    <span className="cart-item__qty-val">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                    >+</button>
                    <button
                      className="cart-item__remove"
                      onClick={() => removeItem(item.id)}
                    >remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.items?.length > 0 && (
          <div className="cart-panel__footer">
            <div className="cart-panel__total-row">
              <span className="cart-panel__total-label">TOTAL</span>
              <span className="cart-panel__total-val">${cart.total?.toFixed(2)}</span>
            </div>
            <button
              className="cart-panel__checkout-btn"
              onClick={() => { setCheckoutOpen(true); onClose(); }}
            >
              CHECKOUT
            </button>
          </div>
        )}
      </aside>

      {checkoutOpen && <CheckoutModal />}
    </>
  )
}
