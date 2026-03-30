// lib/db.js
import mysql from 'mysql2/promise'

let pool

function getPool() {
  if (pool) return pool

  pool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    port:               parseInt(process.env.DB_PORT || '4000'), // TiDB uses 4000
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           process.env.DB_NAME     || 'blaze_fitss',
    waitForConnections: true,
    connectionLimit:    1,    // ← changed: Vercel is serverless, 1 is enough
    rowsAsArray:        false,
    ssl: {                    // ← added: TiDB Cloud requires SSL
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  })

  return pool
}

export async function query(sql, params = []) {
  const connection = getPool()
  return connection.execute(sql, params)
}

export async function getConnection() {
  return getPool().getConnection()
}

export default getPool