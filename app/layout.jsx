// app/layout.jsx
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Notification from '../components/Notification'
import WhatsAppButton from '../components/WhatsAppButton'
import CheckoutModal from '../components/CheckoutModal'
import './globals.css'

export const metadata = {
  title: 'BLAZE FITSS — Football Gear',
  description: 'Premium football jerseys, boots, balls and kids gear.',
}

// ✅ CRITICAL: without this, mobile browsers render at ~980px desktop width
// and media queries never trigger properly
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <div style={{
              display: 'flex', flexDirection: 'column', minHeight: '100vh',
              width: '100%', overflowX: 'hidden',
            }}>
              <Navbar />
              <main style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
                {children}
              </main>
              <Footer />
            </div>
            <Notification />
            <WhatsAppButton />
            <CheckoutModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}