// app/api/orders/[orderNumber]/route.js

import { NextResponse } from 'next/server'
import { getOrderByNumber } from '../../../../lib/queries'

export async function GET(request, { params }) {
  try {
    const order = await getOrderByNumber(params.orderNumber)
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    console.error('GET /api/orders/[orderNumber] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
