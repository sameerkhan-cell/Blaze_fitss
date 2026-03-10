// lib/email.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const STATUS_INFO = {
  confirmed: {
    subject: '✅ Your BLAZE FITSS Order is Confirmed!',
    emoji:   '✅',
    heading: 'Order Confirmed!',
    color:   '#818cf8',
    message: 'Great news! We have received your order and it is now being processed. We will notify you once it ships.',
  },
  shipped: {
    subject: '🚚 Your BLAZE FITSS Order Has Shipped!',
    emoji:   '🚚',
    heading: 'Your Order is On the Way!',
    color:   '#38bdf8',
    message: 'Your order has been shipped and is on its way to you. Please allow 2–5 business days for delivery.',
  },
  delivered: {
    subject: '🎉 Your BLAZE FITSS Order Has Been Delivered!',
    emoji:   '🎉',
    heading: 'Order Delivered!',
    color:   '#34d399',
    message: 'Your order has been delivered! We hope you love your new gear. Thank you for shopping with BLAZE FITSS.',
  },
  cancelled: {
    subject: '❌ Your BLAZE FITSS Order Has Been Cancelled',
    emoji:   '❌',
    heading: 'Order Cancelled',
    color:   '#f87171',
    message: 'Unfortunately your order has been cancelled. If you have any questions, please contact us. We are sorry for the inconvenience.',
  },
  pending: {
    subject: '⏳ Your BLAZE FITSS Order is Pending',
    emoji:   '⏳',
    heading: 'Order Pending',
    color:   '#f59e0b',
    message: 'Your order is currently pending review. We will update you shortly.',
  },
}

export async function sendOrderStatusEmail(order, newStatus) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured — skipping')
    return
  }

  const info = STATUS_INFO[newStatus]
  if (!info) return

  const itemsHtml = order.items?.map(item => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #1e1e1e;color:#f0ece4;font-size:14px;">${item.product_name}</td>
      <td style="padding:10px;border-bottom:1px solid #1e1e1e;color:#888;text-align:center;">x${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #1e1e1e;color:#e8d5b7;text-align:right;">Rs ${(parseFloat(item.price) * item.quantity).toFixed(0)}</td>
    </tr>
  `).join('') || ''

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:Arial,sans-serif;">
<div style="max-width:580px;margin:0 auto;padding:40px 20px;">

  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="color:#f0ece4;font-size:22px;font-weight:300;letter-spacing:6px;margin:0;">
      BLAZE <span style="color:#e8d5b7;font-size:13px;letter-spacing:8px;">FITSS</span>
    </h1>
  </div>

  <div style="background:#111;border:1px solid #1e1e1e;border-radius:12px;padding:32px;margin-bottom:24px;text-align:center;">
    <div style="font-size:48px;margin-bottom:16px;">${info.emoji}</div>
    <h2 style="color:${info.color};font-size:24px;font-weight:300;margin:0 0 12px;">${info.heading}</h2>
    <p style="color:#888;font-size:14px;line-height:1.6;margin:0;">${info.message}</p>
  </div>

  <div style="background:#111;border:1px solid #1e1e1e;border-radius:12px;padding:24px;margin-bottom:24px;">
    <table style="width:100%;margin-bottom:16px;">
      <tr>
        <td>
          <p style="color:#555;font-size:11px;letter-spacing:2px;margin:0 0 4px;font-family:monospace;">ORDER NUMBER</p>
          <p style="color:#e8d5b7;font-size:14px;font-family:monospace;margin:0;">${order.order_number}</p>
        </td>
        <td style="text-align:right;">
          <p style="color:#555;font-size:11px;letter-spacing:2px;margin:0 0 4px;font-family:monospace;">STATUS</p>
          <span style="background:${info.color}22;color:${info.color};padding:3px 10px;border-radius:20px;font-size:11px;font-family:monospace;">${newStatus.toUpperCase()}</span>
        </td>
      </tr>
    </table>

    <div style="margin-bottom:16px;">
      <p style="color:#555;font-size:11px;letter-spacing:2px;margin:0 0 8px;font-family:monospace;">SHIPPING TO</p>
      <p style="color:#aaa;font-size:14px;margin:0;line-height:1.5;">
        ${order.customer_name}<br>
        ${[order.shipping_address, order.city, order.country].filter(Boolean).join(', ')}
      </p>
    </div>

    ${itemsHtml ? `
    <table style="width:100%;border-collapse:collapse;margin-top:16px;">
      <thead>
        <tr>
          <th style="color:#444;font-size:10px;letter-spacing:2px;padding:8px 10px;text-align:left;font-family:monospace;font-weight:normal;border-bottom:1px solid #1e1e1e;">ITEM</th>
          <th style="color:#444;font-size:10px;letter-spacing:2px;padding:8px 10px;text-align:center;font-family:monospace;font-weight:normal;border-bottom:1px solid #1e1e1e;">QTY</th>
          <th style="color:#444;font-size:10px;letter-spacing:2px;padding:8px 10px;text-align:right;font-family:monospace;font-weight:normal;border-bottom:1px solid #1e1e1e;">PRICE</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:12px 10px;color:#555;font-family:monospace;font-size:11px;letter-spacing:2px;">TOTAL</td>
          <td style="padding:12px 10px;color:#e8d5b7;font-size:16px;text-align:right;font-family:monospace;">Rs ${parseFloat(order.total_amount).toFixed(0)}</td>
        </tr>
      </tfoot>
    </table>
    ` : ''}
  </div>

  <div style="text-align:center;">
    <p style="color:#333;font-size:12px;font-family:monospace;letter-spacing:1px;">
      Questions? WhatsApp us at +92 311 818 6132<br><br>
      © ${new Date().getFullYear()} BLAZE FITSS. All rights reserved.
    </p>
  </div>

</div>
</body>
</html>`

  await transporter.sendMail({
    from:    `"BLAZE FITSS" <${process.env.EMAIL_USER}>`,
    to:      order.customer_email,
    subject: info.subject,
    html,
  })

  console.log(`Email sent to ${order.customer_email} — ${newStatus}`)
}