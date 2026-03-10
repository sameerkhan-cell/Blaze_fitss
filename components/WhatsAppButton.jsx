'use client'
// components/WhatsAppButton.jsx

import { useEffect, useState } from 'react'

const socials = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/923118186132?text=Hi!%20I%20have%20a%20question%20about%20your%20products.',
    bg: '#25D366',
    shadow: 'rgba(37,211,102,0.4)',
    pulse: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="26" height="26" fill="white"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.463 2.027 7.754L0 32l8.454-2.017A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.756-1.843l-.484-.287-5.016 1.197 1.22-4.884-.316-.502A13.27 13.27 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.862c-.398-.199-2.354-1.162-2.719-1.294-.365-.133-.631-.199-.897.199-.266.398-1.031 1.294-1.264 1.56-.233.266-.465.299-.863.1-.398-.199-1.681-.619-3.203-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.233-.398-.025-.613.175-.811.18-.178.398-.465.597-.698.199-.233.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.162-1.23-2.96-.324-.778-.653-.673-.897-.685l-.764-.013c-.266 0-.698.1-1.064.498-.365.398-1.395 1.362-1.395 3.325s1.428 3.857 1.627 4.123c.199.266 2.81 4.29 6.809 6.018.952.411 1.695.657 2.274.841.955.304 1.825.261 2.512.158.766-.114 2.354-.962 2.687-1.892.332-.93.332-1.727.232-1.892-.099-.166-.365-.266-.763-.465z"/></svg>`,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/blaze.fitss/',
    bg: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    shadow: 'rgba(220,39,67,0.4)',
    pulse: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.013 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.013 8.333 0 8.741 0 12c0 3.259.013 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.667-.072-4.947-.085-1.857-.601-3.699-1.942-5.04C20.646.673 18.804.157 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
  },
]

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      {socials.map(s => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          title={s.name}
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: s.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 16px ${s.shadow}`,
            transition: 'transform 0.2s',
            textDecoration: 'none',
            animation: s.pulse ? 'wa-pulse 2s infinite' : 'none',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          dangerouslySetInnerHTML={{ __html: s.svg }}
        />
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes wa-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
          70%  { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
      `}} />
    </div>
  )
}