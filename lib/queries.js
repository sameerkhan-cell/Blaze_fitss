// lib/queries.js
// High-level DB helpers used by API routes

import { query, getConnection } from './db'
import { v4 as uuidv4 } from 'uuid'

// ────────────────────────────────────────────
//  PRODUCTS
// ────────────────────────────────────────────

export async function getAllProducts() {
  const [rows] = await query(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1
    ORDER BY p.created_at DESC
  `)
  return rows
}

export async function getProductsByCategory(slug) {
  const [rows] = await query(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE c.slug = ? AND p.is_active = 1
    ORDER BY p.created_at DESC
  `, [slug])
  return rows
}

export async function getProductById(id) {
  const [rows] = await query(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = ? AND p.is_active = 1
  `, [id])
  return rows[0] || null
}

export async function searchProducts(term) {
  const like = `%${term}%`
  const [rows] = await query(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = 1
      AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)
    ORDER BY p.name ASC
  `, [like, like, like])
  return rows
}

// ────────────────────────────────────────────
//  CATEGORIES
// ────────────────────────────────────────────

export async function getAllCategories() {
  const [rows] = await query('SELECT * FROM categories ORDER BY name ASC')
  return rows
}

// ────────────────────────────────────────────
//  CART
// ────────────────────────────────────────────

export async function getOrCreateCart(sessionId) {
  const [rows] = await query('SELECT * FROM carts WHERE session_id = ?', [sessionId])
  if (rows.length > 0) return rows[0]

  await query('INSERT INTO carts (session_id) VALUES (?)', [sessionId])
  const [newRows] = await query('SELECT * FROM carts WHERE session_id = ?', [sessionId])
  return newRows[0]
}

export async function getCartWithItems(sessionId) {
  const cart = await getOrCreateCart(sessionId)

  const [items] = await query(`
    SELECT ci.id, ci.quantity, ci.size,
           p.id AS product_id, p.name, p.price, p.image_url, p.stock
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = ?
  `, [cart.id])

  const total = items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0)

  return { cart, items, total: parseFloat(total.toFixed(2)) }
}

export async function addToCart(sessionId, productId, quantity = 1, size = null) {
  const cart = await getOrCreateCart(sessionId)

  // Upsert — if product+size combo exists, increment qty
  const [existing] = await query(
    'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND (size = ? OR (size IS NULL AND ? IS NULL))',
    [cart.id, productId, size, size]
  )

  if (existing.length > 0) {
    await query(
      'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
      [quantity, existing[0].id]
    )
  } else {
    await query(
      'INSERT INTO cart_items (cart_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
      [cart.id, productId, quantity, size]
    )
  }

  return getCartWithItems(sessionId)
}

export async function updateCartItem(cartItemId, quantity) {
  if (quantity <= 0) {
    await query('DELETE FROM cart_items WHERE id = ?', [cartItemId])
  } else {
    await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, cartItemId])
  }
}

export async function removeCartItem(cartItemId) {
  await query('DELETE FROM cart_items WHERE id = ?', [cartItemId])
}

export async function clearCart(sessionId) {
  const cart = await getOrCreateCart(sessionId)
  await query('DELETE FROM cart_items WHERE cart_id = ?', [cart.id])
}

// ────────────────────────────────────────────
//  ORDERS
// ────────────────────────────────────────────

// Replace the createOrder function in lib/queries.js with this

export async function createOrder(sessionId, customerData, userId = null) {
  const { items, total, cart } = await getCartWithItems(sessionId)
  if (!items.length) throw new Error('Cart is empty')

  const conn = await getConnection()

  try {
    await conn.beginTransaction()

    const orderNumber = `BF-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const [orderResult] = await conn.execute(`
      INSERT INTO orders
        (user_id, order_number, customer_name, customer_email, customer_phone,
         shipping_address, city, country, total_amount, payment_method, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId || null,
      orderNumber,
      customerData.name,
      customerData.email,
      customerData.phone || null,
      customerData.address,
      customerData.city || null,
      customerData.country || 'Pakistan',
      total,
      customerData.paymentMethod || 'cod',
      customerData.notes || null,
    ])

    const orderId = orderResult.insertId

    // Batch insert all order items in ONE query
    const placeholders = items.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')
    const values = items.flatMap(item => [
      orderId, item.product_id, item.name, item.price, item.quantity, item.size
    ])
    await conn.execute(
      `INSERT INTO order_items (order_id, product_id, product_name, price, quantity, size) VALUES ${placeholders}`,
      values
    )

    // Batch update stock in ONE query
    const caseStmt = items.map(item =>
      `WHEN id = ${item.product_id} THEN GREATEST(stock - ${item.quantity}, 0)`
    ).join(' ')
    const productIds = items.map(i => i.product_id).join(', ')
    await conn.execute(`
      UPDATE products SET stock = CASE ${caseStmt} ELSE stock END
      WHERE id IN (${productIds})
    `)

    // Clear cart directly
    await conn.execute('DELETE FROM cart_items WHERE cart_id = ?', [cart.id])

    await conn.commit()

    const [orders] = await conn.execute('SELECT * FROM orders WHERE id = ?', [orderId])
    return orders[0]

  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

// ────────────────────────────────────────────
//  NEWSLETTER
// ────────────────────────────────────────────

export async function subscribeNewsletter(email) {
  try {
    await query(
      'INSERT INTO newsletter_subscribers (email) VALUES (?)',
      [email]
    )
    return { success: true }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return { success: true, alreadySubscribed: true }
    }
    throw err
  }
}
export async function getOrderByNumber(orderNumber) {
  const [orders] = await query(
    'SELECT * FROM orders WHERE order_number = ?',
    [orderNumber]
  )
  if (!orders || orders.length === 0) return null

  const order = orders[0]

  const [items] = await query(`
    SELECT oi.*, p.image_url
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [order.id])

  return { ...order, items }
}