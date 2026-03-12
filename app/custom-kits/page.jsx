'use client'
// app/custom-kits/page.jsx

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ── Scroll reveal hook ───────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(36px)',
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  )
}

/* ── Data ─────────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: '🎨', title: 'Full Custom Design', desc: 'Your logo, team name, colors and sponsor placements — exactly where you want them.' },
  { icon: '⚡', title: 'Premium Sublimation', desc: 'All-over dye sublimation printing. Colors that never fade, crack or peel.' },
  { icon: '👕', title: 'Pro-Grade Fabric', desc: 'Moisture-wicking polyester with stretch panels. Built for match performance.' },
  { icon: '⚽', title: 'Complete Kits', desc: 'Jerseys, trousers, caps and kit bags — everything in one order.' },
  { icon: '📦', title: 'Any Quantity', desc: 'From 5 to 500+ units. No minimum order requirement.' },
  { icon: '🚀', title: 'Fast Turnaround', desc: '10–15 working days from design approval to delivery.' },
]

const GALLERY = [
  {
    src: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&q=80',
    label: 'Match Jersey',
  },
  {
    src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
    label: 'Complete Kit',
  },
  {
    src: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&q=80',
    label: 'Training Set',
  },
  {
    src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    label: 'Team Uniform',
  },
  {
    src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
    label: 'Custom Cap',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    label: 'Kit Bag',
  },
]

const PROCESS = [
  { step: '01', title: 'Send Your Idea', desc: 'Share your team name, colors, logo files and any design references via WhatsApp or email.' },
  { step: '02', title: 'Design Mockup', desc: 'Our design team creates a full digital mockup of your kit within 48 hours — free of charge.' },
  { step: '03', title: 'Approve & Confirm', desc: 'Review the mockup, request any changes, confirm sizes and quantities, then pay to proceed.' },
  { step: '04', title: 'Production', desc: 'Your kits go into production using premium sublimation printing and pro-grade fabric.' },
  { step: '05', title: 'Delivered to You', desc: 'Kits are quality-checked, packed and delivered anywhere in Pakistan within 15 working days.' },
]

/* ── Contact form state ───────────────────────────────────────────────── */
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', teamName: '', quantity: '', message: '' })
  const [sent, setSent]   = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setSending(true)
    // Send via WhatsApp deep link as fallback (always works without backend)
    const msg = encodeURIComponent(
      `*Custom Kit Enquiry — BLAZE FITSS*\n\n` +
      `Name: ${form.name}\n` +
      `Email: ${form.email}\n` +
      `Phone: ${form.phone}\n` +
      `Team: ${form.teamName}\n` +
      `Quantity: ${form.quantity}\n` +
      `Message: ${form.message}`
    )
    window.open(`https://wa.me/923118186132?text=${msg}`, '_blank')
    setTimeout(() => { setSent(true); setSending(false) }, 600)
  }

  const F = ({ name, label, type = 'text', placeholder = '', half = false }) => (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2' }}>
      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
        style={{
          width: '100%', padding: '0.85rem 1rem',
          background: '#0c0c0c', border: '1px solid #222',
          borderRadius: '6px', color: '#ddd',
          fontFamily: 'DM Mono, monospace', fontSize: '0.8rem',
          outline: 'none', transition: 'border-color 0.2s',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = '#e8d5b7'}
        onBlur={e => e.target.style.borderColor = '#222'}
      />
    </div>
  )

  return (
    <section style={{ background: '#0a0a0a', padding: '100px 0', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.35em', color: '#555', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Get In Touch
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 300, color: '#e8e8e8', margin: '0 0 1rem', lineHeight: 1.15 }}>
              Start Your Custom Order
            </h2>
            <p style={{ color: '#555', fontSize: '0.95rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Fill out the form and we'll reach out on WhatsApp with a free design mockup within 48 hours.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

            {/* Contact Info */}
            <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem' }}>
              {[
                { icon: '📱', label: 'WhatsApp', value: '+92 311 818 6132', href: 'https://wa.me/923118186132' },
                { icon: '✉️', label: 'Email', value: 'sameerkhan031181@gmail.com', href: 'mailto:sameerkhan031181@gmail.com' },
                { icon: '📍', label: 'Location', value: 'Pakistan — Nationwide Delivery', href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} style={{ background: '#0f0f0f', padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{label}</p>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer"
                      style={{ color: '#e8d5b7', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace', textDecoration: 'none', wordBreak: 'break-all' }}>
                      {value}
                    </a>
                  ) : (
                    <p style={{ color: '#666', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace', margin: 0 }}>{value}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Form */}
            {sent ? (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '4rem 2rem', background: '#0f0f0f', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: '#e8e8e8', marginBottom: '0.75rem' }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 380, margin: '0 auto 1.5rem' }}>
                  Your enquiry has been sent via WhatsApp. We'll get back to you within 24 hours with a free design mockup.
                </p>
                <button onClick={() => setSent(false)} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.15em', color: '#e8d5b7', background: 'none', border: '1px solid rgba(232,213,183,0.3)', padding: '0.7rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <F name="name"      label="Your Name *"   placeholder="Muhammad Ali"         half />
                <F name="phone"     label="WhatsApp No. *" placeholder="+92 300 0000000"    half />
                <F name="email"     label="Email"         placeholder="you@example.com"      half />
                <F name="teamName"  label="Team Name"     placeholder="Lions Football Club"   half />
                <F name="quantity"  label="Quantity"      placeholder="e.g. 15 jerseys"      half />
                <div style={{ gridColumn: 'span 1' }}>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Budget / Notes</label>
                  <textarea
                    placeholder="Tell us about your kit requirements, colors, deadline..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={4}
                    style={{ width: '100%', padding: '0.85rem 1rem', background: '#0c0c0c', border: '1px solid #222', borderRadius: '6px', color: '#ddd', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#e8d5b7'}
                    onBlur={e => e.target.style.borderColor = '#222'}
                  />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button type="submit" disabled={sending} style={{
                    flex: 1, padding: '1rem 2rem',
                    background: '#e8d5b7', color: '#0a0a0a',
                    border: 'none', borderRadius: '6px',
                    fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'opacity 0.2s',
                    opacity: sending ? 0.6 : 1,
                    minWidth: 200,
                  }}>
                    {sending ? 'SENDING...' : 'SEND VIA WHATSAPP →'}
                  </button>
                  <a href="https://wa.me/923118186132" target="_blank" rel="noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    padding: '1rem 1.5rem', border: '1px solid #25d366',
                    borderRadius: '6px', color: '#25d366',
                    fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                    letterSpacing: '0.15em', textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    💬 CHAT DIRECTLY
                  </a>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ── Main Page ────────────────────────────────────────────────────────── */
export default function CustomKitsPage() {
  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => { setTimeout(() => setHeroReady(true), 80) }, [])

  return (
    <div style={{ background: '#0a0a0a', color: '#e8e8e8', minHeight: '100vh' }}>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1400&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.18)',
        }} />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(105deg, rgba(10,10,10,0.95) 40%, rgba(10,10,10,0.5) 100%)',
        }} />

        {/* Grain */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Decorative lines */}
        <div style={{ position: 'absolute', top: 0, right: '15%', width: 1, height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(232,213,183,0.08), transparent)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '120px 1.5rem 80px' }}>
          <div style={{ maxWidth: 680 }}>
            <p style={{
              fontFamily: 'DM Mono, monospace', fontSize: '0.65rem',
              letterSpacing: '0.45em', color: '#e8d5b7', textTransform: 'uppercase',
              marginBottom: '1.5rem',
              opacity: heroReady ? 1 : 0, transform: heroReady ? 'none' : 'translateY(8px)',
              transition: 'all 0.6s ease 0.2s',
            }}>
              BLAZE FITSS · Custom Manufacturing
            </p>

            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3.5rem, 8vw, 7rem)',
              fontWeight: 300, lineHeight: 0.95,
              color: '#f0f0f0', margin: '0 0 1.5rem',
              opacity: heroReady ? 1 : 0, transform: heroReady ? 'none' : 'translateY(30px)',
              transition: 'opacity 0.9s ease 0.4s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s',
            }}>
              Custom<br />
              <em style={{ color: '#e8d5b7' }}>Football</em><br />
              Kits
            </h1>

            <p style={{
              color: '#666', fontSize: '1rem', lineHeight: 1.8,
              maxWidth: 440, marginBottom: '2.5rem',
              opacity: heroReady ? 1 : 0, transform: heroReady ? 'none' : 'translateY(16px)',
              transition: 'all 0.7s ease 0.7s',
            }}>
              We design and manufacture premium football jerseys and complete football kits for teams, academies and clubs across Pakistan. Fully custom, professionally made.
            </p>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '1rem',
              opacity: heroReady ? 1 : 0, transition: 'opacity 0.6s ease 1s',
            }}>
              <a href="#contact" style={{
                padding: '0.9rem 2rem', background: '#e8d5b7', color: '#0a0a0a',
                fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '4px',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                Get Free Mockup →
              </a>
              <a href="#process" style={{
                padding: '0.9rem 2rem', border: '1px solid #2a2a2a', color: '#888',
                fontFamily: 'DM Mono, monospace', fontSize: '0.72rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: '4px',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#ccc' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#888' }}>
                How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          borderTop: '1px solid #1a1a1a', background: 'rgba(10,10,10,0.8)',
          backdropFilter: 'blur(10px)',
          opacity: heroReady ? 1 : 0, transition: 'opacity 0.6s ease 1.2s',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexWrap: 'wrap' }}>
            {[
              { num: '500+', label: 'Kits Delivered' },
              { num: '48hrs', label: 'Free Mockup' },
              { num: '15 Days', label: 'Avg. Turnaround' },
              { num: '100%', label: 'Custom Designs' },
            ].map(({ num, label }) => (
              <div key={label} style={{ flex: 1, minWidth: 120, padding: '1.25rem 1.5rem', borderRight: '1px solid #1a1a1a', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: '#e8d5b7', margin: '0 0 2px' }}>{num}</p>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHAT WE OFFER ═════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
            <div style={{ marginBottom: '4rem' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.35em', color: '#555', textTransform: 'uppercase', marginBottom: '1rem' }}>What We Offer</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#e8e8e8', margin: 0 }}>
                Everything your team needs
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 60}>
                <div style={{ background: '#0d0d0d', padding: '2rem', height: '100%', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#111'}
                  onMouseLeave={e => e.currentTarget.style.background = '#0d0d0d'}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 400, color: '#ddd', marginBottom: '0.6rem' }}>{f.title}</h3>
                  <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALLERY ═══════════════════════════════════════════════ */}
      <section style={{ padding: '100px 0', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
            <div style={{ marginBottom: '3rem' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.35em', color: '#555', textTransform: 'uppercase', marginBottom: '1rem' }}>Gallery</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#e8e8e8', margin: 0 }}>
                Crafted for champions
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {GALLERY.map((img, i) => (
              <Reveal key={img.label} delay={i * 80}>
                <div style={{
                  position: 'relative', overflow: 'hidden', borderRadius: 10,
                  aspectRatio: i === 0 || i === 3 ? '4/5' : '1/1',
                  gridRow: i === 0 || i === 3 ? 'span 2' : 'span 1',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1.06)'; e.currentTarget.querySelector('.label').style.opacity = '1' }}
                  onMouseLeave={e => { e.currentTarget.querySelector('img').style.transform = 'scale(1)'; e.currentTarget.querySelector('.label').style.opacity = '0' }}>
                  <img src={img.src} alt={img.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', display: 'block' }} />
                  <div className="label" style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '1.5rem 1rem 1rem',
                    opacity: 0, transition: 'opacity 0.3s',
                  }}>
                    <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', color: '#e8d5b7', textTransform: 'uppercase', margin: 0 }}>{img.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ═══════════════════════════════════════════════ */}
      <section id="process" style={{ padding: '100px 0', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
          <Reveal>
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', letterSpacing: '0.35em', color: '#555', textTransform: 'uppercase', marginBottom: '1rem' }}>The Process</p>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#e8e8e8', margin: 0 }}>
                From idea to delivery
              </h2>
            </div>
          </Reveal>

          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div style={{ position: 'absolute', left: 28, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, #2a2a2a 10%, #2a2a2a 90%, transparent)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {PROCESS.map((p, i) => (
                <Reveal key={p.step} delay={i * 100}>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', paddingLeft: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#111', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.62rem', color: '#e8d5b7', letterSpacing: '0.05em' }}>{p.step}</span>
                    </div>
                    <div style={{ paddingTop: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 400, color: '#ddd', marginBottom: '0.4rem' }}>{p.title}</h3>
                      <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════ */}
      <div id="contact">
        <ContactSection />
      </div>

    </div>
  )
}