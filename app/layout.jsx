// app/layout.jsx
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Notification from '../components/Notification'
import WhatsAppButton from '../components/WhatsAppButton'
import CheckoutModal from '../components/CheckoutModal'
import PageTransition from '../components/PageTransition'
import ScrollProgressBar from '../components/ScrollProgressBar'
import './globals.css'

export const metadata = {
  title: 'BLAZE FITSS — Football Gear',
  description: 'Premium football jerseys, boots, balls and kids gear.',
}

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
            {/* ✅ Gold scroll progress bar at very top */}
            <ScrollProgressBar />

            <div style={{
              display: 'flex', flexDirection: 'column', minHeight: '100vh',
              width: '100%', overflowX: 'hidden',
            }}>
              <Navbar />
              {/* ✅ Smooth fade+slide on every page navigation */}
              <main style={{ flex: 1, width: '100%', overflowX: 'hidden' }}>
                <PageTransition>
                  {children}
                </PageTransition>
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