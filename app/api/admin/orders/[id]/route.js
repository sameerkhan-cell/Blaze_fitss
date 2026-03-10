// app/api/admin/orders/[id]/route.js

import { NextResponse } from 'next/server'
import { query } from '../../../../../lib/db'

export async function PUT(request, { params }) {
  try {
    const { status } = await request.json()
    const valid = ['pending','confirmed','shipped','delivered','cancelled']
    if (!valid.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 })
    }
    await query('UPDATE orders SET status = ? WHERE id = ?', [status, params.id])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
