'use client'
// app/custom-kits/page.jsx

import { useState, useEffect, useRef } from 'react'

/* ── Scroll reveal ── */
function useReveal(threshold = 0.1) {
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

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ── Data ── */
const FEATURES = [
  { icon: '🎨', title: 'Full Custom Design',    desc: 'Your logo, team name, colors and sponsor placements — exactly where you want them.' },
  { icon: '⚡', title: 'Premium Sublimation',   desc: 'All-over dye sublimation printing. Colors that never fade, crack or peel.' },
  { icon: '👕', title: 'Pro-Grade Fabric',       desc: 'Moisture-wicking polyester with stretch panels. Built for match performance.' },
  { icon: '⚽', title: 'Complete Kits',          desc: 'Jerseys, trousers, caps and kit bags — everything in one order.' },
  { icon: '📦', title: 'Any Quantity',           desc: 'From 9 to 500+ units. Minimum order of 9 custom kits per order.' },
  { icon: '🚀', title: 'Fast Turnaround',        desc: '10–15 working days from design approval to delivery.' },
]

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&q=80', label: 'Match Jersey' },
  { src: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80', label: 'Complete Kit' },
  { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', label: 'Team Uniform' },
  { src: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80', label: 'Custom Cap' },
]

const PROCESS = [
  { step: '01', title: 'Send Your Idea',      desc: 'Share your team name, colors, logo files and any design references via WhatsApp or email.' },
  { step: '02', title: 'Design Mockup',       desc: 'Our design team creates a full digital mockup of your kit within 48 hours — free of charge.' },
  { step: '03', title: 'Approve & Confirm',   desc: 'Review the mockup, request any changes, confirm sizes and quantities, then pay to proceed.' },
  { step: '04', title: 'Production',          desc: 'Your kits go into production using premium sublimation printing and pro-grade fabric.' },
  { step: '05', title: 'Delivered to You',    desc: 'Kits are quality-checked, packed and delivered anywhere in Pakistan within 15 working days.' },
]

const mono = { fontFamily: 'DM Mono, monospace' }
const serif = { fontFamily: 'Cormorant Garamond, serif' }

/* ── Contact form ── */
function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', teamName: '', quantity: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [qtyError, setQtyError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    const qty = parseInt(form.quantity, 10)
    if (form.quantity && (isNaN(qty) || qty < 9)) {
      setQtyError('Minimum order is 9 custom kits.')
      return
    }
    setQtyError('')
    setSending(true)
    const msg = encodeURIComponent(
      `*Custom Kit Enquiry — BLAZE FITSS*\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nTeam: ${form.teamName}\nQty: ${form.quantity}\nMessage: ${form.message}`
    )
    window.open(`https://wa.me/923118186132?text=${msg}`, '_blank')
    setTimeout(() => { setSent(true); setSending(false) }, 600)
  }

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: '#0c0c0c', border: '1px solid #222',
    borderRadius: '6px', color: '#ddd',
    ...mono, fontSize: '0.78rem',
    outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block', ...mono, fontSize: '0.62rem',
    letterSpacing: '0.2em', color: '#555',
    textTransform: 'uppercase', marginBottom: '0.4rem',
  }

  return (
    <section id="contact" style={{ background: '#0a0a0a', padding: 'clamp(3rem,8vw,6rem) 0', borderTop: '1px solid #1a1a1a' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.25rem' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.35em', color: '#555', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Get In Touch</p>
            <h2 style={{ ...serif, fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 300, color: '#e8e8e8', margin: '0 0 0.75rem' }}>
              Start Your Custom Order
            </h2>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Fill out the form and we'll reach out on WhatsApp within 48 hours.
            </p>
          </div>
        </Reveal>

        {/* Contact info — stacks on mobile */}
        <Reveal delay={80}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1px', background: '#1a1a1a',
            borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem',
          }}>
            {[
              { icon: '📱', label: 'WhatsApp', value: '+92 311 818 6132', href: 'https://wa.me/923118186132' },
              { icon: '✉️', label: 'Email', value: 'sameerkhan031181\n@gmail.com', href: 'mailto:sameerkhan031181@gmail.com' },
              { icon: '📍', label: 'Location', value: 'Pakistan Nationwide', href: null },
            ].map(({ icon, label, value, href }) => (
              <div key={label} style={{ background: '#0f0f0f', padding: '1.25rem 1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>{icon}</div>
                <p style={{ ...mono, fontSize: '0.58rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</p>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer"
                    style={{ color: '#e8d5b7', fontSize: '0.7rem', ...mono, textDecoration: 'none', wordBreak: 'break-word' }}>
                    {value}
                  </a>
                ) : (
                  <p style={{ color: '#555', fontSize: '0.7rem', ...mono, margin: 0 }}>{value}</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={160}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#0f0f0f', borderRadius: '12px', border: '1px solid #1e1e1e' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ ...serif, fontSize: '1.6rem', fontWeight: 300, color: '#e8e8e8', marginBottom: '0.5rem' }}>Message Sent!</h3>
              <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Your enquiry has been sent via WhatsApp. We'll get back to you within 24 hours.
              </p>
              <button onClick={() => setSent(false)} style={{
                ...mono, fontSize: '0.68rem', letterSpacing: '0.15em',
                color: '#e8d5b7', background: 'none',
                border: '1px solid rgba(232,213,183,0.3)',
                padding: '0.65rem 1.5rem', borderRadius: '4px', cursor: 'pointer',
              }}>SEND ANOTHER</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* 2-col grid on desktop, 1-col on mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input style={inputStyle} placeholder="Muhammad Ali" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = '#e8d5b7'}
                    onBlur={e => e.target.style.borderColor = '#222'} />
                </div>
                <div>
                  <label style={labelStyle}>WhatsApp No. *</label>
                  <input style={inputStyle} placeholder="+92 300 0000000" value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = '#e8d5b7'}
                    onBlur={e => e.target.style.borderColor = '#222'} />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input style={inputStyle} type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = '#e8d5b7'}
                    onBlur={e => e.target.style.borderColor = '#222'} />
                </div>
                <div>
                  <label style={labelStyle}>Team Name</label>
                  <input style={inputStyle} placeholder="Lions Football Club" value={form.teamName}
                    onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = '#e8d5b7'}
                    onBlur={e => e.target.style.borderColor = '#222'} />
                </div>
                <div>
                  <label style={labelStyle}>Quantity <span style={{ color: '#666', fontStyle: 'normal' }}>(min. 9)</span></label>
                  <input
                    style={{ ...inputStyle, borderColor: qtyError ? '#c0392b' : '#222' }}
                    type="number" min={9} placeholder="e.g. 15" value={form.quantity}
                    onChange={e => { setForm(f => ({ ...f, quantity: e.target.value })); setQtyError('') }}
                    onFocus={e => e.target.style.borderColor = qtyError ? '#c0392b' : '#e8d5b7'}
                    onBlur={e => e.target.style.borderColor = qtyError ? '#c0392b' : '#222'} />
                  {qtyError && <p style={{ ...mono, fontSize: '0.62rem', color: '#c0392b', marginTop: '0.35rem', marginBottom: 0 }}>{qtyError}</p>}
                </div>
                <div>
                  <label style={labelStyle}>Budget / Notes</label>
                  <textarea
                    placeholder="Colors, deadline, requirements..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={3}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#e8d5b7'}
                    onBlur={e => e.target.style.borderColor = '#222'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="submit" disabled={sending} style={{
                  flex: 1, minWidth: 160, padding: '0.9rem 1.5rem',
                  background: '#e8d5b7', color: '#0a0a0a', border: 'none',
                  borderRadius: '6px', ...mono, fontSize: '0.7rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  cursor: 'pointer', opacity: sending ? 0.6 : 1,
                }}>
                  {sending ? 'SENDING...' : 'SEND VIA WHATSAPP →'}
                </button>
                <a href="https://wa.me/923118186132" target="_blank" rel="noreferrer" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.9rem 1.25rem', border: '1px solid #25d366',
                  borderRadius: '6px', color: '#25d366',
                  ...mono, fontSize: '0.7rem', letterSpacing: '0.12em',
                  textDecoration: 'none', whiteSpace: 'nowrap',
                }}>
                  💬 CHAT DIRECTLY
                </a>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

/* ── Main Page ── */
export default function CustomKitsPage() {
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  return (
    <div style={{ background: '#0a0a0a', color: '#e8e8e8', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.18)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(10,10,10,0.95) 40%, rgba(10,10,10,0.4) 100%)' }} />

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', padding: 'clamp(5rem,12vw,8rem) 1.25rem 2rem' }}>
          <div style={{ maxWidth: 640 }}>
            <p style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.4em', color: '#e8d5b7', textTransform: 'uppercase', marginBottom: '1.25rem', opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease 0.2s' }}>
              BLAZE FITSS · Custom Manufacturing
            </p>
            <h1 style={{
              ...serif, fontSize: 'clamp(2.8rem, 10vw, 7rem)',
              fontWeight: 300, lineHeight: 0.95, color: '#f0f0f0', margin: '0 0 1.25rem',
              opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(24px)',
              transition: 'opacity 0.9s ease 0.4s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s',
            }}>
              Custom<br /><em style={{ color: '#e8d5b7' }}>Football</em><br />Kits
            </h1>
            <p style={{ color: '#666', fontSize: 'clamp(0.88rem,2.5vw,1rem)', lineHeight: 1.8, maxWidth: 420, marginBottom: '2rem', opacity: ready ? 1 : 0, transition: 'all 0.7s ease 0.7s' }}>
              Premium football jerseys and complete kits for teams, academies and clubs across Pakistan.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem', opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease 1s' }}>
              <a href="#contact" style={{ padding: '0.85rem 1.75rem', background: '#e8d5b7', color: '#0a0a0a', ...mono, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px' }}>
                Get Free Mockup →
              </a>
              <a href="#process" style={{ padding: '0.85rem 1.75rem', border: '1px solid #2a2a2a', color: '#888', ...mono, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '4px' }}>
                How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Stats strip — in normal flow, never overlaps content */}
        <div style={{ position: 'relative', zIndex: 10, borderTop: '1px solid #1a1a1a', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(8px)', opacity: ready ? 1 : 0, transition: 'opacity 0.6s ease 1.2s' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem' }}>
            {[['500+','Kits Delivered'],['48hrs','Free Mockup'],['15 Days','Turnaround'],['100%','Custom']].map(([num, label]) => (
              <div key={label} style={{ flex: '1 1 100px', padding: '1rem 0.75rem', textAlign: 'center', borderRight: '1px solid #1a1a1a' }}>
                <p style={{ ...serif, fontSize: 'clamp(1.1rem,3vw,1.6rem)', fontWeight: 300, color: '#e8d5b7', margin: '0 0 2px' }}>{num}</p>
                <p style={{ ...mono, fontSize: '0.55rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section style={{ padding: 'clamp(3rem,8vw,6rem) 0', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem' }}>
          <Reveal>
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: '0.75rem' }}>What We Offer</p>
              <h2 style={{ ...serif, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, color: '#e8e8e8', margin: 0 }}>Everything your team needs</h2>
            </div>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 50}>
                <div style={{ background: '#0d0d0d', padding: '1.75rem', height: '100%' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                  <h3 style={{ ...serif, fontSize: '1.1rem', fontWeight: 400, color: '#ddd', marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p style={{ color: '#555', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section style={{ padding: 'clamp(3rem,8vw,6rem) 0', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.25rem' }}>
          <Reveal>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Gallery</p>
              <h2 style={{ ...serif, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, color: '#e8e8e8', margin: 0 }}>Crafted for champions</h2>
            </div>
          </Reveal>
          {/* Simple 2-col grid — works on all screen sizes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {GALLERY.map((img, i) => (
              <Reveal key={img.label} delay={i * 70}>
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 8, aspectRatio: '4/5' }}>
                  <img src={img.src} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', padding: '1rem 0.75rem 0.75rem' }}>
                    <p style={{ ...mono, fontSize: '0.62rem', letterSpacing: '0.15em', color: '#e8d5b7', textTransform: 'uppercase', margin: 0 }}>{img.label}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section id="process" style={{ padding: 'clamp(3rem,8vw,6rem) 0', background: '#0d0d0d' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.25rem' }}>
          <Reveal>
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <p style={{ ...mono, fontSize: '0.6rem', letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: '0.75rem' }}>The Process</p>
              <h2 style={{ ...serif, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, color: '#e8e8e8', margin: 0 }}>From idea to delivery</h2>
            </div>
          </Reveal>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, #2a2a2a 10%, #2a2a2a 90%, transparent)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {PROCESS.map((p, i) => (
                <Reveal key={p.step} delay={i * 80}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#111', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ ...mono, fontSize: '0.6rem', color: '#e8d5b7' }}>{p.step}</span>
                    </div>
                    <div style={{ paddingTop: '0.35rem' }}>
                      <h3 style={{ ...serif, fontSize: '1.2rem', fontWeight: 400, color: '#ddd', marginBottom: '0.35rem' }}>{p.title}</h3>
                      <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <ContactSection />

    </div>
  )
}