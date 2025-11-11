import type { AppProps } from 'next/app'
import { CartProvider } from '@/context/CartContext'
import TopBanner from '@/components/TopBanner'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <TopBanner />
      <Component {...pageProps} />
    </CartProvider>
  )
}

