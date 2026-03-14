'use client'
// components/Footer.jsx

import Link from 'next/link'
import { useState } from 'react'

const footerLinks = {
  Shop: [
    { label: 'All Products',   href: '/' },
    { label: 'Jerseys',        href: '/jerseys' },
    { label: 'Football Shoes', href: '/footballshoes' },
    { label: 'Footballs',      href: '/footballs' },
    { label: 'Kids',           href: '/shopforkids' },
    { label: 'Custom Kits',    href: '/custom-kits' },
  ],
  Help: [
    { label: 'Track Order',   href: '/track-order' },
    { label: 'Ordering Info', href: '/ordering' },
    { label: 'Returns',       href: '/returns' },
    { label: 'Contact Us',    href: '/contact' },
  ],
  Company: [
    { label: 'About Us',  href: '/about' },
    { label: 'Instagram', href: 'https://www.instagram.com/blaze.fitss/', ext: true },
    { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=61582767407021', ext: true },
    { label: 'Twitter/X', href: 'https://x.com/Blaze_fitss', ext: true },
  ],
}

const socials = [
  {
    name: 'Instagram', href: 'https://www.instagram.com/blaze.fitss/',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.013 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.013 8.333 0 8.741 0 12c0 3.259.013 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.667-.072-4.947-.085-1.857-.601-3.699-1.942-5.04C20.646.673 18.804.157 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  },
  {
    name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61582767407021',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>,
  },
  {
    name: 'Twitter/X', href: 'https://x.com/Blaze_fitss',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
  {
    name: 'WhatsApp', href: 'https://wa.me/923118186132',
    icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>,
  },
]

export default function Footer() {
  const [email, setEmail]           = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subLoading, setSubLoading] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    setSubLoading(true)
    try {
      const res  = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const json = await res.json()
      if (json.success) { setSubscribed(true); setEmail('') }
    } catch {}
    finally { setSubLoading(false) }
  }

  return (
    <footer style={{ background: '#070707', borderTop: '1px solid #141414', marginTop: 0 }}>

      {/* Newsletter banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f0e0a 0%, #0c0c0c 50%, #0a0f0a 100%)',
        borderBottom: '1px solid #141414',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '3rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Newsletter</p>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 300, color: '#f0ece4', margin: '0 0 0.3rem' }}>
              Stay in the loop
            </h3>
            <p style={{ color: '#444', fontSize: '0.9rem' }}>New drops, exclusive offers, and kit drops.</p>
          </div>
          {subscribed ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '6px', padding: '0.85rem 1.5rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#34d399', letterSpacing: '0.1em' }}>YOU&apos;RE SUBSCRIBED</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0', flexShrink: 0, flexWrap: 'wrap' }}>
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  background: '#0e0e0e', border: '1px solid #222',
                  borderRight: 'none', borderRadius: '4px 0 0 4px',
                  padding: '0.75rem 1.1rem', color: '#f0ece4',
                  fontFamily: 'DM Mono, monospace', fontSize: '0.75rem',
                  outline: 'none', width: 220, transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#333'}
                onBlur={e => e.target.style.borderColor = '#222'}
              />
              <button type="submit" disabled={subLoading} style={{
                background: '#e8d5b7', border: 'none',
                borderRadius: '0 4px 4px 0', padding: '0.75rem 1.4rem',
                fontFamily: 'DM Mono, monospace', fontSize: '0.7rem',
                letterSpacing: '0.15em', color: '#0a0a0a', fontWeight: 500,
                cursor: 'pointer', transition: 'opacity 0.2s', whiteSpace: 'nowrap',
                opacity: subLoading ? 0.7 : 1,
              }}>
                {subLoading ? '...' : 'SUBSCRIBE'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer body */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '3.5rem 2rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '4rem', marginBottom: '3rem' }} className="footer-grid">

          {/* Brand column */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', textDecoration: 'none', marginBottom: '1.2rem' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '1rem', fontWeight: 700, color: '#f0ece4', letterSpacing: '0.22em' }}>BLAZE</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.55rem', color: '#e8d5b7', letterSpacing: '0.5em' }}>FITSS</span>
            </Link>
            <p style={{ fontSize: '0.88rem', color: '#3a3a3a', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Premium football gear for champions. Jerseys, boots and custom kits delivered across Pakistan.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {socials.map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  title={s.name}
                  style={{
                    width: 34, height: 34, borderRadius: '6px',
                    border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#444', transition: 'all 0.2s', textDecoration: 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#e8d5b7'; e.currentTarget.style.background = 'rgba(232,213,183,0.06)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.color = '#444'; e.currentTarget.style.background = 'transparent' }}>
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="https://wa.me/923118186132" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#3a3a3a', fontSize: '0.8rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8d5b7'}
                onMouseLeave={e => e.currentTarget.style.color = '#3a3a3a'}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', color: '#333' }}>WA</span>
                +92 311 818 6132
              </a>
              <a href="mailto:sameerkhan031181@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#3a3a3a', fontSize: '0.8rem', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8d5b7'}
                onMouseLeave={e => e.currentTarget.style.color = '#3a3a3a'}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', color: '#333' }}>EM</span>
                sameerkhan031181@gmail.com
              </a>
            </div>
          </div>

          {/* Links grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="footer-links-grid">
            {Object.entries(footerLinks).map(([group, items]) => (
              <div key={group}>
                <h4 style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#333', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
                  {group}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {items.map(item => (
                    <li key={item.href}>
                      <Link href={item.href}
                        target={item.ext ? '_blank' : undefined}
                        rel={item.ext ? 'noopener noreferrer' : undefined}
                        style={{ fontSize: '0.88rem', color: '#3a3a3a', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#e8d5b7'}
                        onMouseLeave={e => e.currentTarget.style.color = '#3a3a3a'}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #181818 20%, #181818 80%, transparent)' }} />

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.4rem 0 1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#2a2a2a', letterSpacing: '0.1em' }}>
            © {new Date().getFullYear()} BLAZE FITSS · All rights reserved · Pakistan
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {[
              { label: 'COD',       bg: '#1a1a1a', color: '#888' },
              { label: 'EasyPaisa', bg: '#1a2a1a', color: '#6AC044' },
              { label: 'JazzCash',  bg: '#2a1a1a', color: '#E2001A' },
            ].map(p => (
              <span key={p.label} style={{
                padding: '0.3rem 0.7rem', borderRadius: '4px',
                background: p.bg, color: p.color,
                fontFamily: 'DM Mono, monospace', fontSize: '0.58rem',
                letterSpacing: '0.08em', border: `1px solid ${p.color}33`,
              }}>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .footer-links-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .footer-links-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </footer>
  )
}