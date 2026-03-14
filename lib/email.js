// lib/email.js
import nodemailer from 'nodemailer'

const STATUS_INFO = {
  pending: {
    subject: '⏳ Order Received — BLAZE FITSS',
    emoji:   '⏳',
    heading: 'Order Pending',
    color:   '#f59e0b',
    message: 'We have received your order and it is currently pending review. We will confirm it shortly.',
  },
  confirmed: {
    subject: '✅ Order Confirmed — BLAZE FITSS',
    emoji:   '✅',
    heading: 'Order Confirmed!',
    color:   '#818cf8',
    message: 'Great news! Your order has been confirmed and is now being prepared for dispatch.',
  },
  shipped: {
    subject: '🚚 Order Shipped — BLAZE FITSS',
    emoji:   '🚚',
    heading: 'Your Order is On the Way!',
    color:   '#38bdf8',
    message: 'Your order has been shipped and is heading your way. Please allow 2–5 business days for delivery.',
  },
  delivered: {
    subject: '🎉 Order Delivered — BLAZE FITSS',
    emoji:   '🎉',
    heading: 'Order Delivered!',
    color:   '#34d399',
    message: 'Your order has been delivered! We hope you love your new gear. Thank you for shopping with BLAZE FITSS.',
  },
  cancelled: {
    subject: '❌ Order Cancelled — BLAZE FITSS',
    emoji:   '❌',
    heading: 'Order Cancelled',
    color:   '#f87171',
    message: 'Your order has been cancelled. If you have any questions or believe this is a mistake, please contact us on WhatsApp.',
  },
}

const PAYMENT_LABELS = {
  cod:       'Cash on Delivery',
  easypaisa: 'EasyPaisa',
  jazzcash:  'JazzCash',
  bank:      'Bank Transfer',
}

