// app/ordering/page.jsx
export default function OrderingPage() {
  return (
    <div className="simple-page">
      <h1>Ordering Info</h1>
      <p className="subtitle">HOW TO ORDER</p>
      <h2>Step-by-Step</h2>
      <ul>
        <li>Browse products and click &quot;Add to Cart&quot;</li>
        <li>Open your cart and click &quot;Checkout&quot;</li>
        <li>Fill in your shipping details</li>
        <li>Choose your payment method</li>
        <li>Click &quot;Place Order&quot; — done!</li>
      </ul>
      <h2>Payment Options</h2>
      <p>We accept Cash on Delivery, EasyPaisa, JazzCash, and bank transfer. COD is available nationwide.</p>
      <h2>Delivery Times</h2>
      <p>Karachi: 1–2 business days. Major cities: 2–3 days. Remote areas: 3–5 days.</p>
    </div>
  )
}
