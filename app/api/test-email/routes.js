import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = {}

  result.EMAIL_USER = process.env.EMAIL_USER || 'NOT SET'
  result.EMAIL_PASS = process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} chars)` : 'NOT SET'

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from:    `"BLAZE FITSS" <${process.env.EMAIL_USER}>`,
      to:      process.env.EMAIL_USER,
      subject: '✅ BLAZE FITSS Email Test',
      html:    '<h1>Email is working!</h1>',
    })

    result.status = 'SUCCESS'
  } catch (err) {
    result.status = 'FAILED'
    result.error  = err.message
  }

  return NextResponse.json(result)
}