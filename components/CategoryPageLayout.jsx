// components/CategoryPageLayout.jsx
// Shared layout for all category pages (server component)

import { getProductsByCategory } from '../lib/queries'
import ProductGrid from './ProductGrid'

export default async function CategoryPageLayout({ slug, title, subtitle, heroLabel }) {
  let products = []
  let error = null

  try {
    products = await getProductsByCategory(slug)
  } catch (err) {
    error = 'Failed to load products.'
    console.error(err)
  }

  return (
    <div className="page">
      {/* Mini Hero */}
      <section className="home-hero" style={{ height: 260 }}>
        <div className="home-hero__overlay" />
        <div className="home-hero__content">
          <p className="home-hero__label">{heroLabel || 'SS 2026 COLLECTION'}</p>
          <h1 className="home-hero__title" style={{ fontSize: '3.5rem' }}>
            {title}
          </h1>
          {subtitle && <p className="home-hero__sub">{subtitle}</p>}
        </div>
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
