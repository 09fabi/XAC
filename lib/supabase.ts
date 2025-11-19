import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Supabase credentials not found. Auth features may not work.')
    console.warn('Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}

// Crear cliente incluso si las credenciales están vacías (para evitar errores)
// En producción, usar localStorage para persistir sesiones
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: typeof window !== 'undefined',
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'supabase.auth.token',
      flowType: 'pkce'
    }
  }
)

// Tipos para las tablas de Supabase
export interface ProductRow {
  id: string
  name: string
  price: number
  image_url: string
  description?: string
  category?: string
  color?: string
  stock?: number
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface UserRow {
  id: string
  email: string
  name?: string
  created_at?: string
}

export interface OrderRow {
  id: string
  user_id: string
  total: number
  status: string
  items: any[]
  created_at?: string
}

