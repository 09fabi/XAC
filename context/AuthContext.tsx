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
      // Usar NEXT_PUBLIC_BASE_URL si está disponible, sino usar window.location.origin
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     (typeof window !== 'undefined' ? window.location.origin : '')
      
      const redirectUrl = `${baseUrl}/auth/callback`
      
      console.log('Iniciando sesión con Google, redirectTo:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (error) throw error
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

