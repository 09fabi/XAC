import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useAlert } from '@/context/AlertContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type TabType = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const { user, signIn, signUp, signInWithGoogle, loading: authLoading } = useAuth()
  const { showError, showSuccess } = useAlert()
  
  const [activeTab, setActiveTab] = useState<TabType>('login')
  const [formLoading, setFormLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    name?: string
  }>({})

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (user && !authLoading) {
      const redirectTo = router.query.redirect as string || '/'
      router.push(redirectTo)
    }
  }, [user, authLoading, router])

  // Validación de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validación de formulario
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!validateEmail(email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (activeTab === 'register' && !name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setFormLoading(true)
    setErrors({})

    try {
      const { error } = await signIn(email, password)

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Email o contraseña incorrectos' })
        } else if (error.message.includes('Email not confirmed')) {
          showError('Por favor, verifica tu email antes de iniciar sesión')
        } else {
          showError(error.message || 'Error al iniciar sesión')
        }
        return
      }

      // Éxito - el useEffect redirigirá
      showSuccess(`¡Bienvenido de nuevo!`)
      const redirectTo = router.query.redirect as string || '/'
      router.push(redirectTo)
    } catch (error) {
      showError('Error inesperado al iniciar sesión')
      console.error('Login error:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Manejar registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setFormLoading(true)
    setErrors({})

    try {
      const { error } = await signUp(email, password, name)

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ email: 'Este email ya está registrado' })
        } else if (error.message.includes('Password')) {
          setErrors({ password: error.message })
        } else {
          showError(error.message || 'Error al registrarse')
        }
        return
      }

      // Éxito - mostrar mensaje y redirigir
      showSuccess(`¡Bienvenido a XAC, ${name}!`)
      const redirectTo = router.query.redirect as string || '/'
      router.push(redirectTo)
    } catch (error) {
      showError('Error inesperado al registrarse')
      console.error('Register error:', error)
    } finally {
      setFormLoading(false)
    }
  }

  // Manejar login con Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
      // La redirección se manejará en el callback
    } catch (error) {
      showError('Error al iniciar sesión con Google')
      console.error('Google login error:', error)
    }
  }

  // Si está cargando o ya autenticado, mostrar loading
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{activeTab === 'login' ? 'Iniciar Sesión' : 'Registrarse'} - XAC</title>
        <meta name="description" content={activeTab === 'login' ? 'Inicia sesión en XAC' : 'Crea tu cuenta en XAC'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navbar textColor="white" borderColor="white" />
        
        <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            {/* Tabs */}
            <div className="flex border-b-2 border-white mb-8">
              <button
                onClick={() => {
                  setActiveTab('login')
                  setErrors({})
                }}
                className={`flex-1 py-4 text-center font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'border-b-2 border-white text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setActiveTab('register')
                  setErrors({})
                }}
                className={`flex-1 py-4 text-center font-semibold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'border-b-2 border-white text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Formulario de Login */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="tu@email.com"
                    disabled={formLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Contraseña
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: undefined })
                    }}
                    className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="••••••••"
                    disabled={formLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-white text-black px-6 py-4 font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>
            )}

            {/* Formulario de Registro */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label htmlFor="register-name" className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Nombre
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors({ ...errors, name: undefined })
                    }}
                    className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="Tu nombre"
                    disabled={formLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors({ ...errors, email: undefined })
                    }}
                    className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="tu@email.com"
                    disabled={formLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium uppercase tracking-wider mb-2">
                    Contraseña
                  </label>
                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: undefined })
                    }}
                    className="w-full bg-transparent border-2 border-white text-white px-4 py-3 focus:outline-none focus:border-white transition-colors"
                    placeholder="Mínimo 6 caracteres"
                    disabled={formLoading}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-white text-black px-6 py-4 font-semibold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>
            )}

            {/* Separador */}
            <div className="my-8 flex items-center">
              <div className="flex-1 border-t-2 border-white"></div>
              <span className="px-4 text-sm uppercase tracking-wider text-gray-400">O</span>
              <div className="flex-1 border-t-2 border-white"></div>
            </div>

            {/* Botón de Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={formLoading || authLoading}
              className="w-full bg-transparent border-2 border-white text-white px-6 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </button>

            {/* Link de ayuda */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}

