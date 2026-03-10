// app/api/auth/login/route.js

import { NextResponse } from 'next/server'
import { loginUser } from '../../../../lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email?.trim())  return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    if (!password)       return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 })

    const { sessionId, user } = await loginUser(email.trim(), password)

    const response = NextResponse.json({ success: true, user })
    response.cookies.set('bf_user_session', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    })
    return response

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 401 })
  }
}
