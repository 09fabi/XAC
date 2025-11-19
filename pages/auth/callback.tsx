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
    let timeoutId: NodeJS.Timeout

    const handleAuthCallback = async () => {
      try {
        if (!mounted) return

        console.log('AuthCallback: Iniciando procesamiento...')
        console.log('URL completa:', window.location.href)
        console.log('Hash:', window.location.hash)
        console.log('Query params:', window.location.search)

        // Esperar un momento para que Supabase procese la redirección
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Verificar primero si ya hay una sesión activa (Supabase puede haberla establecido automáticamente)
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (existingSession && !sessionError) {
          console.log('AuthCallback: Sesión existente encontrada')
          await refreshSession()
          
          if (!mounted) return
          
          const userName = existingSession.user.user_metadata?.name || 
                         existingSession.user.user_metadata?.full_name || 
                         existingSession.user.email?.split('@')[0] || 
                         'Usuario'
          
          showSuccess(`¡Bienvenido a XAC, ${userName}!`)
          const redirectTo = router.query.redirect as string || '/'
          router.push(redirectTo)
          return
        }

        // Obtener el hash de la URL (#access_token=...)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const errorParam = hashParams.get('error')
        const errorDescription = hashParams.get('error_description')

        console.log('AuthCallback: Tokens del hash:', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken,
          error: errorParam 
        })

        // Si hay un error en la URL
        if (errorParam) {
          const errorMessage = errorDescription || errorParam
          console.error('AuthCallback: Error en URL:', errorMessage)
          setError(errorMessage)
          showError(`Error de autenticación: ${errorMessage}`)
          setLoading(false)
          
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
          return
        }

        // Si hay tokens en el hash, establecer la sesión
        if (accessToken && refreshToken) {
          console.log('AuthCallback: Estableciendo sesión con tokens del hash')
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error('AuthCallback: Error al establecer sesión:', sessionError)
            throw sessionError
          }

          if (data.user) {
            console.log('AuthCallback: Sesión establecida correctamente')
            await refreshSession()
            
            const userName = data.user.user_metadata?.name || 
                           data.user.user_metadata?.full_name || 
                           data.user.email?.split('@')[0] || 
                           'Usuario'

            showSuccess(`¡Bienvenido a XAC, ${userName}!`)
            
            const redirectTo = router.query.redirect as string || '/'
            router.push(redirectTo)
            return
          }
        }

        // Si no hay tokens en el hash, verificar query parameters (algunos proveedores OAuth usan query)
        const queryParams = new URLSearchParams(window.location.search)
        const queryAccessToken = queryParams.get('access_token')
        const queryRefreshToken = queryParams.get('refresh_token')

        if (queryAccessToken && queryRefreshToken) {
          console.log('AuthCallback: Tokens encontrados en query params')
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: queryAccessToken,
            refresh_token: queryRefreshToken,
          })

          if (sessionError) {
            throw sessionError
          }

          if (data.user) {
            await refreshSession()
            const userName = data.user.user_metadata?.name || 
                           data.user.user_metadata?.full_name || 
                           data.user.email?.split('@')[0] || 
                           'Usuario'

            showSuccess(`¡Bienvenido a XAC, ${userName}!`)
            const redirectTo = router.query.redirect as string || '/'
            router.push(redirectTo)
            return
          }
        }

        // Si llegamos aquí, no hay tokens ni sesión
        console.warn('AuthCallback: No se encontraron tokens ni sesión')
        
        // Intentar una última vez después de esperar
        await new Promise(resolve => setTimeout(resolve, 2000))
        const { data: { session: finalSession } } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (finalSession) {
          console.log('AuthCallback: Sesión encontrada en segundo intento')
          await refreshSession()
          
          if (!mounted) return
          
          const userName = finalSession.user.user_metadata?.name || 
                         finalSession.user.user_metadata?.full_name || 
                         finalSession.user.email?.split('@')[0] || 
                         'Usuario'
          
          showSuccess(`¡Bienvenido a XAC, ${userName}!`)
          const redirectTo = router.query.redirect as string || '/'
          router.push(redirectTo)
          return
        }

        throw new Error('No se pudo obtener la sesión. Por favor, intenta de nuevo.')
      } catch (err: any) {
        if (!mounted) return
        
        console.error('AuthCallback: Error completo:', err)
        const errorMessage = err.message || 'Error al autenticarse'
        setError(errorMessage)
        showError(`Error: ${errorMessage}`)
        
        timeoutId = setTimeout(() => {
          if (mounted) {
            router.push('/auth/login')
          }
        }, 3000)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Escuchar cambios en el estado de autenticación (por si Supabase establece la sesión automáticamente)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log('AuthCallback: Auth state changed:', event, session?.user?.email)

      if (event === 'SIGNED_IN' && session) {
        console.log('AuthCallback: Usuario autenticado vía onAuthStateChange')
        clearTimeout(timeoutId)
        await refreshSession()
        
        if (!mounted) return

        const userName = session.user.user_metadata?.name || 
                       session.user.user_metadata?.full_name || 
                       session.user.email?.split('@')[0] || 
                       'Usuario'
        
        showSuccess(`¡Bienvenido a XAC, ${userName}!`)
        const redirectTo = router.query.redirect as string || '/'
        router.push(redirectTo)
      }
    })

    // Iniciar el procesamiento después de un breve delay
    timeoutId = setTimeout(() => {
      handleAuthCallback()
    }, 500)

    return () => {
      mounted = false
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

