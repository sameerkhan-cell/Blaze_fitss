// lib/auth.js
// User authentication helpers — NO external auth libraries needed

import { query } from './db'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'

// ── Simple password hashing using built-in crypto (no bcrypt needed) ──
import { createHash, randomBytes } from 'crypto'

function hashPassword(password, salt) {
  if (!salt) salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(salt + password).digest('hex')
  return { hash: `${salt}:${hash}`, salt }
}

function verifyPassword(password, storedHash) {
  const [salt] = storedHash.split(':')
  const { hash } = hashPassword(password, salt)
  return hash === storedHash
}

// ── Register ──
export async function registerUser(name, email, password) {
  // Check if email already exists
  const [existing] = await query('SELECT id FROM users WHERE email = ?', [email])
  if (existing.length > 0) {
    throw new Error('Email already registered')
  }

  const { hash } = hashPassword(password)
  const [result] = await query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email.toLowerCase().trim(), hash]
  )

  return { id: result.insertId, name, email }
}

// ── Login ──
export async function loginUser(email, password) {
  const [rows] = await query(
    'SELECT * FROM users WHERE email = ?',
    [email.toLowerCase().trim()]
  )

  if (!rows.length) throw new Error('Invalid email or password')

  const user = rows[0]
  const valid = verifyPassword(password, user.password_hash)
  if (!valid) throw new Error('Invalid email or password')

  // Create session
  const sessionId = uuidv4()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days

  await query(
    'INSERT INTO user_sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
    [sessionId, user.id, expiresAt]
  )

  return {
    sessionId,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  }
}

// ── Get current user from session cookie ──
export async function getCurrentUser() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('bf_user_session')?.value
    if (!sessionId) return null

    const [rows] = await query(`
      SELECT u.id, u.name, u.email, u.role
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ? AND s.expires_at > NOW()
    `, [sessionId])

    return rows[0] || null
  } catch {
    return null
  }
}

// ── Logout ──
export async function logoutUser(sessionId) {
  await query('DELETE FROM user_sessions WHERE id = ?', [sessionId])
}

// ── Get user orders ──
export async function getUserOrders(userId) {
  const [rows] = await query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  )
  return rows
}
