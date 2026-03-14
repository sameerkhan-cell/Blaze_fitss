// app/page.jsx
// Home page — shows hero, category tiles, and all products

import { getAllProducts, searchProducts } from '../lib/queries'
import ProductGrid from '../components/ProductGrid'

export const dynamic = 'force-dynamic'

export default async function HomePage({ searchParams }) {
  const query = searchParams?.search || ''

  let products = []
  let error = null

  try {
    products = query
      ? await searchProducts(query)
      : await getAllProducts()
  } catch (err) {
    error = 'Failed to load products. Please check your connection.'
    console.error(err)
  }

  const categories = [
    { label: 'Jerseys',        href: '/jerseys',       img: '/images/jersey.webp' },
    { label: 'Football Shoes', href: '/footballshoes', img: '/images/Footballshoes.webp' },
    { label: 'Footballs',      href: '/footballs',     img: '/images/Football.webp' },
    { label: 'Kids',           href: '/shopforkids',   img: '/images/Shopforkids.webp' },
  ]

  return (
    <div className="page">

      {/* ── HERO ── */}
      <section className="home-hero" style={{ overflow: 'hidden', padding: 0, minHeight: 540 }}>

        {/* Radial glow overlay */}
        <div className="home-hero__overlay" />

        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Left — text content */}
        <div style={{
          position: 'relative', zIndex: 2,
          flex: '0 0 auto', width: '50%',
          padding: '4rem 3rem 4rem 4rem',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }} className="home-hero__left">
          <p className="home-hero__label">SS 2026 Collection</p>
          <h1 className="home-hero__title">
            Wear What<br /><em>Matters</em>
          </h1>
          <p className="home-hero__sub">Premium football gear for champions.</p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <a href="/jerseys" style={{
              display: 'inline-block', padding: '0.8rem 2rem',
              background: '#e8d5b7', color: '#0c0c0c',
              fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
              letterSpacing: '0.2em', borderRadius: '4px', fontWeight: 500,
              textDecoration: 'none', transition: 'opacity 0.2s',
            }}
              onMouseEnter={undefined}
            >
              SHOP NOW
            </a>
            <a href="/custom-kits" style={{
              display: 'inline-block', padding: '0.8rem 2rem',
              background: 'none', color: '#888',
              border: '1px solid #2a2a2a',
              fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
              letterSpacing: '0.2em', borderRadius: '4px',
              textDecoration: 'none',
            }}>
              CUSTOM KITS
            </a>
          </div>
        </div>

        {/* Right — hero image */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '52%', height: '100%',
          zIndex: 1,
        }} className="home-hero__img-panel">
          {/* Fade from left so it blends into the dark bg */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2,
            background: 'linear-gradient(to right, #0c0c0c 0%, rgba(12,12,12,0.5) 30%, transparent 70%)',
          }} />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, zIndex: 2,
            background: 'linear-gradient(to top, #0c0c0c, transparent)',
          }} />
          <img
            src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1000&q=85"
            alt="Football hero"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              filter: 'brightness(0.55)',
              display: 'block',
            }}
          />
        </div>

        {/* Stats — bottom right */}
        <div className="home-hero__stats" style={{ zIndex: 3 }}>
          {[
            [products.length > 0 ? `${products.length}+` : '16+', 'Products'],
            ['4', 'Categories'],
            ['4.7★', 'Avg. Rating'],
          ].map(([val, label]) => (
            <div key={label} className="home-hero__stat">
              <span className="home-hero__stat-val">{val}</span>
              <span className="home-hero__stat-label">{label}</span>
            </div>
          ))}
        </div>

      </section>

      {/* ── CATEGORIES ── */}
      <section className="home-categories">
        <h2 className="home-categories__title">Shop by Category</h2>
        <div className="home-cats-grid">
          {categories.map(cat => (
            <a key={cat.label} href={cat.href} className="home-cat-tile">
              <img src={cat.img} alt={cat.label} className="home-cat-tile__img" />
              <div className="home-cat-tile__overlay" />
              <span className="home-cat-tile__label">{cat.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <div className="page__products-wrap">
        <h2 className="page__section-title">
          {query ? `Results for "${query}"` : 'All Products'}
        </h2>

        {error ? (
          <div className="error-box">
            <p className="error-box__text">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <p className="page__no-results">No products found.</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}