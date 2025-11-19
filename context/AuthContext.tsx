import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  name?: string
  created_at?: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Función para obtener el perfil del usuario desde user_profiles
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Función para crear o actualizar el perfil del usuario
  const createOrUpdateProfile = async (user: User, name?: string) => {
    try {
      const profileData = {
        id: user.id,
        email: user.email || '',
        name: name || user.user_metadata?.name || user.user_metadata?.full_name || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' })

      if (error) {
        console.error('Error creating/updating profile:', error)
      } else {
        // Actualizar el perfil en el estado
        const updatedProfile = await fetchUserProfile(user.id)
        if (updatedProfile) {
          setProfile(updatedProfile)
        }
      }
    } catch (error) {
      console.error('Error in createOrUpdateProfile:', error)
    }
  }

  // Inicializar sesión y escuchar cambios
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    // Timeout de seguridad para evitar loading infinito
    timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn('Auth initialization timeout - setting loading to false')
        setLoading(false)
      }
    }, 10000) // 10 segundos máximo

    // Obtener sesión inicial
    const getInitialSession = async () => {
      try {
        // Verificar que estamos en el cliente
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
          clearTimeout(timeoutId)
          setLoading(false)
          return
        }

        if (session) {
          setSession(session)
          setUser(session.user)
          
          // Obtener perfil del usuario (con timeout)
          try {
            const userProfile = await Promise.race([
              fetchUserProfile(session.user.id),
              new Promise<UserProfile | null>((resolve) => 
                setTimeout(() => resolve(null), 5000)
              )
            ])
            
            if (userProfile) {
              setProfile(userProfile)
            } else {
              // Si no existe perfil, crearlo
              await createOrUpdateProfile(session.user)
            }
          } catch (profileError) {
            console.error('Error fetching/creating profile:', profileError)
            // Continuar aunque falle el perfil
          }
        } else {
          setSession(null)
          setUser(null)
          setProfile(null)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
        }
      } finally {
        if (mounted) {
          clearTimeout(timeoutId)
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          // Obtener o crear perfil (con manejo de errores)
          try {
            const userProfile = await Promise.race([
              fetchUserProfile(session.user.id),
              new Promise<UserProfile | null>((resolve) => 
                setTimeout(() => resolve(null), 5000)
              )
            ])
            
            if (userProfile) {
              setProfile(userProfile)
            } else {
              await createOrUpdateProfile(session.user)
            }
          } catch (profileError) {
            console.error('Error in auth state change profile:', profileError)
            // Continuar aunque falle
          }
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  // Función de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        await createOrUpdateProfile(data.user)
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Función de registro
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          },
        },
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        await createOrUpdateProfile(data.user, name)
      }

      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Función de logout
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
      } else {
        setUser(null)
        setProfile(null)
        setSession(null)
      }
    } catch (error) {
      console.error('Error in signOut:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función de login con Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('Error signing in with Google:', error)
      }
    } catch (error) {
      console.error('Error in signInWithGoogle:', error)
    }
  }

  // Función para refrescar la sesión
  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('Error refreshing session:', error)
        return
      }

      if (session) {
        setSession(session)
        setUser(session.user)
        const userProfile = await fetchUserProfile(session.user.id)
        if (userProfile) {
          setProfile(userProfile)
        }
      }
    } catch (error) {
      console.error('Error in refreshSession:', error)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

