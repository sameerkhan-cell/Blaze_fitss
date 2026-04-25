'use client'
// components/HomeClient.jsx

import { useEffect, useMemo, useRef, useState } from 'react'
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

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

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
  const [sortBy, setSortBy] = useState('featured')
  const [stockOnly, setStockOnly] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState({ type: '', message: '' })
  const [submittingNewsletter, setSubmittingNewsletter] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [introClosing, setIntroClosing] = useState(false)
  const [activeDeckCard, setActiveDeckCard] = useState(0)
  const heroPointerFrame = useRef(null)

  const filteredByCategory = useMemo(() => (
    filter === 'all'
      ? products
      : products.filter(p => p.category_slug === filter || p.category_name?.toLowerCase() === filter)
  ), [filter, products])

  const filtered = useMemo(() => (
    stockOnly
      ? filteredByCategory.filter(product => parseNumber(product.stock) > 0)
      : filteredByCategory
  ), [filteredByCategory, stockOnly])

  const sortedProducts = useMemo(() => (
    [...filtered].sort((a, b) => {
      if (sortBy === 'price-low') return parseNumber(a.price) - parseNumber(b.price)
      if (sortBy === 'price-high') return parseNumber(b.price) - parseNumber(a.price)
      if (sortBy === 'top-rated') {
        const ratingDelta = parseNumber(b.rating, 4.6) - parseNumber(a.rating, 4.6)
        if (ratingDelta !== 0) return ratingDelta
        return parseNumber(b.review_count) - parseNumber(a.review_count)
      }
      if (sortBy === 'most-reviewed') return parseNumber(b.review_count) - parseNumber(a.review_count)
      return 0
    })
  ), [filtered, sortBy])

  const catSlugs = [
    { slug: 'all',          label: 'All' },
    { slug: 'jerseys',      label: 'Jerseys' },
    { slug: 'footballshoes',label: 'Shoes' },
    { slug: 'footballs',    label: 'Balls' },
    { slug: 'shopforkids',  label: 'Kids' },
  ]

  const topPick = useMemo(() => {
    // Override to highlight the Portugal World Cup jersey in the spotlight
    const spotlightJersey = products.find(p => p.name?.toLowerCase().includes('portugal 2026 world cup jersey'))
    if (spotlightJersey) return spotlightJersey

    return products.reduce((best, product) => {
      if (!best) return product
      const bestScore = (parseNumber(best.rating, 4.6) * 100) + parseNumber(best.review_count)
      const productScore = (parseNumber(product.rating, 4.6) * 100) + parseNumber(product.review_count)
      return productScore > bestScore ? product : best
    }, null)
  }, [products])

  const {
    inStockCount,
    lowStockCount,
    recentDropsCount,
    averageRating,
  } = useMemo(() => {
    const inStock = products.filter(product => parseNumber(product.stock) > 0).length
    const lowStock = products.filter(product => {
      const stock = parseNumber(product.stock)
      return stock > 0 && stock <= 5
    }).length
    const recentDrops = products.filter(product => {
      if (!product.created_at) return false
      const createdAt = new Date(product.created_at)
      if (Number.isNaN(createdAt.getTime())) return false
      return Date.now() - createdAt.getTime() <= 1000 * 60 * 60 * 24 * 14
    }).length || Math.min(products.length, 6)
    const rating = products.length
      ? (products.reduce((sum, product) => sum + parseNumber(product.rating, 4.6), 0) / products.length).toFixed(1)
      : '4.7'

    return {
      inStockCount: inStock,
      lowStockCount: lowStock,
      recentDropsCount: recentDrops,
      averageRating: rating,
    }
  }, [products])

  const recentDrop = useMemo(() => (
    products.find(product => product.id !== topPick?.id) || topPick
  ), [products, topPick])

  const heroDeckCards = useMemo(() => (
    [
      topPick && {
        eyebrow: 'Top Rated Drop',
        title: topPick.name,
        detail: `${parseNumber(topPick.rating, 4.7).toFixed(1)} rating / ${parseNumber(topPick.review_count)} reviews`,
        meta: `Rs ${parseNumber(topPick.price).toFixed(0)}`,
        href: `/products/${topPick.id}`,
        label: 'Shop now',
        accent: 'rgba(232,213,183,0.42)',
      },
      recentDrop && {
        eyebrow: 'Fresh Arrival',
        title: recentDrop.name,
        detail: recentDrop.category_name || 'Latest store drop',
        meta: parseNumber(recentDrop.stock) > 0 ? `${parseNumber(recentDrop.stock)} ready to ship` : 'New arrival',
        href: `/products/${recentDrop.id}`,
        label: 'See drop',
        accent: 'rgba(127,191,255,0.32)',
      },
      {
        eyebrow: 'Custom Kit Lab',
        title: 'Turn club colors into a full team identity',
        detail: 'Names, sponsor marks, player numbers, and mockups',
        meta: '15 day turnaround',
        href: '/custom-kits',
        label: 'Build a kit',
        accent: 'rgba(116,255,189,0.28)',
      },
    ].filter(Boolean)
  ), [recentDrop, topPick])

  const activeHeroCard = heroDeckCards[activeDeckCard] || heroDeckCards[0]

  const productHighlights = useMemo(() => (
    [
      {
        label: 'Ready To Ship',
        value: `${inStockCount}+`,
        note: 'Live inventory across the store',
      },
      {
        label: 'Fresh Drops',
        value: `${recentDropsCount}`,
        note: 'New arrivals and weekly restocks',
      },
      {
        label: 'Top Rated',
        value: `${averageRating}/5`,
        note: 'Shoppers keep coming back for these',
      },
    ]
  ), [averageRating, inStockCount, recentDropsCount])

  const resetCollectionControls = () => {
    setFilter('all')
    setSortBy('featured')
    setStockOnly(false)
  }

  const handleHeroMouseMove = (event) => {
    const target = event.currentTarget
    if (heroPointerFrame.current) {
      window.cancelAnimationFrame(heroPointerFrame.current)
    }
    heroPointerFrame.current = window.requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      target.style.setProperty('--hero-x', `${x}%`)
      target.style.setProperty('--hero-y', `${y}%`)
    })
  }

  const handleHeroMouseLeave = (event) => {
    if (heroPointerFrame.current) {
      window.cancelAnimationFrame(heroPointerFrame.current)
      heroPointerFrame.current = null
    }
    event.currentTarget.style.setProperty('--hero-x', '72%')
    event.currentTarget.style.setProperty('--hero-y', '32%')
  }

  const dismissIntro = () => {
    setIntroClosing(true)
    try {
      window.sessionStorage.setItem('blaze-home-intro-seen', '1')
    } catch {}
    window.setTimeout(() => {
      setShowIntro(false)
      setIntroClosing(false)
    }, 850)
  }

  useEffect(() => {
    let closeTimer
    let hideTimer
    try {
      const seen = window.sessionStorage.getItem('blaze-home-intro-seen')
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (seen || prefersReducedMotion || window.innerWidth < 768) {
        if (!seen) {
          window.sessionStorage.setItem('blaze-home-intro-seen', '1')
        }
        return undefined
      }
      setShowIntro(true)
      closeTimer = window.setTimeout(() => {
        setIntroClosing(true)
      }, 1450)
      hideTimer = window.setTimeout(() => {
        setShowIntro(false)
        setIntroClosing(false)
        window.sessionStorage.setItem('blaze-home-intro-seen', '1')
      }, 2350)
    } catch {
      return undefined
    }
    return () => {
      window.clearTimeout(closeTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  useEffect(() => {
    if (heroDeckCards.length < 2) return undefined
    const intervalId = window.setInterval(() => {
      setActiveDeckCard(current => (current + 1) % heroDeckCards.length)
    }, 2600)
    return () => window.clearInterval(intervalId)
  }, [heroDeckCards.length])

  useEffect(() => () => {
    if (heroPointerFrame.current) {
      window.cancelAnimationFrame(heroPointerFrame.current)
    }
  }, [])

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    if (!newsletterEmail.trim()) {
      setNewsletterState({ type: 'error', message: 'Enter your email to unlock launch alerts.' })
      return
    }
    setSubmittingNewsletter(true)
    setNewsletterState({ type: '', message: '' })
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe')
      }
      setNewsletterState({
        type: 'success',
        message: data.alreadySubscribed
          ? 'You are already on the list for restocks and new drops.'
          : 'You are in. Watch for restocks, launches, and member-only deals.',
      })
      setNewsletterEmail('')
    } catch (submitError) {
      setNewsletterState({
        type: 'error',
        message: submitError.message || 'Something went wrong. Please try again.',
      })
    } finally {
      setSubmittingNewsletter(false)
    }
  }

  // ─── SEARCH MODE: show only results, hide everything else ───
  if (query) {
    return (
      <div style={{ background: '#0c0c0c', minHeight: '100vh' }}>
        <section style={{ maxWidth: 1400, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
          {/* Search header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: '#444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Search Results
            </p>
            <h1 style={{ ...serif, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: '#f0ece4', margin: '0 0 0.75rem' }}>
              &ldquo;{query}&rdquo;
            </h1>
            <p style={{ ...mono, fontSize: '0.65rem', color: '#555', margin: '0 0 1rem' }}>
              {sortedProducts.length === 0
                ? 'No products found'
                : `${sortedProducts.length} product${sortedProducts.length !== 1 ? 's' : ''} found`}
            </p>
            <a href="/" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              ...mono, fontSize: '0.62rem', letterSpacing: '0.12em',
              color: '#666', textDecoration: 'none',
              border: '1px solid #1e1e1e', borderRadius: 999,
              padding: '0.45rem 1rem',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#444'; e.currentTarget.style.color = '#e8d5b7' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.color = '#666' }}>
              ← CLEAR SEARCH
            </a>
          </div>

          {/* Results */}
          {error ? (
            <p style={{ ...mono, color: '#f87171', fontSize: '0.8rem' }}>{error}</p>
          ) : sortedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
              <p style={{ ...serif, fontSize: '1.5rem', fontWeight: 300, color: '#f0ece4', marginBottom: '0.5rem' }}>
                No results for &ldquo;{query}&rdquo;
              </p>
              <p style={{ ...mono, fontSize: '0.7rem', color: '#444', marginBottom: '2rem' }}>
                Try searching for jerseys, shoes, footballs, or kids gear.
              </p>
              <a href="/" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.85rem 2rem',
                background: '#e8d5b7', color: '#0c0c0c',
                ...mono, fontSize: '0.7rem', letterSpacing: '0.2em',
                borderRadius: 999, fontWeight: 600, textDecoration: 'none',
              }}>
                ← BACK TO STORE
              </a>
            </div>
          ) : (
            <ProductGrid products={sortedProducts} />
          )}
        </section>

        <style>{`
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        `}</style>
      </div>
    )
  }

  // ─── NORMAL HOME PAGE ───────────────────────────────────────
  return (
    <div style={{ background: '#0c0c0c', minHeight: '100vh' }}>
      {showIntro && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 160,
            background: '#050505',
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            opacity: introClosing ? 0 : 1,
            transition: 'opacity 700ms ease',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(232,213,183,0.08) 0%, transparent 58%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(232,213,183,0.05), transparent 20%, transparent 80%, rgba(232,213,183,0.05))' }} />
          <div
            style={{
              position: 'absolute',
              top: 0, bottom: 0, left: 0,
              width: '50%',
              background: '#050505',
              borderRight: '1px solid rgba(232,213,183,0.08)',
              transform: introClosing ? 'translateX(-103%)' : 'translateX(0)',
              transition: 'transform 950ms cubic-bezier(0.76,0,0.24,1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0, bottom: 0, right: 0,
              width: '50%',
              background: '#050505',
              borderLeft: '1px solid rgba(232,213,183,0.08)',
              transform: introClosing ? 'translateX(103%)' : 'translateX(0)',
              transition: 'transform 950ms cubic-bezier(0.76,0,0.24,1)',
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              padding: '1.5rem',
              transform: introClosing ? 'translateY(-18px) scale(0.96)' : 'translateY(0) scale(1)',
              transition: 'transform 700ms ease',
            }}
          >
            <p style={{ ...mono, fontSize: '0.68rem', letterSpacing: '0.42em', color: '#e8d5b7', margin: '0 0 1rem', textTransform: 'uppercase' }}>
              Blaze Fitss
            </p>
            <h2 style={{ ...serif, fontSize: 'clamp(2.7rem, 7vw, 5.4rem)', lineHeight: 0.9, color: '#f5f0e8', margin: '0 0 1rem', fontWeight: 300 }}>
              The Matchday<br />Edit
            </h2>
            <p style={{ maxWidth: 440, margin: '0 auto 1.4rem', color: '#8e877d', lineHeight: 1.8 }}>
              Loading new drops, custom kits, and a premium football store experience.
            </p>
            <button
              onClick={dismissIntro}
              style={{
                padding: '0.8rem 1.2rem',
                borderRadius: 999,
                border: '1px solid rgba(232,213,183,0.24)',
                background: 'rgba(255,255,255,0.02)',
                color: '#e8d5b7',
                ...mono,
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Skip Intro
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        style={{
          '--hero-x': '72%',
          '--hero-y': '32%',
          position: 'relative', minHeight: '640px', maxHeight: '92vh',
          display: 'flex', alignItems: 'center',
          overflow: 'hidden', background: '#080808',
        }}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1400&q=85)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          filter: 'brightness(0.22) saturate(0.8)',
          transform: 'scale(1.04)',
          transition: 'transform 8s ease',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(8,8,8,1) 0%, rgba(8,8,8,0.82) 40%, rgba(8,8,8,0.16) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #080808 0%, transparent 40%)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at var(--hero-x) var(--hero-y), rgba(232,213,183,0.18) 0%, rgba(232,213,183,0.05) 22%, transparent 52%)',
          mixBlendMode: 'screen', pointerEvents: 'none', transition: 'background 160ms ease',
        }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '54px 54px', opacity: 0.14, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '48%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(232,213,183,0.06) 30%, rgba(232,213,183,0.06) 70%, transparent)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1400, margin: '0 auto', padding: '5rem 1.5rem 7rem' }}>
          <div className="hero-shell" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.08fr) minmax(320px, 0.92fr)', gap: 'clamp(2rem, 5vw, 4rem)', alignItems: 'center' }}>
            <div style={{ maxWidth: 720 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', animation: 'fadeUp 0.7s ease 0.1s both' }}>
                <div style={{ width: 28, height: 1, background: '#e8d5b7', opacity: 0.6 }} />
                <span style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.45em', color: '#e8d5b7', opacity: 0.8, textTransform: 'uppercase' }}>
                  SS 2026 Collection
                </span>
              </div>
              <h1 style={{
                ...serif,
                fontSize: 'clamp(2.7rem, 5vw, 4.8rem)',
                fontWeight: 300, lineHeight: 0.92,
                color: '#f5f0e8', marginBottom: '1.3rem',
                animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
                letterSpacing: '-0.02em',
              }}>
                Football Store<br />
                <em style={{ color: '#e8d5b7', fontStyle: 'italic' }}>With Opening Drama</em><br />
                <span style={{ fontSize: '74%', opacity: 0.76 }}>Built To Convert</span>
              </h1>
              <p style={{ color: '#7d7568', fontSize: '0.98rem', lineHeight: 1.9, maxWidth: 520, marginBottom: '2rem', animation: 'fadeUp 0.8s ease 0.4s both' }}>
                Premium football jerseys, boots and complete custom kits — delivered across Pakistan.
              </p>
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', animation: 'fadeUp 0.7s ease 0.55s both' }}>
                <Link href="/jerseys" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.95rem 2.3rem',
                  background: '#e8d5b7', color: '#080808',
                  ...mono, fontSize: '0.7rem', letterSpacing: '0.22em',
                  borderRadius: 999, fontWeight: 600, textDecoration: 'none',
                  transition: 'all 0.25s ease', boxShadow: '0 10px 30px rgba(232,213,183,0.12)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f0e4ca'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(232,213,183,0.24)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#e8d5b7'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(232,213,183,0.12)' }}>
                  Shop Jerseys
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link href="/custom-kits" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.95rem 2rem',
                  background: 'rgba(255,255,255,0.02)', color: '#cfc4b2',
                  border: '1px solid rgba(232,213,183,0.18)',
                  ...mono, fontSize: '0.7rem', letterSpacing: '0.2em',
                  borderRadius: 999, textDecoration: 'none', transition: 'all 0.25s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,213,183,0.42)'; e.currentTarget.style.color = '#f3eadb'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(232,213,183,0.18)'; e.currentTarget.style.color = '#cfc4b2'; e.currentTarget.style.transform = 'none' }}>
                  Build Custom Kit
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '1rem', animation: 'fadeUp 0.7s ease 0.7s both' }}>
                {['COD ready', 'Weekly restocks', 'WhatsApp size help'].map((item) => (
                  <span key={item} style={{ padding: '0.48rem 0.8rem', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', ...mono, fontSize: '0.56rem', letterSpacing: '0.14em', color: '#a99f90', textTransform: 'uppercase' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="hero-deck" style={{ position: 'relative', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeUp 0.9s ease 0.35s both' }}>
              <div style={{ position: 'absolute', inset: '12% 10% 10%', borderRadius: 34, background: 'radial-gradient(circle at center, rgba(232,213,183,0.15) 0%, rgba(232,213,183,0.05) 38%, transparent 72%)', filter: 'blur(10px)' }} />
              <div style={{ position: 'relative', width: '100%', maxWidth: 450, display: 'grid', gap: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <div style={{ padding: '0.5rem 0.8rem', borderRadius: 999, border: '1px solid rgba(232,213,183,0.16)', background: 'rgba(6,6,6,0.72)', ...mono, fontSize: '0.54rem', letterSpacing: '0.18em', color: '#b7aa95', textTransform: 'uppercase', backdropFilter: 'blur(12px)' }}>
                    Live Drop Board
                  </div>
                  <span style={{ ...mono, fontSize: '0.54rem', letterSpacing: '0.16em', color: '#686053', textTransform: 'uppercase' }}>
                    Auto-rotating picks
                  </span>
                </div>

                {activeHeroCard && (
                  <Link
                    href={activeHeroCard.href}
                    style={{
                      position: 'relative', overflow: 'hidden',
                      display: 'grid', gap: '1.2rem', minHeight: 286,
                      padding: '1.45rem', textDecoration: 'none',
                      borderRadius: 30, border: '1px solid rgba(232,213,183,0.22)',
                      background: `linear-gradient(145deg, ${activeHeroCard.accent}, rgba(10,10,10,0.96) 42%, rgba(4,4,4,0.98) 100%)`,
                      boxShadow: '0 28px 60px rgba(0,0,0,0.32)', backdropFilter: 'blur(14px)',
                    }}
                  >
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(140deg, rgba(255,255,255,0.08), transparent 42%, rgba(0,0,0,0.16))', pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <p style={{ ...mono, fontSize: '0.56rem', letterSpacing: '0.26em', color: '#e8d5b7', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                        {activeHeroCard.eyebrow}
                      </p>
                      <h3 style={{ ...serif, fontSize: 'clamp(1.55rem, 2.3vw, 2.15rem)', lineHeight: 1.02, color: '#f7f1e8', fontWeight: 300, margin: '0 0 0.7rem', maxWidth: 360 }}>
                        {activeHeroCard.title}
                      </h3>
                      <p style={{ color: '#b9b0a2', lineHeight: 1.75, margin: 0, maxWidth: 340 }}>
                        {activeHeroCard.detail}
                      </p>
                    </div>
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.22em', color: '#857c70', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
                          Why It Matters
                        </p>
                        <p style={{ ...serif, fontSize: '1.3rem', color: '#f0ece4', margin: 0, fontWeight: 300 }}>
                          {activeHeroCard.meta}
                        </p>
                      </div>
                      <span style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.16em', color: '#0b0b0b', background: '#e8d5b7', borderRadius: 999, padding: '0.72rem 1rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {activeHeroCard.label}
                      </span>
                    </div>
                  </Link>
                )}

                <div style={{ display: 'grid', gap: '0.55rem' }}>
                  {heroDeckCards.map((card, index) => {
                    const active = index === activeDeckCard
                    return (
                      <button
                        key={card.title}
                        type="button"
                        onMouseEnter={() => setActiveDeckCard(index)}
                        onClick={() => setActiveDeckCard(index)}
                        style={{
                          display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                          gap: '0.8rem', alignItems: 'center', textAlign: 'left',
                          padding: '0.85rem 0.95rem', borderRadius: 18,
                          border: `1px solid ${active ? 'rgba(232,213,183,0.24)' : 'rgba(255,255,255,0.08)'}`,
                          background: active ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer', transition: 'all 220ms ease',
                        }}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#e8d5b7' : '#3f3b35', boxShadow: active ? '0 0 0 6px rgba(232,213,183,0.08)' : 'none' }} />
                        <div>
                          <p style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.2em', color: active ? '#b8ab96' : '#686053', textTransform: 'uppercase', margin: '0 0 0.2rem' }}>
                            {card.eyebrow}
                          </p>
                          <p style={{ color: active ? '#f0ece4' : '#a69a89', margin: 0, lineHeight: 1.5 }}>
                            {card.title}
                          </p>
                        </div>
                        <span style={{ ...mono, fontSize: '0.5rem', letterSpacing: '0.18em', color: active ? '#e8d5b7' : '#686053', textTransform: 'uppercase' }}>
                          Open
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
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
              <div key={label} style={{ flex: '1 0 100px', padding: '0.85rem 0.75rem', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ ...serif, fontSize: '1.2rem', fontWeight: 300, color: '#e8d5b7', margin: '0 0 2px' }}>{val}</p>
                <p style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.18em', color: '#3a3a3a', textTransform: 'uppercase', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ANNOUNCEMENT STRIP
      ════════════════════════════════════════ */}
      <div style={{ background: '#e8d5b7', padding: '0.6rem 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-flex', gap: '3rem', animation: 'marquee 20s linear infinite', ...mono, fontSize: '0.6rem', letterSpacing: '0.2em', color: '#0c0c0c' }}>
          {['FREE DELIVERY ON ORDERS ABOVE RS 5000', 'CUSTOM KITS IN 15 DAYS', 'AUTHENTIC QUALITY GUARANTEED', 'WHATSAPP SUPPORT 24/7', 'NEW ARRIVALS EVERY WEEK', 'FREE DELIVERY ON ORDERS ABOVE RS 5000', 'CUSTOM KITS IN 15 DAYS', 'AUTHENTIC QUALITY GUARANTEED', 'WHATSAPP SUPPORT 24/7', 'NEW ARRIVALS EVERY WEEK'].map((t, i) => (
            <span key={i}>⚽ {t}</span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ════════════════════════════════════════
          CATEGORIES
      ════════════════════════════════════════ */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div {...reveal(0)} style={{ ...reveal(0).style, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: '#444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Browse</p>
            <h2 style={{ ...serif, fontSize: '1.8rem', fontWeight: 300, color: '#f0ece4', margin: 0 }}>Shop by Category</h2>
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
              <Link href={cat.href} style={{ textDecoration: 'none', display: 'block', position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '2/3', background: '#111', maxHeight: '320px' }}
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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)' }} />
                <div className="cat-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(232,213,183,0.07)', opacity: 0, transition: 'opacity 0.3s ease' }} />
                <div className="cat-label" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem', transition: 'transform 0.35s ease' }}>
                  <p style={{ ...mono, fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(232,213,183,0.6)', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>{cat.count}</p>
                  <p style={{ ...serif, fontSize: '1.3rem', fontWeight: 300, color: '#f0ece4', margin: 0, lineHeight: 1.2 }}>{cat.label}</p>
                </div>
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
          SPOTLIGHT / TOP PICK
      ════════════════════════════════════════ */}
      {topPick && (
        <section style={{ maxWidth: 1400, margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(320px, 0.9fr)', gap: '1rem' }} className="home-insights-grid">
            <Link
              href={`/products/${topPick.id}`}
              {...reveal(0)}
              style={{
                ...reveal(0).style,
                textDecoration: 'none', position: 'relative', overflow: 'hidden',
                borderRadius: 18, border: '1px solid rgba(232,213,183,0.12)',
                background: 'linear-gradient(135deg, rgba(232,213,183,0.1), rgba(12,12,12,0.96) 55%)',
                minHeight: 320, display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(220px, 0.95fr)',
              }}
              className="home-spotlight-card"
            >
              <div style={{ padding: 'clamp(1.6rem,3vw,2.4rem)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', position: 'relative', zIndex: 2 }}>
                <div>
                  <p style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.32em', color: 'rgba(232,213,183,0.62)', textTransform: 'uppercase', marginBottom: '0.9rem' }}>
                    Matchday Spotlight
                  </p>
                  <h3 style={{ ...serif, fontSize: 'clamp(1.8rem,3vw,2.6rem)', lineHeight: 1, color: '#f5f0e8', fontWeight: 300, margin: '0 0 0.8rem' }}>
                    {topPick.name}
                  </h3>
                  <p style={{ color: '#7d766c', lineHeight: 1.8, maxWidth: 420, margin: 0 }}>
                    A high-demand pick for players who want standout quality, fast delivery, and a cleaner matchday look.
                  </p>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                  {[
                    topPick.category_name || 'Football Essential',
                    `${parseNumber(topPick.rating, 4.7).toFixed(1)} rating`,
                    `${parseNumber(topPick.review_count)} reviews`,
                    parseNumber(topPick.stock) > 0 ? `${parseNumber(topPick.stock)} in stock` : 'Limited availability',
                  ].map((item) => (
                    <span key={item} style={{ padding: '0.5rem 0.8rem', borderRadius: 999, border: '1px solid rgba(232,213,183,0.15)', background: 'rgba(255,255,255,0.02)', ...mono, fontSize: '0.6rem', letterSpacing: '0.14em', color: '#cdbfa9', textTransform: 'uppercase' }}>
                      {item}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ ...mono, fontSize: '0.55rem', letterSpacing: '0.24em', color: '#6b645b', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>
                      Today&apos;s Price
                    </p>
                    <p style={{ ...serif, fontSize: '2rem', color: '#f5f0e8', fontWeight: 300, margin: 0 }}>
                      Rs {parseNumber(topPick.price).toFixed(0)}
                    </p>
                  </div>
                  <span style={{ ...mono, fontSize: '0.68rem', letterSpacing: '0.24em', color: '#0c0c0c', background: '#e8d5b7', borderRadius: 999, padding: '0.8rem 1.3rem', fontWeight: 600 }}>
                    SHOP THIS PICK
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', minHeight: 320, background: '#080808' }}>
                <img src={topPick.image_url || '/images/jersey.webp'} alt={topPick.name} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.86)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0) 35%, rgba(12,12,12,0.5) 100%)' }} />
              </div>
            </Link>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div {...reveal(80)} style={{ ...reveal(80).style, borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', background: '#101010', padding: '1.35rem' }}>
                <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.28em', color: '#6e6558', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Store Pulse
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.85rem' }}>
                  {[
                    { value: `${inStockCount}+`, label: 'Ready To Ship' },
                    { value: `${recentDropsCount}`, label: 'Fresh Drops' },
                    { value: `${averageRating}`, label: 'Average Rating' },
                    { value: `${lowStockCount}`, label: 'Low Stock Alerts' },
                  ].map((item) => (
                    <div key={item.label} style={{ padding: '0.85rem', borderRadius: 14, background: '#0b0b0b', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <p style={{ ...serif, fontSize: '1.55rem', color: '#f0ece4', margin: '0 0 0.25rem', fontWeight: 300 }}>{item.value}</p>
                      <p style={{ ...mono, fontSize: '0.58rem', color: '#555', letterSpacing: '0.16em', margin: 0, textTransform: 'uppercase' }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div {...reveal(140)} style={{ ...reveal(140).style, borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', background: '#101010', padding: '1.35rem' }}>
                <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.28em', color: '#6e6558', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  Why Shop Here
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    'Cash on delivery available across Pakistan.',
                    'Restock alerts and new drop updates by email.',
                    'Team orders and custom kits handled fast on WhatsApp.',
                  ].map((item) => (
                    <div key={item} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ color: '#e8d5b7', fontSize: '0.9rem', lineHeight: 1.4 }}>+</span>
                      <p style={{ color: '#8a8379', margin: 0, lineHeight: 1.7 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          PRODUCTS COLLECTION
      ════════════════════════════════════════ */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
        <div {...reveal(0)} style={{ ...reveal(0).style, marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: '#444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Our Collection
              </p>
              <h2 style={{ ...serif, fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300, color: '#f0ece4', margin: 0 }}>
                All Products
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.9rem' }}>
                {['Best sellers', 'COD available', 'Weekly restocks'].map((item) => (
                  <span key={item} style={{ padding: '0.38rem 0.7rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', ...mono, fontSize: '0.55rem', letterSpacing: '0.14em', color: '#8d8478', textTransform: 'uppercase' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ ...mono, fontSize: '0.62rem', color: '#3a3a3a' }}>
              Showing {sortedProducts.length} of {filteredByCategory.length} products
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }} className="products-toolbar">
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#666', ...mono, fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Sort
                <select value={sortBy} onChange={event => setSortBy(event.target.value)} style={{ background: '#101010', color: '#f0ece4', border: '1px solid #232323', borderRadius: 999, padding: '0.6rem 0.95rem', ...mono, fontSize: '0.6rem', letterSpacing: '0.12em', outline: 'none' }}>
                  <option value="featured">Featured</option>
                  <option value="top-rated">Top Rated</option>
                  <option value="most-reviewed">Most Reviewed</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </label>

              <button onClick={() => setStockOnly(value => !value)} style={{ padding: '0.6rem 1rem', borderRadius: 999, border: `1px solid ${stockOnly ? '#e8d5b7' : '#232323'}`, background: stockOnly ? 'rgba(232,213,183,0.12)' : '#101010', color: stockOnly ? '#e8d5b7' : '#8b8b8b', ...mono, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                {stockOnly ? 'In Stock Only On' : 'In Stock Only'}
              </button>

              {(filter !== 'all' || sortBy !== 'featured' || stockOnly) && (
                <button onClick={resetCollectionControls} style={{ padding: '0.6rem 1rem', borderRadius: 999, border: '1px solid #2a2a2a', background: 'transparent', color: '#8b8b8b', ...mono, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {error ? (
          <div><p style={{ ...mono, color: '#f87171', fontSize: '0.8rem' }}>{error}</p></div>
        ) : sortedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <p style={{ ...mono, fontSize: '0.8rem', color: '#444' }}>Try another filter or turn stock-only off.</p>
          </div>
        ) : (
          <>
            <div {...reveal(60)} style={{ ...reveal(60).style, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.85rem', marginBottom: '1.35rem' }} className="products-insights-grid">
              {productHighlights.map((item) => (
                <div key={item.label} style={{ padding: '1rem 1.1rem', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg, rgba(18,18,18,0.92), rgba(10,10,10,0.98))' }}>
                  <p style={{ ...mono, fontSize: '0.55rem', letterSpacing: '0.22em', color: '#6a6156', textTransform: 'uppercase', margin: '0 0 0.55rem' }}>
                    {item.label}
                  </p>
                  <p style={{ ...serif, fontSize: '1.6rem', color: '#f0ece4', fontWeight: 300, margin: '0 0 0.2rem' }}>
                    {item.value}
                  </p>
                  <p style={{ color: '#7f786f', margin: 0, lineHeight: 1.7 }}>
                    {item.note}
                  </p>
                </div>
              ))}
            </div>

            <div {...reveal(100)} style={{ ...reveal(100).style }}>
              <ProductGrid products={sortedProducts} />
            </div>
          </>
        )}
      </section>

      {/* ════════════════════════════════════════
          CUSTOM KITS BANNER
      ════════════════════════════════════════ */}
      <section style={{ margin: '0 1.5rem clamp(3rem,6vw,5rem)', maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto' }}>
        <div {...reveal(0)} style={{ ...reveal(0).style }}>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: 'linear-gradient(135deg, #0f0e0a 0%, #1a1508 50%, #0a0f08 100%)', border: '1px solid rgba(232,213,183,0.12)', padding: 'clamp(2.5rem,5vw,4rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'absolute', right: -60, top: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,213,183,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 80, bottom: -80, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(232,213,183,0.06)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.35em', color: 'rgba(232,213,183,0.5)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                ✦ Custom Manufacturing
              </p>
              <h2 style={{ ...serif, fontSize: 'clamp(1.6rem,2.5vw,2.2rem)', fontWeight: 300, color: '#f0ece4', margin: '0 0 0.75rem', lineHeight: 1.1 }}>
                Design Your Own<br /><em style={{ color: '#e8d5b7' }}>Football Kit</em>
              </h2>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 440, marginBottom: 0 }}>
                Full custom sublimation printing. Your logo, colors, and name. Delivered in 15 days.
              </p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
              <Link href="/custom-kits" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '1rem 2.25rem', background: '#e8d5b7', color: '#0a0a0a', ...mono, fontSize: '0.7rem', letterSpacing: '0.2em', borderRadius: 6, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0e4ca'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#e8d5b7'; e.currentTarget.style.transform = 'none' }}>
                GET FREE MOCKUP →
              </Link>
              <a href="https://wa.me/923118186132" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem 2rem', border: '1px solid rgba(37,211,102,0.3)', background: 'rgba(37,211,102,0.05)', borderRadius: 6, ...mono, fontSize: '0.68rem', letterSpacing: '0.15em', color: '#25d366', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.05)'}>
                💬 WHATSAPP US
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SOCIAL / NEWSLETTER
      ════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #0f0f0f', background: '#080808', padding: 'clamp(3rem,5vw,4rem) 1.5rem' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center' }}>
          <div {...reveal(0)} style={{ ...reveal(0).style, marginBottom: '2.5rem', padding: 'clamp(1.6rem,3vw,2.25rem)', borderRadius: 18, border: '1px solid rgba(232,213,183,0.12)', background: 'linear-gradient(135deg, rgba(232,213,183,0.08), rgba(12,12,12,0.96) 60%)' }} className="newsletter-panel">
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(280px, 0.9fr)', gap: '1.5rem', alignItems: 'center' }} className="newsletter-grid">
              <div style={{ textAlign: 'left' }}>
                <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.34em', color: 'rgba(232,213,183,0.6)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                  Members Club
                </p>
                <h2 style={{ ...serif, fontSize: 'clamp(1.7rem,2.8vw,2.3rem)', fontWeight: 300, color: '#f0ece4', margin: '0 0 0.75rem' }}>
                  Get first access to restocks, launches, and match-week offers.
                </h2>
                <p style={{ color: '#8a8379', lineHeight: 1.8, margin: 0 }}>
                  Join the list for size restock alerts, limited jersey drops, and members-only football deals.
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                  <input type="email" value={newsletterEmail} onChange={event => setNewsletterEmail(event.target.value)} placeholder="Enter your email" aria-label="Email address" style={{ flex: '1 1 220px', minWidth: 0, padding: '0.95rem 1rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', background: '#0b0b0b', color: '#f0ece4', outline: 'none' }} />
                  <button type="submit" disabled={submittingNewsletter} style={{ padding: '0.95rem 1.35rem', borderRadius: 999, border: '1px solid #e8d5b7', background: submittingNewsletter ? 'rgba(232,213,183,0.15)' : '#e8d5b7', color: submittingNewsletter ? '#e8d5b7' : '#0c0c0c', cursor: submittingNewsletter ? 'default' : 'pointer', ...mono, fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}>
                    {submittingNewsletter ? 'Joining...' : 'Join Now'}
                  </button>
                </form>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: newsletterState.message ? '0.85rem' : 0 }}>
                  {['Restock alerts', 'Drop reminders', 'Exclusive offers'].map((item) => (
                    <span key={item} style={{ padding: '0.4rem 0.7rem', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', background: '#0d0d0d', ...mono, fontSize: '0.55rem', letterSpacing: '0.14em', color: '#9f9585', textTransform: 'uppercase' }}>
                      {item}
                    </span>
                  ))}
                </div>
                {newsletterState.message && (
                  <p style={{ margin: 0, color: newsletterState.type === 'success' ? '#b7f0cc' : '#ffb4b4', lineHeight: 1.7 }}>
                    {newsletterState.message}
                  </p>
                )}
              </div>
            </div>
          </div>

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
              <a key={s.icon} href={s.href} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', border: '1px solid #1a1a1a', borderRadius: 6, ...mono, fontSize: '0.65rem', letterSpacing: '0.1em', color: '#555', textDecoration: 'none', transition: 'all 0.2s ease', background: '#0c0c0c' }}
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
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }

        @media (max-width: 1100px) {
          .hero-shell { grid-template-columns: 1fr !important; }
          .hero-deck { min-height: 360px !important; margin-top: 0.75rem !important; }
          .products-insights-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .cats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .features-strip { grid-template-columns: repeat(2,1fr) !important; }
          .home-insights-grid { grid-template-columns: 1fr !important; }
          .home-spotlight-card { grid-template-columns: 1fr !important; }
          .products-toolbar { align-items: stretch !important; }
          .products-insights-grid { grid-template-columns: 1fr !important; }
          .newsletter-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .cats-grid { grid-template-columns: repeat(2,1fr) !important; gap: 0.5rem !important; }
          .features-strip { grid-template-columns: 1fr 1fr !important; }
          .hero-deck { min-height: 310px !important; }
          .newsletter-panel { padding: 1.1rem !important; }
        }
      `}</style>
    </div>
  )
}