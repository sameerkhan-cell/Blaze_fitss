// app/api/orders/route.js

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createOrder, getAllOrders } from '../../../lib/queries'
import { getCurrentUser } from '../../../lib/auth'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

// ── Email sender ─────────────────────────────────────────────────────────────
async function sendOrderNotification(order, items) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,      // your Gmail: sameerkhan031181@gmail.com
        pass: process.env.GMAIL_PASS, // Gmail App Password (16 chars, no spaces)
      },
    })

    const paymentLabels = {
      cod:       'Cash on Delivery',
      easypaisa: 'EasyPaisa',
      jazzcash:  'JazzCash',
      bank:      'Bank Transfer',
    }

    const itemsHtml = items?.length
      ? items.map(item => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #1e1e1e;color:#ccc;">${item.name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #1e1e1e;color:#ccc;text-align:center;">${item.quantity}</td>
            ${item.size ? `<td style="padding:8px 12px;border-bottom:1px solid #1e1e1e;color:#ccc;text-align:center;">${item.size}</td>` : '<td style="padding:8px 12px;border-bottom:1px solid #1e1e1e;color:#555;text-align:center;">—</td>'}
            <td style="padding:8px 12px;border-bottom:1px solid #1e1e1e;color:#e8d5b7;text-align:right;font-family:monospace;">Rs${(parseFloat(item.price) * item.quantity).toFixed(0)}</td>
          </tr>`).join('')
      : `<tr><td colspan="4" style="padding:8px 12px;color:#555;">No item details available</td></tr>`

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',sans-serif;">
        <div style="max-width:600px;margin:0 auto;background:#111;border:1px solid #1e1e1e;">

          <!-- Header -->
          <div style="background:#0a0a0a;padding:28px 32px;border-bottom:1px solid #1e1e1e;">
            <p style="margin:0;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#555;">New Order</p>
            <h1 style="margin:6px 0 0;font-size:22px;font-weight:300;color:#e8d5b7;letter-spacing:0.1em;">
              BLAZE FITSS
            </h1>
          </div>

          <!-- Order number + status -->
          <div style="padding:24px 32px;border-bottom:1px solid #1e1e1e;display:flex;justify-content:space-between;align-items:center;">
            <div>
              <p style="margin:0;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#555;">Order Number</p>
              <p style="margin:4px 0 0;font-family:monospace;font-size:15px;color:#e8d5b7;">${order.order_number}</p>
            </div>
            <div style="background:#1a1a0a;border:1px solid #3a3a1a;padding:6px 14px;border-radius:4px;">
              <span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#c8a84b;">Pending</span>
            </div>
          </div>

          <!-- Customer Details -->
          <div style="padding:24px 32px;border-bottom:1px solid #1e1e1e;">
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#555;">Customer Details</p>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:5px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;width:130px;">Name</td>
                <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.customer_name}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Email</td>
                <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.customer_email}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Phone</td>
                <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.customer_phone || '—'}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Address</td>
                <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.shipping_address}${order.city ? ', ' + order.city : ''}${order.country ? ', ' + order.country : ''}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Payment</td>
                <td style="padding:5px 0;font-size:14px;color:#ddd;">${paymentLabels[order.payment_method] || order.payment_method}</td>
              </tr>
              ${order.notes ? `
              <tr>
                <td style="padding:5px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:0.1em;">Notes</td>
                <td style="padding:5px 0;font-size:14px;color:#ddd;">${order.notes}</td>
              </tr>` : ''}
            </table>
          </div>

          <!-- Order Items -->
          <div style="padding:24px 32px;border-bottom:1px solid #1e1e1e;">
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#555;">Items Ordered</p>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#0c0c0c;">
                  <th style="padding:8px 12px;text-align:left;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444;font-weight:400;">Product</th>
                  <th style="padding:8px 12px;text-align:center;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444;font-weight:400;">Qty</th>
                  <th style="padding:8px 12px;text-align:center;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444;font-weight:400;">Size</th>
                  <th style="padding:8px 12px;text-align:right;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#444;font-weight:400;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
          </div>

          <!-- Total -->
          <div style="padding:20px 32px;border-bottom:1px solid #1e1e1e;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#555;">Total Amount</span>
            <span style="font-family:monospace;font-size:20px;color:#e8d5b7;">Rs${parseFloat(order.total_amount).toFixed(0)}</span>
          </div>

          <!-- Footer -->
          <div style="padding:20px 32px;">
            <p style="margin:0;font-size:11px;color:#444;text-align:center;">
              BLAZE FITSS · Admin Notification · ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })}
            </p>
          </div>

        </div>
      </body>
      </html>
    `

    await transporter.sendMail({
      from: `"BLAZE FITSS Orders" <${process.env.GMAIL_USER}>`,
      to:   process.env.GMAIL_USER, // sends to yourself
      subject: `🧾 New Order ${order.order_number} — Rs${parseFloat(order.total_amount).toFixed(0)} — ${order.customer_name}`,
      html,
    })

    console.log('Order notification email sent:', order.order_number)
  } catch (err) {
    // Don't crash the order if email fails — just log it
    console.error('Failed to send order notification email:', err.message)
  }
}

// ── GET all orders (admin) ────────────────────────────────────────────────────
export async function GET() {
  try {
    const orders = await getAllOrders()
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// ── POST create order ─────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get('bf_session')?.value

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'No active session / empty cart' }, { status: 400 })
    }

    const body = await request.json()
    const { name, email, phone, address, city, country, paymentMethod, notes } = body

    if (!name || !email || !address) {
      return NextResponse.json({ success: false, error: 'name, email and address are required' }, { status: 400 })
    }

    const user = await getCurrentUser()

    const order = await createOrder(sessionId, {
      name, email, phone, address, city,
      country: country || 'Pakistan',
      paymentMethod: paymentMethod || 'cod',
      notes,
    }, user?.id || null)

    console.log('Order created:', order?.order_number)

    // Send email notification (non-blocking — won't fail the order if email errors)
    await sendOrderNotification(order, order.items)

    return NextResponse.json({ success: true, data: order }, { status: 201 })

  } catch (error) {
    console.error('POST /api/orders error:', error.message)
    console.error('Full error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to create order'
    }, { status: 500 })
  }
}