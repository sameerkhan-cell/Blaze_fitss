'use client'
// components/PageTransition.jsx
// Wraps page content with a smooth fade-in on load
// Add to layout.jsx around {children}

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }) {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [key, setKey] = useState(pathname)

  useEffect(() => {
    setShow(false)
    setKey(pathname)
    // Small delay lets the new page content mount before fading in
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      key={key}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}