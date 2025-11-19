import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  isEmailVerified: boolean
  checkEmailVerification: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Error getting session:', error)
        }
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          checkEmailVerificationStatus(session.user.id)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error in getSession:', error)
        setLoading(false) // Asegurar que loading se ponga en false incluso si hay error
      })

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await checkEmailVerificationStatus(session.user.id)
      } else {
        setIsEmailVerified(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkEmailVerificationStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('email_verified')
        .eq('id', userId)
        .single()

      if (error) {
        // Si no existe el perfil, crear uno
        if (error.code === 'PGRST116') {
          setIsEmailVerified(false)
          return false
        }
        console.error('Error checking email verification:', error)
        return false
      }

      const verified = data?.email_verified ?? false
      setIsEmailVerified(verified)
      return verified
    } catch (error) {
      console.error('Error checking email verification:', error)
      return false
    }
  }

  const signInWithGoogle = async () => {
    try {
      // En el cliente, siempre usar window.location.origin para obtener la URL actual
      // Esto asegura que funcione tanto en localhost como en producción
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : (process.env.NEXT_PUBLIC_BASE_URL || '')
      
      const redirectUrl = `${baseUrl}/auth/callback`
      
      console.log('🔐 Iniciando sesión con Google')
      console.log('📍 URL actual:', baseUrl)
      console.log('🔄 RedirectTo:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('❌ Error en signInWithOAuth:', error)
        throw error
      }
      
      console.log('✅ Redirección iniciada correctamente')
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const checkEmailVerification = async () => {
    if (!user) return false
    return await checkEmailVerificationStatus(user.id)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signOut,
        isEmailVerified,
        checkEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

