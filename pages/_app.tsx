import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import { CartProvider } from '@/context/CartContext'
import { AlertProvider } from '@/context/AlertContext'
import PageTransition from '@/components/PageTransition'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <CartProvider>
        <AlertProvider>
          <PageTransition>
            <Component {...pageProps} />
          </PageTransition>
        </AlertProvider>
      </CartProvider>
    </ClerkProvider>
  )
}

