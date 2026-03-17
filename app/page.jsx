// app/page.jsx
import { getAllProducts, searchProducts } from '../lib/queries'
import ProductGrid from '../components/ProductGrid'

export const revalidate = 60

export default async function HomePage({ searchParams }) {
  const query = searchParams?.search || ''

  let products = []
  let error = null

  try {
    products = query ? await searchProducts(query) : await getAllProducts()
  } catch (err) {
    error = 'Failed to load products.'
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
        <div className="home-hero__overlay" />

        <div className="home-hero__left">
          <p className="home-hero__label hero-animate-1">SS 2026 Collection</p>
          <h1 className="home-hero__title hero-animate-2">
            Wear What<br /><em>Matters</em>
          </h1>
          <p className="home-hero__sub hero-animate-3">Premium football gear for champions.</p>
          <div className="hero-animate-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <a href="/jerseys" style={{
              display: 'inline-block', padding: '0.8rem 2rem',
              background: '#e8d5b7', color: '#0c0c0c',
              fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
              letterSpacing: '0.2em', borderRadius: '4px', fontWeight: 500,
              textDecoration: 'none',
            }}>SHOP NOW</a>
            <a href="/custom-kits" style={{
              display: 'inline-block', padding: '0.8rem 2rem',
              background: 'none', color: '#888', border: '1px solid #2a2a2a',
              fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
              letterSpacing: '0.2em', borderRadius: '4px', textDecoration: 'none',
            }}>CUSTOM KITS</a>
          </div>
        </div>

        <div className="home-hero__img-panel">
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to right, #0c0c0c 0%, rgba(12,12,12,0.5) 30%, transparent 70%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, zIndex: 2, background: 'linear-gradient(to top, #0c0c0c, transparent)' }} />
          <img
            src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1000&q=80"
            alt="Football hero"
            fetchPriority="high"
            loading="eager"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55)', display: 'block' }}
          />
        </div>

        <div className="home-hero__stats hero-animate-4" style={{ zIndex: 3 }}>
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
              <img src={cat.img} alt={cat.label} className="home-cat-tile__img" loading="lazy" decoding="async" />
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
          <div className="error-box"><p className="error-box__text">{error}</p></div>
        ) : products.length === 0 ? (
          <p className="page__no-results">No products found.</p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}