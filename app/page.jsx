// app/page.jsx
import { getAllProducts, searchProducts } from '../lib/queries'
import HomeClient from '../components/HomeClient'

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
    { label: 'Jerseys',        href: '/jerseys',       img: '/images/jersey.webp',        count: 'Club & National' },
    { label: 'Football Shoes', href: '/footballshoes', img: '/images/Footballshoes.webp', count: 'Performance Boots' },
    { label: 'Footballs',      href: '/footballs',     img: '/images/Football.webp',       count: 'Match & Training' },
    { label: 'Kids',           href: '/shopforkids',   img: '/images/Shopforkids.webp',    count: 'Young Legends' },
  ]

  return (
    <HomeClient
      products={products}
      categories={categories}
      query={query}
      error={error}
    />
  )
}