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

const utilityLinks = [
  { label: 'Nationwide Delivery', href: '/ordering' },
  { label: 'COD Available', href: '/returns' },
  { label: 'WhatsApp Support', href: 'https://wa.me/923118186132', ext: true },
]

const MOBILE_BREAKPOINT = 900

export default function Navbar() {
  const { cartCount } = useCart()
  const { user, isLoggedIn, logout, setAuthModal, authModal } = useAuth()
  const [cartOpen,     setCartOpen]     = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [isMobile,     setIsMobile]     = useState(false) // ✅ JS-based, always correct
  const pathname = usePathname()
  const router   = useRouter()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  const mono = { fontFamily: 'DM Mono, monospace' }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(8,8,8,0.98)' : 'rgba(12,12,12,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${scrolled ? '#222' : '#1a1a1a'}`,
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5)' : 'none',
        width: '100%',
      }}>

        {/* Gold accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent 0%, #e8d5b7 35%, #c8a84b 65%, transparent 100%)', opacity: 0.45, pointerEvents: 'none' }} />

        {!isMobile && (
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.015)' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0.45rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '1.1rem', flexWrap: 'wrap' }}>
                {utilityLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.ext ? '_blank' : undefined}
                    rel={item.ext ? 'noreferrer noopener' : undefined}
                    style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.18em', color: '#72695d', textTransform: 'uppercase', textDecoration: 'none' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <span style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.16em', color: '#92856f', textTransform: 'uppercase' }}>
                Free delivery over Rs 5000
              </span>
            </div>
          </div>
        )}

        <div style={{
          maxWidth: 1400, margin: '0 auto',
          padding: `0 ${isMobile ? '1rem' : '2rem'}`,
          height: isMobile ? 60 : 68,
          display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1.25rem',
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', flexShrink: 0, textDecoration: 'none' }}>
            <span style={{ ...mono, fontSize: '1.05rem', fontWeight: 700, color: '#f0ece4', letterSpacing: '0.22em' }}>BLAZE</span>
            <span style={{ ...mono, fontSize: '0.55rem', color: '#e8d5b7', letterSpacing: '0.5em' }}>FITSS</span>
          </Link>

          {/* ── DESKTOP ONLY ── */}
          {!isMobile && (
            <>
              <div style={{ width: 1, height: 20, background: '#222', flexShrink: 0 }} />

              {/* Nav links */}
              <nav style={{ display: 'flex', gap: 0, flex: 1 }}>
                {links.map(({ href, label }) => {
                  const active = pathname === href
                  return (
                    <Link key={href} href={href} style={{
                      position: 'relative', ...mono, fontSize: '0.68rem',
                      letterSpacing: '0.12em', padding: '0.5rem 0.9rem',
                      color: active ? '#e8d5b7' : '#555',
                      background: active ? 'rgba(232,213,183,0.07)' : 'transparent',
                      borderRadius: 999,
                      textDecoration: 'none', transition: 'color 0.2s, background 0.2s', whiteSpace: 'nowrap',
                    }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#aaa' }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = '#555' }}>
                      {label}
                      {active && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1.5px', background: 'linear-gradient(90deg, transparent, #e8d5b7, transparent)' }} />}
                    </Link>
                  )
                })}
              </nav>

              {/* Custom Kits pill */}
              <Link href="/custom-kits" style={{
                ...mono, fontSize: '0.62rem', letterSpacing: '0.14em',
                padding: '0.45rem 0.95rem', background: 'rgba(232,213,183,0.07)',
                border: '1px solid rgba(232,213,183,0.25)', borderRadius: '999px',
                color: '#e8d5b7', textDecoration: 'none', flexShrink: 0,
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,213,183,0.14)'; e.currentTarget.style.borderColor = 'rgba(232,213,183,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,213,183,0.07)'; e.currentTarget.style.borderColor = 'rgba(232,213,183,0.25)' }}>
                ✦ CUSTOM KITS
              </Link>
            </>
          )}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>

            {/* Search — desktop only */}
            {!isMobile && (
              <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <svg style={{ position: 'absolute', left: '0.65rem', pointerEvents: 'none', color: '#444' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input placeholder="Search jerseys, boots..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ background: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '999px', padding: '0.45rem 0.85rem 0.45rem 2rem', color: '#f0ece4', ...mono, fontSize: '0.68rem', outline: 'none', width: 170, transition: 'border-color 0.2s, width 0.3s' }}
                  onFocus={e => { e.target.style.borderColor = '#333'; e.target.style.width = '220px' }}
                  onBlur={e => { e.target.style.borderColor = '#1e1e1e'; e.target.style.width = '170px' }} />
              </form>
            )}

            {/* User/Login — desktop only */}
            {!isMobile && (
              isLoggedIn ? (
                <div style={{ position: 'relative' }}>
                  <button onClick={() => setUserMenuOpen(v => !v)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'none', border: '1px solid #1e1e1e', borderRadius: '4px',
                    padding: '0.4rem 0.75rem', color: '#888', cursor: 'pointer',
                    ...mono, fontSize: '0.68rem', letterSpacing: '0.08em', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#e8d5b7' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#888' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {user.name.split(' ')[0].toUpperCase()}
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#0c0c0c', border: '1px solid #1e1e1e', borderRadius: '8px', minWidth: '170px', zIndex: 300, overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
                      <div style={{ padding: '0.7rem 1rem 0.5rem', borderBottom: '1px solid #141414' }}>
                        <p style={{ ...mono, fontSize: '0.55rem', color: '#333', letterSpacing: '0.15em' }}>SIGNED IN AS</p>
                        <p style={{ ...mono, fontSize: '0.72rem', color: '#666', marginTop: 3 }}>{user.name}</p>
                      </div>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem 1rem', ...mono, fontSize: '0.67rem', letterSpacing: '0.1em', color: '#666', borderBottom: '1px solid #141414', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f0ece4'}
                        onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                        MY ORDERS
                      </Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.75rem 1rem', background: 'none', border: 'none', ...mono, fontSize: '0.67rem', letterSpacing: '0.1em', color: '#555', cursor: 'pointer', transition: 'color 0.2s', textAlign: 'left' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                        onMouseLeave={e => e.currentTarget.style.color = '#555'}>
                        LOGOUT
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setAuthModal('login')} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'none', border: '1px solid #1e1e1e', borderRadius: '4px',
                  padding: '0.4rem 0.75rem', color: '#777', cursor: 'pointer',
                  ...mono, fontSize: '0.68rem', letterSpacing: '0.1em', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#f0ece4' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#777' }}>
                  LOGIN
                </button>
              )
            )}

            {/* Cart — icon only on mobile, icon+text on desktop */}
            <button onClick={() => setCartOpen(true)} aria-label="Open cart" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: cartCount > 0 ? 'rgba(232,213,183,0.08)' : 'none',
              border: `1px solid ${cartCount > 0 ? 'rgba(232,213,183,0.4)' : '#1e1e1e'}`,
              borderRadius: '4px', padding: isMobile ? '0.45rem 0.6rem' : '0.4rem 0.75rem',
              color: cartCount > 0 ? '#e8d5b7' : '#777',
              cursor: 'pointer', transition: 'all 0.2s',
              ...mono, fontSize: '0.68rem', letterSpacing: '0.08em', position: 'relative',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8d5b7'; e.currentTarget.style.color = '#e8d5b7' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = cartCount > 0 ? 'rgba(232,213,183,0.4)' : '#1e1e1e'; e.currentTarget.style.color = cartCount > 0 ? '#e8d5b7' : '#777' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {!isMobile && <span>CART</span>}
              {cartCount > 0 && (
                <span style={{ background: '#e8d5b7', color: '#0a0a0a', borderRadius: '50%', width: 16, height: 16, fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            {isMobile && (
              <button onClick={() => setMenuOpen(v => !v)} aria-label="Menu" style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', gap: '5px',
                background: 'none', border: '1px solid #1e1e1e',
                borderRadius: '4px', padding: '0.48rem 0.55rem', cursor: 'pointer', flexShrink: 0,
              }}>
                <span style={{ display: 'block', width: 18, height: 1.5, background: '#888', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4.5px, 4.5px)' : 'none' }} />
                <span style={{ display: 'block', width: 18, height: 1.5, background: '#888', borderRadius: 2, transition: 'opacity 0.2s', opacity: menuOpen ? 0 : 1 }} />
                <span style={{ display: 'block', width: 18, height: 1.5, background: '#888', borderRadius: 2, transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4.5px, -4.5px)' : 'none' }} />
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {isMobile && menuOpen && (
          <div style={{ background: '#080808', borderTop: '1px solid #181818' }}>

            {/* Mobile search */}
            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #111' }}>
              <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                <svg style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#444' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{ width: '100%', background: '#0e0e0e', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '0.6rem 0.75rem 0.6rem 2.2rem', color: '#f0ece4', ...mono, fontSize: '0.75rem', outline: 'none', boxSizing: 'border-box' }} />
              </form>
            </div>

            {/* Nav links */}
            <div style={{ padding: '0.25rem 1rem' }}>
              {links.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  ...mono, fontSize: '0.78rem', letterSpacing: '0.14em',
                  padding: '0.9rem 0', color: pathname === href ? '#e8d5b7' : '#666',
                  borderBottom: '1px solid #111', textDecoration: 'none',
                }}>
                  {label}
                  {pathname === href && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e8d5b7', flexShrink: 0 }} />}
                </Link>
              ))}
              <Link href="/custom-kits" onClick={() => setMenuOpen(false)} style={{
                display: 'block', ...mono, fontSize: '0.78rem', letterSpacing: '0.14em',
                padding: '0.9rem 0', color: '#e8d5b7', borderBottom: '1px solid #111', textDecoration: 'none',
              }}>✦ CUSTOM KITS</Link>
            </div>

            {/* Auth */}
            <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {isLoggedIn ? (
                <>
                  <span style={{ ...mono, fontSize: '0.65rem', color: '#555', alignSelf: 'center' }}>👤 {user.name}</span>
                  <Link href="/account" onClick={() => setMenuOpen(false)} style={{ ...mono, fontSize: '0.65rem', color: '#777', letterSpacing: '0.1em', textDecoration: 'none', border: '1px solid #1e1e1e', borderRadius: '4px', padding: '0.45rem 0.8rem' }}>ORDERS</Link>
                  <button onClick={() => { logout(); setMenuOpen(false) }} style={{ background: 'none', border: '1px solid #2a1a1a', borderRadius: '4px', ...mono, fontSize: '0.65rem', color: '#f87171', cursor: 'pointer', padding: '0.45rem 0.8rem' }}>LOGOUT</button>
                </>
              ) : (
                <button onClick={() => { setAuthModal('login'); setMenuOpen(false) }} style={{
                  width: '100%', background: '#e8d5b7', border: 'none', borderRadius: '4px',
                  ...mono, fontSize: '0.7rem', letterSpacing: '0.15em', color: '#0a0a0a',
                  cursor: 'pointer', padding: '0.7rem', fontWeight: 500,
                }}>LOGIN / SIGN UP</button>
              )}
            </div>
          </div>
        )}
      </header>

      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
      {authModal && <AuthModal />}
    </>
  )
}
