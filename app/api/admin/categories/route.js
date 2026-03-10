// app/api/admin/categories/route.js

import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db'

export async function GET() {
  try {
    const [rows] = await query('SELECT * FROM categories ORDER BY name ASC')
    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
