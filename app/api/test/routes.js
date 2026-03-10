
// app/api/test/route.js
import { NextResponse } from 'next/server'

export async function GET() {
  const results = {}

  results.env = {
    DB_HOST:     process.env.DB_HOST     || '(not set)',
    DB_PORT:     process.env.DB_PORT     || '(not set)',
    DB_USER:     process.env.DB_USER     || '(not set)',
    DB_PASSWORD: process.env.DB_PASSWORD !== undefined ? '(set)' : '(not set)',
    DB_NAME:     process.env.DB_NAME     || '(not set)',
  }

  try {
    const mysql = (await import('mysql2/promise')).default
    const conn = await mysql.createConnection({
      host:     process.env.DB_HOST     || 'localhost',
      port:     parseInt(process.env.DB_PORT || '3306'),
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME     || 'blaze_fitss',
    })
    results.connection = 'SUCCESS'
    const [tables] = await conn.execute('SHOW TABLES')
    results.tables = tables.map(t => Object.values(t)[0])
    await conn.end()
  } catch (e) {
    results.connection = 'FAILED'
    results.error = e.message
    results.code  = e.code
  }

  return NextResponse.json(results)
}

