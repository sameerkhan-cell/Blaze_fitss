// components/ProductGrid.jsx
import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <div className="store-empty">
        <div className="store-empty__icon">📦</div>
        <p className="store-empty__text">No products found.</p>
      </div>
    )
  }

  return (
    <div className="store-grid">
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
