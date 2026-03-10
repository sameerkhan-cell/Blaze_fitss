// app/api/cart/[itemId]/route.js

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { updateCartItem, removeCartItem, getCartWithItems } from '../../../../lib/queries'
import { v4 as uuidv4 } from 'uuid'

export async function PUT(request, { params }) {
  try {
    const cookieStore = cookies()
    let sessionId = cookieStore.get('bf_session')?.value
    if (!sessionId) sessionId = uuidv4()

    const { quantity } = await request.json()
    await updateCartItem(params.itemId, quantity)

    const cart = await getCartWithItems(sessionId)
    const response = NextResponse.json({ success: true, data: cart })
    response.cookies.set('bf_session', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return response
  } catch (error) {
    console.error('PUT /api/cart/[itemId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = cookies()
    let sessionId = cookieStore.get('bf_session')?.value
    if (!sessionId) sessionId = uuidv4()

    await removeCartItem(params.itemId)

    const cart = await getCartWithItems(sessionId)
    return NextResponse.json({ success: true, data: cart })
  } catch (error) {
    console.error('DELETE /api/cart/[itemId] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove item' },
      { status: 500 }
    )
  }
}
