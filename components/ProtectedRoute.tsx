import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ children, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      // Guardar la URL actual para redirigir después del login
      const currentPath = router.asPath
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [user, loading, router, redirectTo])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    )
  }

  // Si no hay usuario, no mostrar nada (el useEffect redirigirá)
  if (!user) {
    return null
  }

  // Si hay usuario, mostrar el contenido
  return <>{children}</>
}

