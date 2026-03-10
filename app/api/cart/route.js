// app/api/cart/route.js

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCartWithItems, addToCart } from '../../../lib/queries'
import { v4 as uuidv4 } from 'uuid'

function getSessionId() {
  const cookieStore = cookies()
  let sessionId = cookieStore.get('bf_session')?.value
  return sessionId || uuidv4()
}

export async function GET() {
  try {
    const cookieStore = cookies()
    let sessionId = cookieStore.get('bf_session')?.value

    if (!sessionId) {
      sessionId = uuidv4()
    }

    const cart = await getCartWithItems(sessionId)

    const response = NextResponse.json({ success: true, data: cart })
    response.cookies.set('bf_session', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return response
  } catch (error) {
    console.error('GET /api/cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const cookieStore = cookies()
    let sessionId = cookieStore.get('bf_session')?.value
    if (!sessionId) sessionId = uuidv4()

    const body = await request.json()
    const { productId, quantity = 1, size = null } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'productId is required' },
        { status: 400 }
      )
    }

    const cart = await addToCart(sessionId, productId, quantity, size)

    const response = NextResponse.json({ success: true, data: cart })
    response.cookies.set('bf_session', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  } catch (error) {
    console.error('POST /api/cart error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}
