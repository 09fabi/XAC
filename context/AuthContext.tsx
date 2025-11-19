import React, { createContext, useContext, ReactNode } from 'react'

interface UserProfile {
  id: string
  email: string
  name?: string
  email_verified?: boolean
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: any | null
  profile: UserProfile | null
  session: any | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any | null }>
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
  // TODO: Implementar autenticación real
  const value: AuthContextType = {
    user: null,
    profile: null,
    session: null,
    loading: false,
    signIn: async () => {
      // TODO: Implementar
      return { error: null }
    },
    signUp: async () => {
      // TODO: Implementar
      return { error: null }
    },
    signOut: async () => {
      // TODO: Implementar
    },
    signInWithGoogle: async () => {
      // TODO: Implementar
    },
    refreshSession: async () => {
      // TODO: Implementar
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
