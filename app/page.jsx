// app/page.jsx
// Home page — shows hero, category tiles, and all products

import { getAllProducts, searchProducts } from '../lib/queries'
import ProductGrid from '../components/ProductGrid'

export const dynamic = 'force-dynamic' // always fresh from DB

export default async function HomePage({ searchParams }) {
  const query = searchParams?.search || ''

  let products = []
  let error = null

  try {
    products = query
      ? await searchProducts(query)
      : await getAllProducts()
  } catch (err) {
    error = 'Failed to load products. Please check your  connection.'
    console.error(err)
  }

  const categories = [
    { label: 'Jerseys',       href: '/jerseys',       img: '/images/jersey.webp' },
    { label: 'Football Shoes',href: '/footballshoes', img: '/images/Footballshoes.webp' },
    { label: 'Footballs',     href: '/footballs',     img: '/images/Football.webp' },
    { label: 'Kids',          href: '/shopforkids',   img: '/images/Shopforkids.webp' },
  ]

  return (
    <div className="page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__overlay" />
        <div className="home-hero__content">
          <p className="home-hero__label">SS 2026 Collection</p>
          <h1 className="home-hero__title">
            Wear What<br /><em>Matters</em>
          </h1>
          <p className="home-hero__sub">Premium football gear for champions.</p>
        </div>
        <div className="home-hero__stats">
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

      {/* Categories */}
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

      {/* Products */}
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
