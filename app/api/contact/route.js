// app/api/contact/route.js

import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,  // your gmail
        pass: process.env.GMAIL_PASS,  // your app password
      },
    })

    await transporter.sendMail({
      from:    `"BLAZE FITSS Contact" <${process.env.GMAIL_USER}>`,
      to:      'sameerkhan031181@gmail.com',
      replyTo: email,
      subject: `[BLAZE FITSS] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0c0c; color: #f0ece4; padding: 2rem; border-radius: 8px;">
          <h2 style="color: #e8d5b7; border-bottom: 1px solid #2a2a2a; padding-bottom: 1rem;">
            New Contact Message — BLAZE FITSS
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
            <tr>
              <td style="color: #888; font-size: 0.8rem; padding: 0.5rem 0; width: 80px;">NAME</td>
              <td style="color: #f0ece4; padding: 0.5rem 0;">${name}</td>
            </tr>
            <tr>
              <td style="color: #888; font-size: 0.8rem; padding: 0.5rem 0;">EMAIL</td>
              <td style="color: #f0ece4; padding: 0.5rem 0;"><a href="mailto:${email}" style="color: #e8d5b7;">${email}</a></td>
            </tr>
            <tr>
              <td style="color: #888; font-size: 0.8rem; padding: 0.5rem 0;">SUBJECT</td>
              <td style="color: #f0ece4; padding: 0.5rem 0;">${subject}</td>
            </tr>
          </table>
          <div style="background: #161616; border-radius: 6px; padding: 1.2rem; margin-top: 1rem;">
            <p style="color: #888; font-size: 0.75rem; margin-bottom: 0.75rem;">MESSAGE</p>
            <p style="color: #ccc; line-height: 1.7; white-space: pre-line;">${message}</p>
          </div>
          <p style="color: #444; font-size: 0.7rem; margin-top: 2rem; text-align: center;">
            Reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact email error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}