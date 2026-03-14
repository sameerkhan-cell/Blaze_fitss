// components/CategoryPageLayout.jsx
// Shared layout for all category pages (server component)

import { getProductsByCategory } from '../lib/queries'
import ProductGrid from './ProductGrid'

// ── Hero image per category slug ─────────────────────────────────────────────
const HERO_IMAGES = {
  footballshoes: '/images/Footballshoes.webp',
  footballs:     '/images/Football.webp',
  jerseys:       '/images/jersey.webp',
  shopforkids:   '/images/shopforkids.webp',
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
      {/* Hero with background image */}
      <section style={{
        position: 'relative',
        height: 320,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35)',
          transform: 'scale(1.03)',
        }} />

        {/* Gradient overlay — darkens bottom so text is legible */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 100%)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 2.5rem',
          maxWidth: 700,
        }}>
          <p style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            color: '#e8d5b7',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
          }}>
            {heroLabel || 'SS 2026 COLLECTION'}
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 300,
            color: '#f0ece4',
            lineHeight: 1.05,
            margin: '0 0 0.75rem',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              color: '#aaa',
              fontSize: '1rem',
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 420,
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Bottom fade */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          background: 'linear-gradient(to top, #0c0c0c, transparent)',
        }} />
      </section>

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