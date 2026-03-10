// app/api/admin/products/route.js
import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db'

export async function GET() {
  try {
    const [rows] = await query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `)
    return NextResponse.json({ success: true, data: rows })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { category_id, name, description, price, image_url, image_urls, tag, tag_color, rating, review_count, stock } = body

    if (!name?.trim())        return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    if (!category_id)         return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 })
    if (!price || price <= 0) return NextResponse.json({ success: false, error: 'Valid price is required' }, { status: 400 })

    const [result] = await query(`
      INSERT INTO products (category_id, name, description, price, image_url, image_urls, tag, tag_color, rating, review_count, stock, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
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
      parseInt(stock) || 100,
    ])

    const [newRows] = await query(`
      SELECT p.*, c.name AS category_name FROM products p
      JOIN categories c ON p.category_id = c.id WHERE p.id = ?
    `, [result.insertId])

    return NextResponse.json({ success: true, data: newRows[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}