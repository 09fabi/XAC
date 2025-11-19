import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Manejar el callback de OAuth desde el hash de la URL
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // Si no hay sesión, intentar obtenerla del hash
        if (!session) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            if (error) throw error
            if (data.session) {
              // Continuar con el flujo usando data.session
              await processUserSession(data.session)
              return
            }
          }
        }

        if (sessionError) {
          throw sessionError
        }

        if (session) {
          await processUserSession(session)
        } else {
          setError('No se pudo obtener la sesión')
          setLoading(false)
        }
      } catch (err: any) {
        console.error('Error in auth callback:', err)
        setError(err.message || 'Error al autenticar')
        setLoading(false)
      }
    }

    const processUserSession = async (session: any) => {
      if (!session?.user) {
        setError('No se pudo obtener la sesión')
        setLoading(false)
        return
      }

      try {

        // Verificar si el usuario es nuevo (primer login)
        let { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('email_verified')
          .eq('id', session.user.id)
          .single()

        // Si no existe el perfil, crearlo
        if (profileError && profileError.code === 'PGRST116') {
          console.log('Creando perfil para nuevo usuario:', session.user.id)
          
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Usuario',
              email_verified: false,
            })
            .select('email_verified')
            .single()

          if (insertError) {
            console.error('Error creating profile:', insertError)
            // Intentar de nuevo después de un momento (el trigger puede tardar)
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const { data: retryProfile } = await supabase
              .from('user_profiles')
              .select('email_verified')
              .eq('id', session.user.id)
              .single()
            
            if (retryProfile) {
              profile = retryProfile
            } else {
              throw new Error('No se pudo crear el perfil de usuario')
            }
          } else {
            profile = newProfile
          }
        } else if (profileError) {
          console.error('Error checking profile:', profileError)
          throw new Error('Error al verificar perfil de usuario')
        }

        // Si el email no está verificado, redirigir a la página de verificación
        if (!profile?.email_verified) {
          // Enviar código de verificación automáticamente
          try {
            await fetch('/api/auth/send-verification-code', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: session.user.email,
                userId: session.user.id,
                accessToken: session.access_token,
              }),
            })
          } catch (err) {
            console.error('Error sending verification code:', err)
          }

          router.push('/auth/verify-email')
          return
        }

        // Si está verificado, redirigir al perfil
        router.push('/profile')
      } catch (err: any) {
        console.error('Error processing session:', err)
        setError(err.message || 'Error al procesar la sesión')
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router])

  if (loading) {
    return (
      <>
        <Head>
          <title>Verificando... - XAC</title>
        </Head>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Verificando autenticación...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error - XAC</title>
        </Head>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => router.push('/auth/login')}
                className="btn-primary"
              >
                Volver al login
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  return null
}

