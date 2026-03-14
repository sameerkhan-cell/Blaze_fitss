// app/api/orders/route.js

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createOrder, getAllOrders, getCartWithItems } from '../../../lib/queries'
import { getCurrentUser } from '../../../lib/auth'
import { sendNewOrderEmail } from '../../../lib/email'

export const dynamic = 'force-dynamic'

// ── GET all orders (admin) ────────────────────────────────────────────────────
export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// ── POST create order ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('bf_session')?.value

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'No active session / empty cart' }, { status: 400 })
    }

    const body = await request.json()
    const { name, email, phone, address, city, country, paymentMethod, notes } = body

    if (!name || !email || !address) {
      return NextResponse.json({ success: false, error: 'name, email and address are required' }, { status: 400 })
    }

    // ✅ Snapshot cart items BEFORE createOrder clears the cart
    const { items: cartItems } = await getCartWithItems(sessionId)

    const user = await getCurrentUser()

    const order = await createOrder(sessionId, {
      name, email, phone, address, city,
      country: country || 'Pakistan',
      paymentMethod: paymentMethod || 'cod',
      notes,
    }, user?.id || null)

    console.log('Order created:', order?.order_number)

    // ✅ Send admin notification email (fire-and-forget)
    sendNewOrderEmail(order, cartItems).catch(err =>
      console.error('New order email failed:', err.message)
    )

    return NextResponse.json({ success: true, data: order }, { status: 201 })

  } catch (error) {
    console.error('POST /api/orders error:', error.message)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create order'
    }, { status: 500 })
  }
}