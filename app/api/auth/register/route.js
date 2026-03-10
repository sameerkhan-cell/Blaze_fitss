// app/api/auth/register/route.js

import { NextResponse } from 'next/server'
import { registerUser, loginUser } from '../../../../lib/auth'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    if (!name?.trim())     return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 })
    if (!email?.trim())    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    if (!password)         return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 })

    // Register then auto-login
    await registerUser(name.trim(), email.trim(), password)
    const { sessionId, user } = await loginUser(email.trim(), password)

    const response = NextResponse.json({ success: true, user }, { status: 201 })
    response.cookies.set('bf_user_session', sessionId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    })
    return response

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
