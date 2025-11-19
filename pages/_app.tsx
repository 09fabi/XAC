import type { AppProps } from 'next/app'
import { CartProvider } from '@/context/CartContext'
import { AlertProvider } from '@/context/AlertContext'
import PageTransition from '@/components/PageTransition'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <AlertProvider>
        <PageTransition>
          <Component {...pageProps} />
        </PageTransition>
      </AlertProvider>
    </CartProvider>
  )
}

