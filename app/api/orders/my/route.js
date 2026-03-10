// app/api/orders/my/route.js

import { NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import { getUserOrders } from '../../../../lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ success: false, error: 'Not logged in' }, { status: 401 })

    const orders = await getUserOrders(user.id)
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}
