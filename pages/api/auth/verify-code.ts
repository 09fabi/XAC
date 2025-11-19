import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Crear cliente de Supabase para el servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, userId } = req.body

    if (!code || !userId) {
      return res.status(400).json({ error: 'Código y userId son requeridos' })
    }

    // Verificar token de autorización y crear cliente con el token
    const authHeader = req.headers.authorization
    let authenticatedSupabase = supabase
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      // Crear cliente con el token del usuario para que RLS funcione
      authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      
      const { data: { user }, error: authError } = await authenticatedSupabase.auth.getUser()
      
      if (authError || !user || user.id !== userId) {
        return res.status(401).json({ error: 'No autorizado' })
      }
    }

    // Buscar el código en la base de datos
    const { data: verificationCode, error: codeError } = await authenticatedSupabase
      .from('email_verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('used', false)
      .single()

    if (codeError || !verificationCode) {
      return res.status(400).json({ error: 'Código inválido' })
    }

    // Verificar que no esté expirado
    const now = new Date()
    const expiresAt = new Date(verificationCode.expires_at)

    if (now > expiresAt) {
      return res.status(400).json({ error: 'Código expirado. Por favor, solicita uno nuevo.' })
    }

    // Marcar código como usado
    await authenticatedSupabase
      .from('email_verification_codes')
      .update({ used: true })
      .eq('id', verificationCode.id)

    // Marcar email como verificado en el perfil
    const { error: updateError } = await authenticatedSupabase
      .from('user_profiles')
      .update({ email_verified: true })
      .eq('id', userId)

    if (updateError) {
      console.error('Error actualizando perfil:', updateError)
      return res.status(500).json({ error: 'Error al verificar email' })
    }

    res.status(200).json({ 
      success: true,
      message: 'Email verificado correctamente'
    })
  } catch (error: any) {
    console.error('Error en verify-code:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

