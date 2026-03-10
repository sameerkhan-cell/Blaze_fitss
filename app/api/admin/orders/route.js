// app/api/admin/orders/route.js

import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db'

export async function GET() {
  try {
    // Get all orders
    const [orders] = await query(`
      SELECT * FROM orders ORDER BY created_at DESC
    `)

    // For each order, get its items
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const [items] = await query(`
          SELECT oi.*, p.image_url
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `, [order.id])
        return { ...order, items }
      })
    )

    return NextResponse.json({ success: true, data: ordersWithItems })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}