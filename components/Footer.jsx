'use client'
// components/Footer.jsx

import Link from 'next/link'
import { useState } from 'react'

const footerLinks = {
  Shop: [
    { label: 'All Products',  href: '/' },
    { label: 'Jerseys',       href: '/jerseys' },
    { label: 'Football Shoes',href: '/footballshoes' },
    { label: 'Footballs',     href: '/footballs' },
    { label: 'Kids',          href: '/shopforkids' },
  ],
  Help: [
    { label: 'Help Center',   href: '/help' },
    { label: 'Track Order',   href: '/track-order' },
    { label: 'Ordering Info', href: '/ordering' },
    { label: 'Returns',       href: '/returns' },
    { label: 'Contact Us',    href: '/contact' },
  ],
  Company: [
    { label: 'About Us',      href: '/about' },
    { label: 'Careers',       href: '/careers' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Press',         href: '/press' },
    { label: 'Affiliates',    href: '/affiliates' },
  ],
  Legal: [
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',    href: '/cookies' },
    { label: 'Accessibility',    href: '/accessibility' },
  ],
}

const paymentMethods = [
  { id: 'visa',      label: 'VISA',      bg: '#fff',     color: '#1A1F71' },
  { id: 'paypal',    label: 'PayPal',    bg: '#fff',     color: '#003087' },
  { id: 'easypaisa', label: 'EasyPaisa', bg: '#6AC044',  color: '#6AC044' },
  { id: 'jazzcash',  label: 'JazzCash',  bg: '#E2001A',  color: '#E2001A' },
]

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/blaze.fitss/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.013 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.013 8.333 0 8.741 0 12c0 3.259.013 3.668.072 4.948.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.667-.072-4.947-.085-1.857-.601-3.699-1.942-5.04C20.646.673 18.804.157 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61582767407021',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter',
    href: 'https://x.com/Blaze_fitss',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) return
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const json = await res.json()
      if (json.success) { setSubscribed(true); setEmail('') }
    } catch {}
  }

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <Link href="/" className="footer__logo">
              <span className="footer__logo-text">BLAZE</span>
              <span className="footer__logo-accent">FITSS</span>
            </Link>
            <p className="footer__tagline">
              Timeless pieces crafted for<br />the modern wardrobe.
            </p>
            <div className="footer__social">
              {socials.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                  aria-label={s.name}
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="footer__links">
            {Object.entries(footerLinks).map(([group, links]) => (
              <div key={group} className="footer__col">
                <h4 className="footer__col-title">{group}</h4>
                <ul className="footer__col-list">
                  {links.map(link => (
                    <li key={link.href}>
                      <Link href={link.href} className="footer__col-link">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer__newsletter">
          <div className="footer__newsletter-text">
            <h3 className="footer__newsletter-title">Stay in the loop</h3>
            <p className="footer__newsletter-sub">New drops, exclusive offers, and editorial stories.</p>
          </div>
          {subscribed ? (
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#e8d5b7' }}>
              ✓ You&apos;re subscribed!
            </p>
          ) : (
            <form className="footer__newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                className="footer__newsletter-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button type="submit" className="footer__newsletter-btn">Subscribe</button>
            </form>
          )}
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} BLAZE FITSS. All rights reserved.
          </p>
          <div className="footer__payment">
            {paymentMethods.map(p => (
              <span
                key={p.id}
                className="footer__payment-badge"
                style={{ background: p.bg, color: p.color === '#fff' ? p.bg : '#fff', borderColor: p.color }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}