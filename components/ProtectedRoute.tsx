import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: Implementar protección de rutas
  // Por ahora, mostrar el contenido directamente
  return <>{children}</>
}
