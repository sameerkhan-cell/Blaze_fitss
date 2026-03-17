'use client'
// components/ScrollReveal.jsx
// Wraps any content with scroll-triggered fade+slide animation
// Usage: <ScrollReveal><YourContent /></ScrollReveal>
// Optional props: delay (ms), direction ('up'|'down'|'left'|'right'), distance (px)

import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 32,
  duration = 700,
  threshold = 0.1,
  style = {},
  className = '',
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  const getTransform = () => {
    if (visible) return 'none'
    switch (direction) {
      case 'up':    return `translateY(${distance}px)`
      case 'down':  return `translateY(-${distance}px)`
      case 'left':  return `translateX(${distance}px)`
      case 'right': return `translateX(-${distance}px)`
      default:      return `translateY(${distance}px)`
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}