// components/CategoryPageLayout.jsx
import { getProductsByCategory } from '../lib/queries'
import ProductGrid from './ProductGrid'

const HERO_IMAGES = {
  footballshoes: '/images/Footballshoes.webp',
  jerseys:       '/images/jersey.webp',
  footballs:     '/images/Football.webp',
  shopforkids:   '/images/Shopforkids.webp',
}

export default async function CategoryPageLayout({ slug, title, subtitle, heroLabel }) {
  let products = []
  let error = null

  try {
    products = await getProductsByCategory(slug)
  } catch (err) {
    error = 'Failed to load products.'
    console.error(err)
  }

  const heroImage = HERO_IMAGES[slug] || HERO_IMAGES['jerseys']

  return (
    <div className="page">

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        height: 'clamp(220px, 35vw, 320px)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.3)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(to top, #0c0c0c, transparent)',
        }} />

        <div style={{ position: 'relative', zIndex: 10, padding: '0 1.5rem', maxWidth: 700 }}>
          <p style={{
            fontFamily: 'DM Mono, monospace', fontSize: '0.62rem',
            letterSpacing: '0.4em', color: '#e8d5b7',
            textTransform: 'uppercase', marginBottom: '0.7rem',
            animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both',
          }}>
            {heroLabel || 'SS 2026 COLLECTION'}
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 300, color: '#f0ece4',
            lineHeight: 1.05, margin: '0 0 0.6rem',
            animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6, margin: 0,
              animation: 'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both',
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* ── Products ── */}
      <div className="page__products-wrap">
        <h2 className="page__section-title">{title}</h2>
        {error ? (
          <div className="error-box"><p className="error-box__text">{error}</p></div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  )
}