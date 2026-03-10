// app/api/products/[id]/route.js

import { NextResponse } from 'next/server'
import { getProductById } from '../../../../lib/queries'

export async function GET(request, { params }) {
  try {
    const product = await getProductById(params.id)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
