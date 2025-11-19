import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { useAlert } from '@/context/AlertContext'
import Navbar from '@/components/Navbar'

export default function AuthCallback() {
  const router = useRouter()
  const { refreshSession } = useAuth()
  const { showSuccess, showError } = useAlert()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let redirecting = false
    let timeoutId: NodeJS.Timeout

    const redirectToHome = (userName: string) => {
      if (redirecting || !mounted) return
      redirecting = true
      
      showSuccess(`¡Bienvenido a XAC, ${userName}!`)
      const redirectTo = router.query.redirect as string || '/'
      router.push(redirectTo)
    }

    // Función para verificar si el email está verificado
    const checkEmailVerification = async (userId: string): Promise<boolean> => {
      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('email_verified')
          .eq('id', userId)
          .single()

        if (error || !profile) {
          return false
        }

        return profile.email_verified === true
      } catch (error) {
        console.error('Error verificando email:', error)
        return false
      }
    }

    // Función para enviar código de verificación
    const sendVerificationCode = async (userId: string, email: string) => {
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
            email: email,
            userId: userId,
          }),
        })

        const data = await response.json()
        return response.ok
      } catch (error) {
        console.error('Error enviando código:', error)
        return false
      }
    }

    // Escuchar cambios en el estado de autenticación (PRIMERO - esto es lo más importante)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted || redirecting) return

      console.log('AuthCallback: Auth state changed:', event, session?.user?.email)

      if (event === 'SIGNED_IN' && session) {
        console.log('AuthCallback: Usuario autenticado vía onAuthStateChange')
        clearTimeout(timeoutId)
        setLoading(false)
        
        await refreshSession()
        
        if (!mounted || redirecting) return

        // Verificar si el email está verificado
        const isVerified = await checkEmailVerification(session.user.id)

        if (!isVerified) {
          // Usuario no verificado - enviar código y redirigir a verificación
          console.log('AuthCallback: Usuario no verificado, enviando código...')
          const codeSent = await sendVerificationCode(session.user.id, session.user.email || '')
          
          if (codeSent) {
            router.push('/auth/verify-code')
          } else {
            showError('Error al enviar código de verificación. Por favor, intenta de nuevo.')
            setTimeout(() => {
              if (mounted) router.push('/auth/login')
            }, 3000)
          }
          return
        }

        // Usuario verificado - redirigir normalmente
        const userName = session.user.user_metadata?.name || 
                       session.user.user_metadata?.full_name || 
                       session.user.email?.split('@')[0] || 
                       'Usuario'
        
        redirectToHome(userName)
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthCallback: Usuario cerró sesión')
        setLoading(false)
        if (mounted && !redirecting) {
          router.push('/auth/login')
        }
      }
    })

    // Verificar sesión existente inmediatamente (sin esperar)
    const checkSession = async () => {
      try {
        if (!mounted || redirecting) return

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted || redirecting) return

        if (error) {
          console.error('AuthCallback: Error al obtener sesión:', error)
          setError('Error al verificar la sesión')
          setLoading(false)
          setTimeout(() => {
            if (mounted) router.push('/auth/login')
          }, 2000)
          return
        }

        if (session) {
          console.log('AuthCallback: Sesión encontrada inmediatamente')
          clearTimeout(timeoutId)
          setLoading(false)
          
          await refreshSession()
          
          if (!mounted || redirecting) return

          // Verificar si el email está verificado
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('email_verified')
            .eq('id', session.user.id)
            .single()

          if (!profile || !profile.email_verified) {
            // Usuario no verificado - enviar código y redirigir a verificación
            console.log('AuthCallback: Usuario no verificado, enviando código...')
            // Obtener token de sesión
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            const token = currentSession?.access_token

            const response = await fetch('/api/auth/send-verification-code', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: JSON.stringify({
                email: session.user.email,
                userId: session.user.id,
              }),
            })

            if (response.ok) {
              router.push('/auth/verify-code')
            } else {
              showError('Error al enviar código de verificación')
              setTimeout(() => {
                if (mounted) router.push('/auth/login')
              }, 3000)
            }
            return
          }

          // Usuario verificado - redirigir normalmente
          const userName = session.user.user_metadata?.name || 
                         session.user.user_metadata?.full_name || 
                         session.user.email?.split('@')[0] || 
                         'Usuario'
          
          redirectToHome(userName)
          return
        }

        // Si no hay sesión, verificar si hay tokens en la URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const errorParam = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        if (errorParam) {
          const errorMessage = errorDescription || errorParam
          console.error('AuthCallback: Error en URL:', errorMessage)
          setError(errorMessage)
          showError(`Error de autenticación: ${errorMessage}`)
          setLoading(false)
          setTimeout(() => {
            if (mounted) router.push('/auth/login')
          }, 2000)
          return
        }

        // Si no hay sesión ni error, esperar un poco más (Supabase puede estar procesando)
        // Pero con un timeout máximo
        console.log('AuthCallback: Esperando que Supabase procese la sesión...')
      } catch (err: any) {
        console.error('AuthCallback: Error en checkSession:', err)
        if (mounted && !redirecting) {
          setError('Error al procesar la autenticación')
          setLoading(false)
          setTimeout(() => {
            if (mounted) router.push('/auth/login')
          }, 2000)
        }
      }
    }

    // Verificar inmediatamente
    checkSession()

    // Timeout de seguridad: si después de 5 segundos no hay sesión, redirigir
    timeoutId = setTimeout(() => {
      if (!mounted || redirecting) return
      
      console.warn('AuthCallback: Timeout - verificando sesión una última vez')
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted || redirecting) return
        
        if (session) {
          setLoading(false)
          refreshSession().then(async () => {
            if (!mounted || redirecting) return

            // Verificar si el email está verificado
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('email_verified')
              .eq('id', session.user.id)
              .single()

            if (!profile || !profile.email_verified) {
              // Usuario no verificado - enviar código
              // Obtener token de sesión
              const { data: { session: currentSession } } = await supabase.auth.getSession()
              const token = currentSession?.access_token

              const response = await fetch('/api/auth/send-verification-code', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                  email: session.user.email,
                  userId: session.user.id,
                }),
              })

              if (response.ok) {
                router.push('/auth/verify-code')
              } else {
                showError('Error al enviar código de verificación')
                setTimeout(() => {
                  if (mounted) router.push('/auth/login')
                }, 3000)
              }
              return
            }

            // Usuario verificado
            const userName = session.user.user_metadata?.name || 
                           session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'Usuario'
            redirectToHome(userName)
          })
        } else {
          setError('La autenticación está tomando demasiado tiempo. Por favor, intenta de nuevo.')
          setLoading(false)
          setTimeout(() => {
            if (mounted) router.push('/auth/login')
          }, 2000)
        }
      })
    }, 5000) // 5 segundos máximo

    return () => {
      mounted = false
      redirecting = true
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [router, refreshSession, showSuccess, showError])

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
          
          {error && (
            <div className="max-w-md mx-auto">
              <p className="text-red-400 mb-4">{error}</p>
              <p className="text-sm text-gray-400">Redirigiendo al login...</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

