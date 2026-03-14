// app/api/admin/products/[id]/route.js
import { NextResponse } from 'next/server'
import { query } from '../../../../../lib/db'

export async function PUT(request, { params }) {
  try {
    const body = await request.json()
    const {
      category_id, name, description, price, image_url, image_urls,
      tag, tag_color, rating, review_count, stock, is_active,
      sizes, // ✅ added
    } = body

    await query(`
      UPDATE products SET
        category_id=?, name=?, description=?, price=?, image_url=?, image_urls=?,
        tag=?, tag_color=?, rating=?, review_count=?, stock=?, is_active=?,
        sizes=?, updated_at=NOW()
      WHERE id=?
    `, [
      Number(category_id),
      name.trim(),
      description?.trim() || null,
      parseFloat(price),
      image_url?.trim() || null,
      image_urls?.trim() || null,
      tag?.trim() || null,
      tag_color || '#e8d5b7',
      parseFloat(rating) || 4.5,
      parseInt(review_count) || 0,
      parseInt(stock) || 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      sizes?.trim() || null, // ✅ added
      Number(params.id),
    ])

    const [updated] = await query(`
      SELECT p.*, c.name AS category_name FROM products p
      JOIN categories c ON p.category_id = c.id WHERE p.id=?
    `, [Number(params.id)])

    return NextResponse.json({ success: true, data: updated[0] })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await query('DELETE FROM products WHERE id=?', [Number(params.id)])
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}