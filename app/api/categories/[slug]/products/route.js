// app/api/categories/[slug]/products/route.js

import { NextResponse } from 'next/server'
import { getProductsByCategory } from '../../../../../lib/queries'

export async function GET(request, { params }) {
  try {
    const products = await getProductsByCategory(params.slug)
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('GET /api/categories/[slug]/products error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
