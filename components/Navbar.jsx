'use client'
// components/Navbar.jsx

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartPanel from './CartPanel'
import AuthModal from './AuthModal'

const links = [
  { href: '/',              label: 'All'           },
  { href: '/jerseys',       label: 'Jerseys'       },
  { href: '/footballshoes', label: 'Football Shoes'},
  { href: '/footballs',     label: 'Footballs'     },
  { href: '/shopforkids',   label: 'Kids'          },
]

export default function Navbar() {
  const { cartCount } = useCart()
  const { user, isLoggedIn, logout, setAuthModal, authModal } = useAuth()
  const [cartOpen,     setCartOpen]     = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <Link href="/" className="navbar__logo">
            <span className="navbar__logo-text">BLAZE</span>
            <span className="navbar__logo-accent">FITSS</span>
          </Link>

          <nav className="navbar__nav">
            {links.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`navbar__link${pathname === href ? ' navbar__link--active' : ''}`}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="navbar__actions">
            <form className="navbar__search" onSubmit={handleSearch}>
              <span className="navbar__search-icon">⌕</span>
              <input className="navbar__search-input" placeholder="Search..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </form>

            {isLoggedIn ? (
              <div style={{ position: 'relative' }}>
                <button className="navbar__cart-btn"
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{ gap: '0.4rem', display: 'flex', alignItems: 'center', padding: '0.4rem 0.8rem' }}>
                  <span style={{ fontSize: '0.85rem' }}>👤</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, background: '#111',
                    border: '1px solid #2a2a2a', borderRadius: '6px', minWidth: '140px', zIndex: 200, overflow: 'hidden' }}>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'block', padding: '0.7rem 1rem', fontFamily: 'DM Mono, monospace',
                        fontSize: '0.7rem', letterSpacing: '0.1em', color: '#888', borderBottom: '1px solid #1e1e1e' }}>
                      MY ORDERS
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false) }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 1rem',
                        background: 'none', border: 'none', fontFamily: 'DM Mono, monospace',
                        fontSize: '0.7rem', letterSpacing: '0.1em', color: '#888', cursor: 'pointer' }}>
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="navbar__cart-btn" onClick={() => setAuthModal('login')}
                style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.1em', padding: '0.4rem 0.8rem' }}>
                LOGIN
              </button>
            )}

            <button className="navbar__cart-btn" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <span>🛍</span>
              {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
            </button>

            <button className="navbar__hamburger" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="navbar__mobile-menu">
            {links.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`navbar__mobile-link${pathname === href ? ' navbar__mobile-link--active' : ''}`}
                onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link href="/account" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>My Orders</Link>
                <button onClick={() => { logout(); setMenuOpen(false) }}
                  style={{ background: 'none', border: 'none', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#666', padding: '0.6rem 0', cursor: 'pointer' }}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => { setAuthModal('login'); setMenuOpen(false) }}
                style={{ background: 'none', border: 'none', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#666', padding: '0.6rem 0', cursor: 'pointer' }}>
                Login / Sign Up
              </button>
            )}
          </nav>
        )}
      </header>

      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
      {authModal && <AuthModal />}
    </>
  )
}
