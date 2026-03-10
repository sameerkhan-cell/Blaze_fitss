// app/api/auth/me/route.js

import { NextResponse } from 'next/server'
import { getCurrentUser, logoutUser } from '../../../../lib/auth'
import { cookies } from 'next/headers'

// GET — return current logged-in user
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ success: false, user: null })
    return NextResponse.json({ success: true, user })
  } catch {
    return NextResponse.json({ success: false, user: null })
  }
}

// DELETE — logout
export async function DELETE() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('bf_user_session')?.value
    if (sessionId) await logoutUser(sessionId)

    const response = NextResponse.json({ success: true })
    response.cookies.set('bf_user_session', '', { maxAge: 0, path: '/' })
    return response
  } catch {
    return NextResponse.json({ success: false })
  }
}
