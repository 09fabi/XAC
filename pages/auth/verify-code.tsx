import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function VerifyCodePage() {
  const router = useRouter()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Countdown para reenvío
  if (countdown > 0) {
    setTimeout(() => setCountdown(countdown - 1), 1000)
  }

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

  // Verificar código (solo UI, sin funcionalidad)
  const handleVerify = async () => {
    const codeString = code.join('')
    if (codeString.length !== 6) {
      return
    }

    setVerifying(true)
    // TODO: Implementar verificación
    console.log('Verificar código:', codeString)
    
    setTimeout(() => {
      setVerifying(false)
    }, 1000)
  }

  // Reenviar código (solo UI, sin funcionalidad)
  const handleResend = async () => {
    if (countdown > 0) return

    setResending(true)
    // TODO: Implementar reenvío
    console.log('Reenviar código')
    
    setTimeout(() => {
      setResending(false)
      setCountdown(60)
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    }, 1000)
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
              <span className="text-white font-semibold">usuario@email.com</span>
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
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
