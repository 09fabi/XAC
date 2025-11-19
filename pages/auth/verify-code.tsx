import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAuth } from '@/context/AuthContext'
import { useAlert } from '@/context/AlertContext'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function VerifyCodePage() {
  const router = useRouter()
  const { user, profile, loading: authLoading, refreshSession } = useAuth()
  const { showError, showSuccess } = useAlert()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  // Redirigir si ya está verificado
  useEffect(() => {
    if (profile?.email_verified) {
      router.push('/')
    }
  }, [profile, router])

  // Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Manejar entrada de código
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Solo números

    const newCode = [...code]
    newCode[index] = value.slice(-1) // Solo un dígito
    setCode(newCode)

    // Auto-focus siguiente input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  // Manejar backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  // Verificar código
  const handleVerify = async () => {
    if (!user) return

    const codeString = code.join('')
    if (codeString.length !== 6) {
      showError('Por favor, ingresa el código completo de 6 dígitos')
      return
    }

    setVerifying(true)

    try {
      // Obtener token de sesión
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          code: codeString,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showError(data.error || 'Error al verificar código')
        // Limpiar código en caso de error
        setCode(['', '', '', '', '', ''])
        document.getElementById('code-0')?.focus()
        return
      }

      showSuccess('¡Email verificado correctamente!')
      
      // Refrescar el perfil en el contexto
      await refreshSession()
      
      // Esperar un momento y redirigir
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error) {
      console.error('Error verificando código:', error)
      showError('Error al verificar código. Por favor, intenta de nuevo.')
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    } finally {
      setVerifying(false)
    }
  }

  // Reenviar código
  const handleResend = async () => {
    if (!user || countdown > 0) return

    setResending(true)

    try {
      // Obtener token de sesión
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          email: user.email,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        showError(data.error || 'Error al reenviar código')
        return
      }

      showSuccess(data.message || 'Código reenviado. Revisa tu email.')
      setCountdown(60) // 60 segundos de espera
      
      // Limpiar código actual
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    } catch (error) {
      console.error('Error reenviando código:', error)
      showError('Error al reenviar código. Por favor, intenta de nuevo.')
    } finally {
      setResending(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Verificar Email - XAC</title>
        <meta name="description" content="Verifica tu email con el código enviado" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navbar textColor="white" borderColor="white" />

        <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-center">
              Verificar Email
            </h1>

            <p className="text-gray-400 text-center mb-8">
              Hemos enviado un código de verificación de 6 dígitos a:
              <br />
              <span className="text-white font-semibold">{user.email}</span>
            </p>

            {/* Inputs de código */}
            <div className="flex justify-center gap-3 mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 bg-transparent border-2 border-white text-white text-center text-2xl font-bold focus:outline-none focus:border-white transition-colors"
                  disabled={verifying}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {/* Botón verificar */}
            <button
              onClick={handleVerify}
              disabled={verifying || code.join('').length !== 6}
              className="w-full bg-white text-black px-6 py-4 font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {verifying ? 'Verificando...' : 'Verificar Código'}
            </button>

            {/* Reenviar código */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                ¿No recibiste el código?
              </p>
              <button
                onClick={handleResend}
                disabled={resending || countdown > 0}
                className="text-white hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed underline"
              >
                {resending
                  ? 'Enviando...'
                  : countdown > 0
                  ? `Reenviar en ${countdown}s`
                  : 'Reenviar código'}
              </button>
            </div>

            {/* Nota para desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-900 border-2 border-white text-center">
                <p className="text-sm text-gray-400 mb-2">
                  💡 En desarrollo, el código aparece en la consola del servidor
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

