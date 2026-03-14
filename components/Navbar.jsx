'use client'
// components/Navbar.jsx

import { useState, useEffect } from 'react'
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
  const [scrolled,     setScrolled]     = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(8,8,8,0.98)' : 'rgba(12,12,12,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? '#222' : '#1a1a1a'}`,
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.6)' : 'none',
      }}>

        {/* Gold accent line at top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent 0%, #e8d5b7 35%, #c8a84b 65%, transparent 100%)',
          opacity: 0.5, pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: '0 2rem', height: 68,
          display: 'flex', alignItems: 'center', gap: '1.5rem',
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', flexShrink: 0, textDecoration: 'none' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1rem', fontWeight: 700, color: '#f0ece4', letterSpacing: '0.22em' }}>BLAZE</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: '#e8d5b7', letterSpacing: '0.5em' }}>FITSS</span>
          </Link>

          {/* Thin divider */}
          <div style={{ width: 1, height: 20, background: '#222', flexShrink: 0 }} className="bf-divider" />

          {/* Nav links */}
          <nav style={{ display: 'flex', gap: 0, flex: 1 }} className="bf-nav">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} style={{
                  position: 'relative',
                  fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
                  letterSpacing: '0.12em', padding: '0.5rem 0.9rem',
                  color: active ? '#e8d5b7' : '#555',
                  textDecoration: 'none', transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#aaa' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#555' }}>
                  {label}
                  {active && (
                    <span style={{
                      position: 'absolute', bottom: 0, left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%', height: '1.5px',
                      background: 'linear-gradient(90deg, transparent, #e8d5b7, transparent)',
                    }} />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Custom Kits pill */}
          <Link href="/custom-kits" className="bf-custom-kits" style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.63rem',
            letterSpacing: '0.14em', padding: '0.42rem 1rem',
            background: 'rgba(232,213,183,0.07)',
            border: '1px solid rgba(232,213,183,0.25)',
            borderRadius: '4px', color: '#e8d5b7',
            textDecoration: 'none', flexShrink: 0,
            transition: 'all 0.2s', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,213,183,0.14)'; e.currentTarget.style.borderColor = 'rgba(232,213,183,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,213,183,0.07)'; e.currentTarget.style.borderColor = 'rgba(232,213,183,0.25)' }}>
            ✦ CUSTOM KITS
          </Link>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>

            {/* Search */}
            <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="bf-search">
              <svg style={{ position: 'absolute', left: '0.65rem', pointerEvents: 'none', color: '#444' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  background: '#0e0e0e', border: '1px solid #1e1e1e',
                  borderRadius: '4px', padding: '0.42rem 0.8rem 0.42rem 2rem',
                  color: '#f0ece4', fontFamily: 'DM Mono, monospace', fontSize: '0.68rem',
                  outline: 'none', width: 160, transition: 'border-color 0.2s, width 0.3s',
                }}
                onFocus={e => { e.target.style.borderColor = '#333'; e.target.style.width = '200px' }}
                onBlur={e => { e.target.style.borderColor = '#1e1e1e'; e.target.style.width = '160px' }}
              />
            </form>

            {/* User button */}
            {isLoggedIn ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'none', border: '1px solid #1e1e1e', borderRadius: '4px',
                  padding: '0.42rem 0.8rem', color: '#888', cursor: 'pointer',
                  transition: 'all 0.2s', fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.08em',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#e8d5b7' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#888' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  {user.name.split(' ')[0].toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    background: '#0c0c0c', border: '1px solid #1e1e1e',
                    borderRadius: '8px', minWidth: '170px', zIndex: 200,
                    overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                  }}>
                    <div style={{ padding: '0.7rem 1rem 0.6rem', borderBottom: '1px solid #141414' }}>
                      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.56rem', color: '#333', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Signed in as</p>
                      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#777', marginTop: 3 }}>{user.name}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.75rem 1rem', fontFamily: 'DM Mono, monospace',
                      fontSize: '0.67rem', letterSpacing: '0.1em', color: '#666',
                      borderBottom: '1px solid #141414', textDecoration: 'none', transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f0ece4'}
                      onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      MY ORDERS
                    </Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false) }} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      width: '100%', padding: '0.75rem 1rem',
                      background: 'none', border: 'none', fontFamily: 'DM Mono, monospace',
                      fontSize: '0.67rem', letterSpacing: '0.1em', color: '#555',
                      cursor: 'pointer', transition: 'color 0.2s', textAlign: 'left',
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      LOGOUT
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModal('login')} style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'none', border: '1px solid #1e1e1e', borderRadius: '4px',
                padding: '0.42rem 0.8rem', color: '#777', cursor: 'pointer',
                fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.1em',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#f0ece4' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#777' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                LOGIN
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} aria-label="Open cart" style={{
              position: 'relative', display: 'flex', alignItems: 'center', gap: '0.45rem',
              background: cartCount > 0 ? 'rgba(232,213,183,0.08)' : 'none',
              border: `1px solid ${cartCount > 0 ? 'rgba(232,213,183,0.35)' : '#1e1e1e'}`,
              borderRadius: '4px', padding: '0.42rem 0.9rem',
              color: cartCount > 0 ? '#e8d5b7' : '#777',
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', letterSpacing: '0.08em',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8d5b7'; e.currentTarget.style.color = '#e8d5b7' }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = cartCount > 0 ? 'rgba(232,213,183,0.35)' : '#1e1e1e'
                e.currentTarget.style.color = cartCount > 0 ? '#e8d5b7' : '#777'
              }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              CART{cartCount > 0 && ` (${cartCount})`}
            </button>

            {/* Hamburger */}
            <button onClick={() => setMenuOpen(v => !v)} aria-label="Menu" className="bf-hamburger" style={{
              display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
              gap: '5px', background: 'none', border: '1px solid #1e1e1e',
              borderRadius: '4px', padding: '0.5rem 0.6rem', cursor: 'pointer',
            }}>
              <span style={{ display: 'block', width: 18, height: 1.5, background: '#888', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }} />
              <span style={{ display: 'block', width: 18, height: 1.5, background: '#888', borderRadius: 2, transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
              <span style={{ display: 'block', width: 18, height: 1.5, background: '#888', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#070707', borderTop: '1px solid #181818', padding: '0.5rem 1.5rem 1.5rem' }}>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.15em',
                padding: '0.9rem 0', color: pathname === href ? '#e8d5b7' : '#555',
                borderBottom: '1px solid #111', textDecoration: 'none',
              }}>
                {label}
                {pathname === href && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e8d5b7' }} />}
              </Link>
            ))}
            <Link href="/custom-kits" onClick={() => setMenuOpen(false)} style={{
              display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem',
              letterSpacing: '0.15em', padding: '0.9rem 0', color: '#e8d5b7',
              borderBottom: '1px solid #111', textDecoration: 'none',
            }}>✦ CUSTOM KITS</Link>
            <div style={{ paddingTop: '1rem', display: 'flex', gap: '1.5rem' }}>
              {isLoggedIn ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', textDecoration: 'none' }}>MY ORDERS</Link>
                  <button onClick={() => { logout(); setMenuOpen(false) }} style={{ background: 'none', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#555', cursor: 'pointer', letterSpacing: '0.1em' }}>LOGOUT</button>
                </>
              ) : (
                <button onClick={() => { setAuthModal('login'); setMenuOpen(false) }} style={{ background: 'none', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#666', cursor: 'pointer', letterSpacing: '0.1em' }}>LOGIN / SIGN UP</button>
              )}
            </div>
          </div>
        )}
      </header>

      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
      {authModal && <AuthModal />}

      <style>{`
        @media (max-width: 768px) {
          .bf-nav { display: none !important; }
          .bf-divider { display: none !important; }
          .bf-custom-kits { display: none !important; }
          .bf-search { display: none !important; }
          .bf-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}