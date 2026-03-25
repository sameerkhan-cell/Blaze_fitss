'use client'
// components/HomeClient.jsx

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ProductGrid from './ProductGrid'

/* ─── Scroll reveal hook ─────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1'
          e.target.style.transform = 'none'
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

const mono  = { fontFamily: 'DM Mono, monospace' }
const serif = { fontFamily: 'Cormorant Garamond, serif' }

function reveal(delay = 0) {
  return {
    'data-reveal': true,
    style: {
      opacity: 0,
      transform: 'translateY(28px)',
      transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      willChange: 'opacity, transform',
    }
  }
}

export default function HomeClient({ products, categories, query, error }) {
  useReveal()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category_slug === filter || p.category_name?.toLowerCase() === filter)

  const catSlugs = [
    { slug: 'all',          label: 'All' },
    { slug: 'jerseys',      label: 'Jerseys' },
    { slug: 'footballshoes',label: 'Shoes' },
    { slug: 'footballs',    label: 'Balls' },
    { slug: 'shopforkids',  label: 'Kids' },
  ]

  return (
    <div style={{ background: '#0c0c0c', minHeight: '100vh' }}>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section style={{
        position: 'relative', minHeight: '92vh',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden', background: '#080808',
      }}>

        {/* BG image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1400&q=85)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'brightness(0.22) saturate(0.8)',
          transform: 'scale(1.04)',
          transition: 'transform 8s ease',
        }} />

        {/* Overlays */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(8,8,8,1) 0%, rgba(8,8,8,0.8) 45%, rgba(8,8,8,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080808 0%, transparent 40%)' }} />

        {/* Decorative vertical line */}
        <div style={{ position: 'absolute', left: '48%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(232,213,183,0.06) 30%, rgba(232,213,183,0.06) 70%, transparent)', pointerEvents: 'none' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1400, margin: '0 auto', padding: 'clamp(6rem,12vw,10rem) 1.5rem clamp(8rem,14vw,12rem)' }}>

          <div style={{ maxWidth: 680 }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', animation: 'fadeUp 0.7s ease 0.1s both' }}>
              <div style={{ width: 28, height: 1, background: '#e8d5b7', opacity: 0.6 }} />
              <span style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.45em', color: '#e8d5b7', opacity: 0.8, textTransform: 'uppercase' }}>
                SS 2026 Collection
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              ...serif,
              fontSize: 'clamp(3.2rem, 8vw, 6.5rem)',
              fontWeight: 300, lineHeight: 0.95,
              color: '#f5f0e8', marginBottom: '1.5rem',
              animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
              letterSpacing: '-0.01em',
            }}>
              Wear What<br />
              <em style={{ color: '#e8d5b7', fontStyle: 'italic' }}>Champions</em><br />
              <span style={{ fontSize: '75%', opacity: 0.7 }}>Wear</span>
            </h1>

            {/* Subtext */}
            <p style={{
              color: '#666', fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              lineHeight: 1.85, maxWidth: 420, marginBottom: '2.5rem',
              animation: 'fadeUp 0.8s ease 0.4s both',
            }}>
              Premium football jerseys, boots and complete custom kits — delivered across Pakistan.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.55s both' }}>
              <Link href="/jerseys" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.9rem 2.25rem',
                background: '#e8d5b7', color: '#080808',
                ...mono, fontSize: '0.7rem', letterSpacing: '0.22em',
                borderRadius: 4, fontWeight: 600, textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0e4ca'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(232,213,183,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#e8d5b7'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
                SHOP NOW
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/custom-kits" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.9rem 2rem',
                background: 'transparent', color: '#888',
                border: '1px solid rgba(255,255,255,0.12)',
                ...mono, fontSize: '0.7rem', letterSpacing: '0.2em',
                borderRadius: 4, textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,213,183,0.4)'; e.currentTarget.style.color = '#e8d5b7'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#888'; e.currentTarget.style.transform = 'none' }}>
                CUSTOM KITS
              </Link>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)',
          animation: 'fadeUp 0.7s ease 0.9s both',
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem', display: 'flex', overflowX: 'auto' }}>
            {[
              { val: `${products.length || '16'}+`, label: 'Products Available' },
              { val: '4',      label: 'Categories' },
              { val: '4.7★',  label: 'Average Rating' },
              { val: '500+',  label: 'Happy Customers' },
              { val: '🇵🇰',   label: 'Pakistan Delivery' },
            ].map(({ val, label }) => (
              <div key={label} style={{ flex: '1 0 120px', padding: '1.1rem 1rem', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ ...serif, fontSize: 'clamp(1rem,2.5vw,1.5rem)', fontWeight: 300, color: '#e8d5b7', margin: '0 0 2px' }}>{val}</p>
                <p style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.18em', color: '#3a3a3a', textTransform: 'uppercase', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ANNOUNCEMENT STRIP
      ════════════════════════════════════════ */}
      <div style={{
        background: '#e8d5b7', padding: '0.6rem 0',
        overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <div style={{ display: 'inline-flex', gap: '3rem', animation: 'marquee 20s linear infinite', ...mono, fontSize: '0.6rem', letterSpacing: '0.2em', color: '#0c0c0c' }}>
          {['FREE DELIVERY ON ORDERS ABOVE RS 3000', 'CUSTOM KITS IN 15 DAYS', 'AUTHENTIC QUALITY GUARANTEED', 'WHATSAPP SUPPORT 24/7', 'NEW ARRIVALS EVERY WEEK', 'FREE DELIVERY ON ORDERS ABOVE RS 3000', 'CUSTOM KITS IN 15 DAYS', 'AUTHENTIC QUALITY GUARANTEED', 'WHATSAPP SUPPORT 24/7', 'NEW ARRIVALS EVERY WEEK'].map((t, i) => (
            <span key={i}>⚽ {t}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════ */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) 1.5rem' }}>
        <div {...reveal(0)} style={{ ...reveal(0).style, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: '#444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Browse</p>
            <h2 style={{ ...serif, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: '#f0ece4', margin: 0 }}>Shop by Category</h2>
          </div>
          <Link href="/jerseys" style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.2em', color: '#555', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8d5b7'}
            onMouseLeave={e => e.currentTarget.style.color = '#555'}>
            VIEW ALL →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.85rem' }} className="cats-grid">
          {categories.map((cat, i) => (
            <div key={cat.label} {...reveal(i * 80)} style={{ ...reveal(i * 80).style }}>
              <Link href={cat.href} style={{ textDecoration: 'none', display: 'block', position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '3/4', background: '#111' }}
                onMouseEnter={e => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1.08)'
                  e.currentTarget.querySelector('.cat-overlay').style.opacity = '1'
                  e.currentTarget.querySelector('.cat-label').style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector('img').style.transform = 'scale(1)'
                  e.currentTarget.querySelector('.cat-overlay').style.opacity = '0'
                  e.currentTarget.querySelector('.cat-label').style.transform = 'none'
                }}>
                <img src={cat.img} alt={cat.label} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.65)', transition: 'transform 0.6s cubic-bezier(0.34,1,0.64,1)' }} />

                {/* Gradient */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)' }} />

                {/* Hover overlay */}
                <div className="cat-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(232,213,183,0.07)', opacity: 0, transition: 'opacity 0.3s ease' }} />

                {/* Label */}
                <div className="cat-label" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem', transition: 'transform 0.35s ease' }}>
                  <p style={{ ...mono, fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(232,213,183,0.6)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{cat.count}</p>
                  <p style={{ ...serif, fontSize: '1.3rem', fontWeight: 300, color: '#f0ece4', margin: 0, lineHeight: 1.2 }}>{cat.label}</p>
                </div>

                {/* Arrow */}
                <div style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e8d5b7" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES STRIP
      ════════════════════════════════════════ */}
      <div style={{ borderTop: '1px solid #141414', borderBottom: '1px solid #141414', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="features-strip">
          {[
            { icon: '🚚', title: 'Nationwide Delivery', sub: 'Across all of Pakistan' },
            { icon: '✅', title: 'Authentic Products',  sub: 'Quality guaranteed' },
            { icon: '🏷️', title: 'Best Prices',         sub: 'No hidden charges' },
            { icon: '💬', title: 'WhatsApp Support',    sub: 'Available 24/7' },
          ].map(({ icon, title, sub }) => (
            <div key={title} style={{ padding: '1.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1px solid #141414' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ ...mono, fontSize: '0.65rem', color: '#ddd', margin: '0 0 2px', letterSpacing: '0.05em' }}>{title}</p>
                <p style={{ ...mono, fontSize: '0.58rem', color: '#3a3a3a', margin: 0 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          PRODUCTS
      ════════════════════════════════════════ */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: 'clamp(3rem,6vw,5rem) 1.5rem clamp(4rem,8vw,7rem)' }}>

        {/* Header + filter tabs */}
        <div {...reveal(0)} style={{ ...reveal(0).style, marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: '#444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {query ? 'Search Results' : 'Our Collection'}
              </p>
              <h2 style={{ ...serif, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: '#f0ece4', margin: 0 }}>
                {query ? `"${query}"` : 'All Products'}
              </h2>
            </div>
            <p style={{ ...mono, fontSize: '0.62rem', color: '#3a3a3a' }}>{filtered.length} products</p>
          </div>

          {/* Filter pills */}
          {!query && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {catSlugs.map(({ slug, label }) => (
                <button key={slug} onClick={() => setFilter(slug)} style={{
                  padding: '0.45rem 1.1rem',
                  background: filter === slug ? '#e8d5b7' : 'transparent',
                  border: `1px solid ${filter === slug ? '#e8d5b7' : '#1e1e1e'}`,
                  borderRadius: 20, cursor: 'pointer',
                  ...mono, fontSize: '0.62rem', letterSpacing: '0.12em',
                  color: filter === slug ? '#0c0c0c' : '#555',
                  transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => { if (filter !== slug) { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#aaa' }}}
                  onMouseLeave={e => { if (filter !== slug) { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#555' }}}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {error ? (
          <div className="error-box"><p className="error-box__text">{error}</p></div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <p style={{ ...mono, fontSize: '0.8rem', color: '#444' }}>No products found</p>
          </div>
        ) : (
          <div {...reveal(100)} style={{ ...reveal(100).style }}>
            <ProductGrid products={filtered} />
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          CUSTOM KITS BANNER
      ════════════════════════════════════════ */}
      <section style={{ margin: '0 1.5rem clamp(3rem,6vw,5rem)', maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto' }}>
        <div {...reveal(0)} style={{ ...reveal(0).style }}>
          <div style={{
            position: 'relative', borderRadius: 16, overflow: 'hidden',
            background: 'linear-gradient(135deg, #0f0e0a 0%, #1a1508 50%, #0a0f08 100%)',
            border: '1px solid rgba(232,213,183,0.12)',
            padding: 'clamp(2.5rem,5vw,4rem)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: '2rem', flexWrap: 'wrap',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -60, top: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,213,183,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 80, bottom: -80, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(232,213,183,0.06)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: 'rgba(232,213,183,0.5)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ✦ Custom Manufacturing
              </p>
              <h2 style={{ ...serif, fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300, color: '#f0ece4', margin: '0 0 0.75rem', lineHeight: 1.1 }}>
                Design Your Own<br /><em style={{ color: '#e8d5b7' }}>Football Kit</em>
              </h2>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 440, marginBottom: 0 }}>
                Full custom sublimation printing. Your logo, colors, and name. Delivered in 15 days.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
              <Link href="/custom-kits" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '1rem 2.25rem',
                background: '#e8d5b7', color: '#0a0a0a',
                ...mono, fontSize: '0.7rem', letterSpacing: '0.2em',
                borderRadius: 6, fontWeight: 600, textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0e4ca'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#e8d5b7'; e.currentTarget.style.transform = 'none' }}>
                GET FREE MOCKUP →
              </Link>
              <a href="https://wa.me/923118186132" target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.85rem 2rem', border: '1px solid rgba(37,211,102,0.3)',
                background: 'rgba(37,211,102,0.05)', borderRadius: 6,
                ...mono, fontSize: '0.68rem', letterSpacing: '0.15em', color: '#25d366',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.05)'}>
                💬 WHATSAPP US
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          INSTAGRAM / SOCIAL PROOF
      ════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #0f0f0f', background: '#080808', padding: 'clamp(3rem,5vw,4rem) 1.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
          <div {...reveal(0)} style={{ ...reveal(0).style, marginBottom: '2.5rem' }}>
            <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: '#333', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Follow Us</p>
            <h2 style={{ ...serif, fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 300, color: '#f0ece4', margin: '0 0 0.5rem' }}>@blaze.fitss</h2>
            <p style={{ ...mono, fontSize: '0.62rem', color: '#333', margin: 0 }}>Tag us to be featured</p>
          </div>

          <div {...reveal(100)} style={{ ...reveal(100).style, display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { href: 'https://www.instagram.com/blaze.fitss/', icon: 'Instagram', color: '#E1306C' },
              { href: 'https://www.facebook.com/profile.php?id=61582767407021', icon: 'Facebook', color: '#1877F2' },
              { href: 'https://x.com/Blaze_fitss', icon: 'Twitter / X', color: '#f0ece4' },
              { href: 'https://wa.me/923118186132', icon: 'WhatsApp', color: '#25d366' },
            ].map(s => (
              <a key={s.icon} href={s.href} target="_blank" rel="noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.65rem 1.4rem',
                border: '1px solid #1a1a1a', borderRadius: 6,
                ...mono, fontSize: '0.65rem', letterSpacing: '0.1em',
                color: '#555', textDecoration: 'none',
                transition: 'all 0.2s ease', background: '#0c0c0c',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '44'; e.currentTarget.style.color = s.color; e.currentTarget.style.background = s.color + '0a' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '#0c0c0c' }}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }

        @media (max-width: 900px) {
          .cats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .features-strip { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 480px) {
          .cats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 0.5rem !important; }
          .features-strip { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}