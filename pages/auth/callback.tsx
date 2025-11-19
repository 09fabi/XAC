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
    const handleAuthCallback = async () => {
      try {
        // Obtener el hash de la URL (#access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const errorParam = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        // Si hay un error en la URL
        if (errorParam) {
          const errorMessage = errorDescription || errorParam
          setError(errorMessage)
          showError(`Error de autenticación: ${errorMessage}`)
          setLoading(false)
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
          return
        }

        // Si hay tokens, establecer la sesión
        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            throw sessionError
          }

          if (data.user) {
            // Refrescar la sesión en el contexto
            await refreshSession()
            
            // Obtener el nombre del usuario desde los metadatos
            const userName = data.user.user_metadata?.name || 
                           data.user.user_metadata?.full_name || 
                           data.user.email?.split('@')[0] || 
                           'Usuario'

            showSuccess(`¡Bienvenido a XAC, ${userName}!`)
            
            // Redirigir a la página principal o a la URL de redirect
            const redirectTo = router.query.redirect as string || '/'
            router.push(redirectTo)
          }
        } else {
          // No hay tokens, verificar si hay una sesión activa
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            await refreshSession()
            const userName = session.user.user_metadata?.name || 
                           session.user.user_metadata?.full_name || 
                           session.user.email?.split('@')[0] || 
                           'Usuario'
            
            showSuccess(`¡Bienvenido a XAC, ${userName}!`)
            const redirectTo = router.query.redirect as string || '/'
            router.push(redirectTo)
          } else {
            throw new Error('No se pudo obtener la sesión')
          }
        }
      } catch (err: any) {
        console.error('Error en callback:', err)
        const errorMessage = err.message || 'Error al autenticarse'
        setError(errorMessage)
        showError(`Error: ${errorMessage}`)
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } finally {
        setLoading(false)
      }
    }

    handleAuthCallback()
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

