// app/api/admin/orders/[id]/route.js

import { NextResponse } from 'next/server'
import { query } from '../../../../../lib/db'
import { sendOrderStatusEmail } from '../../../../../lib/email'

export const dynamic = 'force-dynamic'

export async function PUT(request, { params }) {
  try {
    const { status } = await request.json()
    const valid = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

    if (!valid.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
    }

    // Update status in DB
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, params.id])

    // Fetch full order + items
    const [orders] = await query('SELECT * FROM orders WHERE id = ?', [params.id])
    const order = orders[0]

    if (order) {
      const [items] = await query(`
        SELECT oi.*, p.image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id])
      order.items = items

      // Send email — won't crash if email fails
      sendOrderStatusEmail(order, status).catch(err =>
        console.error('Email failed:', err.message)
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}