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
  signUp: (email: string, password: string, name?: string) => Promise<{ error: AuthError | null; session?: Session | null; user?: User | null }>
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
      // Verificar si el perfil ya existe
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const profileData = {
        id: user.id,
        email: user.email || '',
        name: name || user.user_metadata?.name || user.user_metadata?.full_name || null,
        updated_at: new Date().toISOString(),
        // Si es un perfil nuevo, email_verified será false por defecto
        // Si ya existe, mantener el valor actual
        email_verified: existingProfile?.email_verified ?? false,
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

    // Obtener sesión inicial (rápido, sin esperar perfil)
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
          setLoading(false)
          return
        }

        if (session) {
          // Establecer sesión y usuario inmediatamente (sin esperar perfil)
          setSession(session)
          setUser(session.user)
          setLoading(false) // Marcar como no loading inmediatamente
          
          // Obtener perfil en segundo plano (sin bloquear)
          fetchUserProfile(session.user.id)
            .then((userProfile) => {
              if (!mounted) return
              
              if (userProfile) {
                setProfile(userProfile)
              } else {
                // Si no existe perfil, crearlo en segundo plano
                createOrUpdateProfile(session.user).catch((err) => {
                  console.error('Error creating profile:', err)
                })
              }
            })
            .catch((profileError) => {
              console.error('Error fetching profile:', profileError)
              // Intentar crear perfil si falla la obtención
              if (mounted) {
                createOrUpdateProfile(session.user).catch((err) => {
                  console.error('Error creating profile after fetch failed:', err)
                })
              }
            })
        } else {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Timeout de seguridad más corto (3 segundos)
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timeout - setting loading to false')
        setLoading(false)
      }
    }, 3000) // 3 segundos máximo

    getInitialSession()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.email)
        
        // Actualizar sesión y usuario inmediatamente
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false) // Marcar como no loading inmediatamente

        if (session?.user) {
          // Obtener o crear perfil en segundo plano (sin bloquear)
          fetchUserProfile(session.user.id)
            .then((userProfile) => {
              if (!mounted) return
              
              if (userProfile) {
                setProfile(userProfile)
              } else {
                createOrUpdateProfile(session.user).catch((err) => {
                  console.error('Error creating profile:', err)
                })
              }
            })
            .catch((profileError) => {
              console.error('Error in auth state change profile:', profileError)
              // Intentar crear perfil si falla
              if (mounted) {
                createOrUpdateProfile(session.user).catch((err) => {
                  console.error('Error creating profile after fetch failed:', err)
                })
              }
            })
        } else {
          setProfile(null)
        }
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
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
        },
      })

      if (error) {
        return { error }
      }

      // Si hay sesión después del registro (puede no haberla si requiere confirmación de email)
      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
        
        if (data.session.user) {
          await createOrUpdateProfile(data.session.user, name)
        }
      } else if (data.user) {
        // Usuario creado pero sin sesión (requiere confirmación de email)
        // Aún así creamos el perfil para cuando confirme
        await createOrUpdateProfile(data.user, name)
      }

      return { error: null, session: data.session, user: data.user }
    } catch (error) {
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  // Función de logout
  const signOut = async () => {
    try {
      // Limpiar estado inmediatamente para mejor UX
      setUser(null)
      setProfile(null)
      setSession(null)
      
      // Hacer signOut en segundo plano
      supabase.auth.signOut().catch((error) => {
        console.error('Error signing out:', error)
      })
    } catch (error) {
      console.error('Error in signOut:', error)
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

