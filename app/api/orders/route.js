// app/api/orders/route.js

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createOrder, getAllOrders } from '../../../lib/queries'
import { getCurrentUser } from '../../../lib/auth'

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}

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

    // Get logged-in user if any — so order is linked to their account
    const user = await getCurrentUser()

    const order = await createOrder(sessionId, {
      name, email, phone, address, city,
      country: country || 'Pakistan',
      paymentMethod: paymentMethod || 'cod',
      notes,
    }, user?.id || null)  // ← pass userId here

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to create order' }, { status: 500 })
  }
}