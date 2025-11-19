import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import { useAlert } from '@/context/AlertContext'
import { supabase } from '@/lib/supabase'

export default function VerifyEmail() {
  const router = useRouter()
  const { user, checkEmailVerification } = useAuth()
  const { showSuccess, showError } = useAlert()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    // Si no hay usuario, redirigir al login
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Verificar si ya está verificado
    checkEmailVerification().then((verified) => {
      if (verified) {
        router.push('/profile')
      }
    })
  }, [user, router, checkEmailVerification])

  useEffect(() => {
    // Countdown para reenvío de código
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      showError('No hay usuario autenticado')
      return
    }

    if (code.length !== 6) {
      showError('El código debe tener 6 dígitos')
      return
    }

    setIsLoading(true)

    try {
      // Obtener el token de acceso de la sesión
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          userId: user.id,
          email: user.email,
          accessToken: accessToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al verificar código')
      }

      showSuccess('Email verificado correctamente')
      
      // Esperar un momento y redirigir
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } catch (error: any) {
      console.error('Error verifying code:', error)
      showError(error.message || 'Error al verificar el código')
      setCode('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!user || countdown > 0) return

    setIsSendingCode(true)

    try {
      // Obtener el token de acceso de la sesión
      const { data: { session } } = await supabase.auth.getSession()
      const accessToken = session?.access_token

      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userId: user.id,
          accessToken: accessToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar código')
      }

      showSuccess('Código de verificación enviado')
      setCountdown(60) // 60 segundos de espera

      // En desarrollo, mostrar el código
      if (data.code) {
        console.log('='.repeat(50))
        console.log('📧 CÓDIGO DE VERIFICACIÓN (DESARROLLO)')
        console.log(`Código: ${data.code}`)
        console.log('='.repeat(50))
        showSuccess(`Código enviado. Revisa la consola del servidor o aquí: ${data.code}`)
      } else {
        showSuccess('Código de verificación enviado. Revisa tu email.')
      }
    } catch (error: any) {
      console.error('Error sending code:', error)
      showError(error.message || 'Error al enviar el código')
    } finally {
      setIsSendingCode(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Verificar Email - XAC</title>
        <meta name="description" content="Verifica tu email para continuar" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Verifica tu email
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Hemos enviado un código de verificación a
              </p>
              <p className="mt-1 text-center text-sm font-medium text-gray-900">
                {user.email}
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleVerify}>
              <div>
                <label htmlFor="code" className="sr-only">
                  Código de verificación
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                  disabled={isLoading}
                />
                <p className="mt-2 text-center text-xs text-gray-500">
                  Ingresa el código de 6 dígitos que recibiste por email
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Verificando...' : 'Verificar código'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSendingCode || countdown > 0}
                  className="text-sm text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {countdown > 0
                    ? `Reenviar código en ${countdown}s`
                    : isSendingCode
                    ? 'Enviando...'
                    : 'No recibiste el código? Reenviar'}
                </button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

