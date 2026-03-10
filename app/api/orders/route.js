// app/api/orders/route.js

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createOrder, getAllOrders } from '../../../lib/queries'
import { getCurrentUser } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('bf_session')?.value

    console.log('POST /api/orders - sessionId:', sessionId)

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'No active session / empty cart' }, { status: 400 })
    }

    const body = await request.json()
    console.log('POST /api/orders - body:', body)

    const { name, email, phone, address, city, country, paymentMethod, notes } = body

    if (!name || !email || !address) {
      return NextResponse.json({ success: false, error: 'name, email and address are required' }, { status: 400 })
    }

    const user = await getCurrentUser()
    console.log('POST /api/orders - user:', user?.id || 'guest')

    const order = await createOrder(sessionId, {
      name, email, phone, address, city,
      country: country || 'Pakistan',
      paymentMethod: paymentMethod || 'cod',
      notes,
    }, user?.id || null)

    console.log('POST /api/orders - order created:', order?.order_number)

    return NextResponse.json({ success: true, data: order }, { status: 201 })

  } catch (error) {
    // Log the FULL error so we can see exactly what's failing
    console.error('POST /api/orders error:', error.message)
    console.error('Full error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to create order' 
    }, { status: 500 })
  }
}