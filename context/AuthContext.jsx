'use client'
// context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [authModal, setAuthModal] = useState(null) // 'login' | 'signup' | null

  // Check if user is already logged in on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(json => { if (json.success) setUser(json.user) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error)
    setUser(json.user)
    setAuthModal(null)
    return json.user
  }

  const register = async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const json = await res.json()
    if (!json.success) throw new Error(json.error)
    setUser(json.user)
    setAuthModal(null)
    return json.user
  }

  const logout = async () => {
    await fetch('/api/auth/me', { method: 'DELETE' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user, loading, authModal, setAuthModal,
      login, register, logout,
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
