import type { AppProps } from 'next/app'
import { CartProvider } from '@/context/CartContext'
import { AlertProvider } from '@/context/AlertContext'
import { AuthProvider } from '@/context/AuthContext'
import PageTransition from '@/components/PageTransition'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <AlertProvider>
          <PageTransition>
            <Component {...pageProps} />
          </PageTransition>
        </AlertProvider>
      </CartProvider>
    </AuthProvider>
  )
}

