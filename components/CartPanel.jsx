'use client'
// components/CartPanel.jsx

import { useCart } from '../context/CartContext'

export default function CartPanel({ onClose }) {
  const { cart, cartCount, updateItem, removeItem, openCheckout } = useCart()
  const freeDeliveryGap = Math.max(0, 5000 - Number(cart.total || 0))
  const freeDeliveryProgress = Math.min(100, Math.round((Number(cart.total || 0) / 5000) * 100))

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <aside className="cart-panel">
        <div className="cart-panel__header">
          <div>
            <h2 className="cart-panel__title">
              Cart
              {cartCount > 0 && (
                <span className="cart-panel__count">{cartCount}</span>
              )}
            </h2>
            <p className="cart-panel__subtitle">Fast checkout, COD support, and live quantity updates.</p>
          </div>
          <button className="cart-panel__close" onClick={onClose} aria-label="Close cart">x</button>
        </div>

        <div className="cart-panel__items">
          {!cart.items?.length ? (
            <div className="cart-panel__empty">
              <div className="cart-panel__empty-icon">Bag</div>
              <p className="cart-panel__empty-text">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="cart-panel__progress-card">
                <div className="cart-panel__progress-row">
                  <span className="cart-panel__progress-label">Delivery Perk</span>
                  <span className="cart-panel__progress-meta">
                    {freeDeliveryGap > 0 ? `Rs${freeDeliveryGap.toFixed(0)} away` : 'Unlocked'}
                  </span>
                </div>
                <div className="cart-panel__progress-bar">
                  <span className="cart-panel__progress-fill" style={{ width: `${freeDeliveryProgress}%` }} />
                </div>
                <p className="cart-panel__progress-text">
                  {freeDeliveryGap > 0 ? 'Add a little more to unlock free delivery over Rs3000.' : 'Free delivery unlocked for this order.'}
                </p>
              </div>

              {cart.items.map(item => {
                const unitPrice = Number.parseFloat(item.price || 0)
                const subtotal = unitPrice * Number(item.quantity || 0)

                return (
                  <div key={item.id} className="cart-item">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="cart-item__img"
                        loading="lazy"
                        decoding="async"
                        width={84}
                        height={104}
                      />
                    )}

                    <div className="cart-item__info">
                      <div className="cart-item__top">
                        <p className="cart-item__name">{item.name}</p>
                        <button className="cart-item__remove" onClick={() => removeItem(item.id)}>Remove</button>
                      </div>

                      <div className="cart-item__meta-row">
                        {item.size && (
                          <span className="cart-item__pill">Size {item.size}</span>
                        )}
                        <span className="cart-item__pill cart-item__pill--soft">Unit Rs{unitPrice.toFixed(0)}</span>
                      </div>

                      <div className="cart-item__summary">
                        <p className="cart-item__price">Rs{subtotal.toFixed(2)}</p>
                        <p className="cart-item__note">Shipping and discounts calculated at checkout.</p>
                      </div>

                      <div className="cart-item__qty-row">
                        <div className="cart-item__qty-control">
                          <button className="cart-item__qty-btn" onClick={() => updateItem(item.id, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                          <span className="cart-item__qty-val">{item.quantity}</span>
                          <button className="cart-item__qty-btn" onClick={() => updateItem(item.id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                        </div>
                        <span className="cart-item__qty-note">{item.quantity} {item.quantity > 1 ? 'pieces' : 'piece'}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>

        {cart.items?.length > 0 && (
          <div className="cart-panel__footer">
            <div className="cart-panel__total-row">
              <span className="cart-panel__total-label">TOTAL</span>
              <span className="cart-panel__total-val">Rs{cart.total?.toFixed(2)}</span>
            </div>
            <p className="cart-panel__footer-note">Secure checkout with quick confirmation after order placement.</p>
            <button className="cart-panel__checkout-btn" onClick={openCheckout}>
              CHECKOUT
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
