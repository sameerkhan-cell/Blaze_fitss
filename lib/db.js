// lib/db.js
// MySQL2 connection pool — reused across all API routes

import mysql from 'mysql2/promise'

// Singleton pool stored on the global object in dev to survive HMR reloads
let pool

function getPool() {
  if (pool) return pool

  pool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    port:               parseInt(process.env.DB_PORT || '3306'),
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           process.env.DB_NAME     || 'blaze_fitss',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    // Returns plain JS objects instead of RowDataPacket instances
    rowsAsArray: false,
  })

  return pool
}

/**
 * Execute a parameterised query and return [rows, fields].
 * Usage:  const [rows] = await query('SELECT * FROM products WHERE id = ?', [id])
 */
export async function query(sql, params = []) {
  const connection = getPool()
  return connection.execute(sql, params)
}

/**
 * Get a single connection for transactions.
 */
export async function getConnection() {
  return getPool().getConnection()
}

export default getPool
