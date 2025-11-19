import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/Navbar'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular procesamiento
    setTimeout(() => {
      setLoading(false)
      // TODO: Implementar callback de OAuth
      console.log('OAuth callback')
      router.push('/')
    }, 2000)
  }, [router])

  return (
    <>
      <Head>
        <title>Autenticando... - XAC</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar textColor="white" borderColor="white" />
        
        <div className="text-center">
          {loading && (
            <>
              <div className="mb-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
              <p className="text-lg uppercase tracking-wider">Autenticando...</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