// ── Shared HTML builder ───────────────────────────────────────────────────────
function buildEmailHtml({ order, items, status, info, isAdminCopy = false }) {
  const itemsHtml = items?.length
    ? items.map(item => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #222;color:#e8e8e8;font-size:14px;">
            ${item.product_name || item.name}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #222;color:#888;font-size:13px;text-align:center;">
            x${item.quantity}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #222;color:#aaa;font-size:13px;text-align:center;">
            ${item.size || '—'}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #222;color:#e8d5b7;font-size:14px;text-align:right;font-family:monospace;">
            Rs ${(parseFloat(item.price) * item.quantity).toFixed(0)}
          </td>
        </tr>`).join('')
    : `<tr><td colspan="4" style="padding:12px;color:#555;text-align:center;">No item details</td></tr>`

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">

  <!-- Logo -->
  <div style="text-align:center;margin-bottom:28px;">
    <p style="margin:0;font-size:10px;letter-spacing:4px;color:#444;text-transform:uppercase;font-family:monospace;">
      ${isAdminCopy ? 'Admin Notification' : 'Order Update'}
    </p>
    <h1 style="margin:6px 0 0;font-size:26px;font-weight:300;letter-spacing:8px;color:#f0ece4;">
      BLAZE<span style="color:#e8d5b7;font-size:14px;letter-spacing:6px;"> FITSS</span>
    </h1>
  </div>

  <!-- Status banner -->
  <div style="background:#111;border:1px solid #1e1e1e;border-top:3px solid ${info.color};border-radius:12px;padding:28px;margin-bottom:20px;text-align:center;">
    <div style="font-size:44px;margin-bottom:12px;">${info.emoji}</div>
    <h2 style="color:${info.color};font-size:22px;font-weight:300;margin:0 0 10px;letter-spacing:1px;">${info.heading}</h2>
    <p style="color:#888;font-size:14px;line-height:1.7;margin:0 auto;max-width:420px;">${info.message}</p>
  </div>

  <!-- Order summary row -->
  <div style="display:flex;gap:12px;margin-bottom:20px;">
    <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;text-transform:uppercase;">Order No.</p>
      <p style="margin:0;font-size:15px;color:#e8d5b7;font-family:monospace;">${order.order_number}</p>
    </div>
    <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;text-transform:uppercase;">Status</p>
      <span style="background:${info.color}22;color:${info.color};padding:3px 12px;border-radius:20px;font-size:11px;font-family:monospace;letter-spacing:1px;">${status.toUpperCase()}</span>
    </div>
    <div style="flex:1;background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;text-transform:uppercase;">Total</p>
      <p style="margin:0;font-size:15px;color:#e8d5b7;font-family:monospace;">Rs ${parseFloat(order.total_amount).toFixed(0)}</p>
    </div>
  </div>

  <!-- Customer details -->
  <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:20px 24px;margin-bottom:20px;">
    <p style="margin:0 0 14px;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;text-transform:uppercase;">Customer Details</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:5px 0;font-size:11px;color:#555;font-family:monospace;letter-spacing:1px;width:120px;vertical-align:top;">NAME</td>
        <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.customer_name}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;font-size:11px;color:#555;font-family:monospace;letter-spacing:1px;vertical-align:top;">EMAIL</td>
        <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.customer_email}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;font-size:11px;color:#555;font-family:monospace;letter-spacing:1px;vertical-align:top;">PHONE</td>
        <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.customer_phone || '—'}</td>
      </tr>
      <tr>
        <td style="padding:5px 0;font-size:11px;color:#555;font-family:monospace;letter-spacing:1px;vertical-align:top;">ADDRESS</td>
        <td style="padding:5px 0;font-size:14px;color:#ddd;line-height:1.6;">
          ${order.shipping_address}${order.city ? '<br>' + order.city : ''}${order.country ? ', ' + order.country : ''}
        </td>
      </tr>
      <tr>
        <td style="padding:5px 0;font-size:11px;color:#555;font-family:monospace;letter-spacing:1px;vertical-align:top;">PAYMENT</td>
        <td style="padding:5px 0;font-size:14px;color:#ddd;">${PAYMENT_LABELS[order.payment_method] || order.payment_method}</td>
      </tr>
      ${order.notes ? `
      <tr>
        <td style="padding:5px 0;font-size:11px;color:#555;font-family:monospace;letter-spacing:1px;vertical-align:top;">NOTES</td>
        <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.notes}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:5px 0;font-size:11px;color:#555;font-family:monospace;letter-spacing:1px;vertical-align:top;">DATE</td>
        <td style="padding:5px 0;font-size:14px;color:#ddd;">${new Date(order.created_at || Date.now()).toLocaleString('en-PK', { timeZone: 'Asia/Karachi', dateStyle: 'medium', timeStyle: 'short' })}</td>
      </tr>
    </table>
  </div>

  <!-- Order items -->
  <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;overflow:hidden;margin-bottom:20px;">
    <div style="padding:16px 20px;border-bottom:1px solid #1e1e1e;">
      <p style="margin:0;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;text-transform:uppercase;">Items Ordered</p>
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#0c0c0c;">
          <th style="padding:10px 12px;text-align:left;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;font-weight:400;text-transform:uppercase;">Product</th>
          <th style="padding:10px 12px;text-align:center;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;font-weight:400;text-transform:uppercase;">Qty</th>
          <th style="padding:10px 12px;text-align:center;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;font-weight:400;text-transform:uppercase;">Size</th>
          <th style="padding:10px 12px;text-align:right;font-size:10px;letter-spacing:2px;color:#444;font-family:monospace;font-weight:400;text-transform:uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr style="background:#0c0c0c;">
          <td colspan="3" style="padding:14px 12px;font-size:11px;color:#555;font-family:monospace;letter-spacing:2px;text-transform:uppercase;">Total Amount</td>
          <td style="padding:14px 12px;font-size:18px;color:#e8d5b7;text-align:right;font-family:monospace;font-weight:300;">
            Rs ${parseFloat(order.total_amount).toFixed(0)}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Contact -->
  <div style="background:#111;border:1px solid #1e1e1e;border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center;">
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;color:#444;font-family:monospace;text-transform:uppercase;">Need Help?</p>
    <p style="margin:0;font-size:14px;color:#888;line-height:1.8;">
      WhatsApp: <a href="https://wa.me/923118186132" style="color:#e8d5b7;text-decoration:none;">+92 311 818 6132</a><br>
      Email: <a href="mailto:sameerkhan031181@gmail.com" style="color:#e8d5b7;text-decoration:none;">sameerkhan031181@gmail.com</a>
    </p>
  </div>

  <!-- Footer -->
  <p style="text-align:center;color:#333;font-size:11px;font-family:monospace;letter-spacing:1px;line-height:1.8;">
    © ${new Date().getFullYear()} BLAZE FITSS · All rights reserved<br>
    <span style="color:#222;">This email was sent to ${order.customer_email}</span>
  </p>

</div>
</body>
</html>`
}

// ── Status update email → sent to CUSTOMER ────────────────────────────────────
export async function sendOrderStatusEmail(order, newStatus) {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_PASS

  if (!gmailUser || !gmailPass) {
    console.error('❌ GMAIL_USER or GMAIL_PASS missing in env vars')
    return
  }

  const info = STATUS_INFO[newStatus]
  if (!info) return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  const html = buildEmailHtml({ order, items: order.items, status: newStatus, info })

  await transporter.sendMail({
    from:    `"BLAZE FITSS" <${gmailUser}>`,
    to:      order.customer_email,
    subject: info.subject,
    html,
  })

  console.log(`✅ Status email sent to ${order.customer_email} — ${newStatus}`)
}

// ── New order email → sent to ADMIN ──────────────────────────────────────────
export async function sendNewOrderEmail(order, items) {
  const gmailUser = process.env.GMAIL_USER
  const gmailPass = process.env.GMAIL_PASS

  if (!gmailUser || !gmailPass) {
    console.error('❌ GMAIL_USER or GMAIL_PASS missing in env vars')
    return
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  })

  const info = STATUS_INFO['pending']

  const html = buildEmailHtml({ order, items, status: 'pending', info, isAdminCopy: true })

  await transporter.sendMail({
    from:    `"BLAZE FITSS Orders" <${gmailUser}>`,
    to:      gmailUser, // admin receives this
    subject: `🧾 New Order ${order.order_number} — Rs ${parseFloat(order.total_amount).toFixed(0)} — ${order.customer_name}`,
    html,
  })

  console.log(`✅ New order admin email sent: ${order.order_number}`)
}