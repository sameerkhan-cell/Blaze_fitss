// app/api/products/route.js

import { NextResponse } from 'next/server'
import { getAllProducts, searchProducts } from '../../../lib/queries'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    const products = search
      ? await searchProducts(search)
      : await getAllProducts()

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
