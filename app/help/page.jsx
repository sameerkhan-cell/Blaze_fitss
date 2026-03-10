// app/help/page.jsx
export default function HelpPage() {
  const faqs = [
    ['How do I track my order?', 'Visit the Track Order page and enter your order number (e.g. BF-XXXXXXXXXX-XXX).'],
    ['What payment methods do you accept?', 'Cash on Delivery (COD), EasyPaisa, JazzCash, and bank transfer.'],
    ['How long does delivery take?', 'Karachi: 1–2 days. Other cities: 2–4 days.'],
    ['Can I return a product?', 'Yes, within 14 days if unused and in original packaging. See our Returns page.'],
    ['Are the products authentic?', 'Yes, 100% authentic. We never sell replicas.'],
  ]
  return (
    <div className="simple-page">
      <h1>Help Center</h1>
      <p className="subtitle">FREQUENTLY ASKED QUESTIONS</p>
      {faqs.map(([q, a]) => (
        <div key={q} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>{q}</h2>
          <p>{a}</p>
        </div>
      ))}
    </div>
  )
}
