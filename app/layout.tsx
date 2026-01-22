// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Providers } from '../components/providers/Providers'
import { CartProvider } from '../lib/context/CartContext'
import CartSidebar from '../components/cart/CartSidebar'
import { ToastProvider } from '../components/providers/ToastProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins'
})

// export const metadata: Metadata = {
//   title: "Pepe's Brunch and Cafe - Delicious Food Delivery",
//   description: 'Order delicious brunch and cafe items online',
// }

export const metadata: Metadata = {
  title: "Pepe's Brunch and Cafe",
  description: 'Order delicious brunch and cafe items online',
  icons: {
    icon: '/logo.png', // Change this to your logo path 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <ToastProvider>
          <Providers>
            <CartProvider>
              {children}
              <CartSidebar />
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    style: {
                      background: '#10b981',
                    },
                  },
                  error: {
                    style: {
                      background: '#ef4444',
                    },
                  },
                }}
              />
            </CartProvider>
          </Providers>
        </ToastProvider>
      </body>
    </html>
  )
}

