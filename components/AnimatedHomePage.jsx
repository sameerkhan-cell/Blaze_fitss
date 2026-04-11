'use client'
// components/AnimatedHomePage.jsx

import { useEffect } from 'react'
import ProductGrid from './ProductGrid'

export default function AnimatedHomePage({ products, categories, query, error }) {

  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .page__section-title')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="page">
      <section className="home-categories">
        <h2 className="home-categories__title reveal">Shop by Category</h2>
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
      <div className="page__products-wrap">
        <h2 className="page__section-title reveal">
          {query ? `Results for "${query}"` : 'All Products'}
        </h2>
        {error ? (
          <div className="error-box"><p className="error-box__text">{error}</p></div>
        ) : products.length === 0 ? (
          <p className="page__no-results"> COMING SOON </p>
        ) : (
          <div className="reveal"><ProductGrid products={products} /></div>
        )}
      </div>
    </div>
  )
}