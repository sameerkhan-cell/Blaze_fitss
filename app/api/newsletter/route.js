// app/api/newsletter/route.js

import { NextResponse } from 'next/server'
import { subscribeNewsletter } from '../../../lib/queries'

export async function POST(request) {
  try {
    const { email } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email required' },
        { status: 400 }
      )
    }
    const result = await subscribeNewsletter(email)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('POST /api/newsletter error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
