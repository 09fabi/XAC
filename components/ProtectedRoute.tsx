import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Timeout de seguridad más corto
    const timeoutId = setTimeout(() => {
      if (!user && !loading && !redirecting) {
        console.warn('ProtectedRoute: Timeout reached, redirecting to login')
        setRedirecting(true)
        const currentPath = router.asPath
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
      }
    }, 5000) // 5 segundos máximo

    if (!loading && !user && !redirecting) {
      // Guardar la URL actual para redirigir después del login
      setRedirecting(true)
      const currentPath = router.asPath
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [user, loading, router, redirectTo, redirecting])

  // Mostrar loading mientras se verifica la autenticación
  if (loading || redirecting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <div className="text-white text-lg">Cargando...</div>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no mostrar nada (el useEffect redirigirá)
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Redirigiendo...</div>
      </div>
    )
  }

  // Si hay usuario, mostrar el contenido
  return <>{children}</>
}

