import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, userId, email, accessToken } = req.body

    if (!code || !userId || !email) {
      return res.status(400).json({ error: 'Código, userId y email son requeridos' })
    }

    // Crear cliente de Supabase autenticado con el token del usuario
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ error: 'Configuración de Supabase no encontrada' })
    }

    // Crear cliente autenticado
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`
        } : {}
      }
    })

    console.log('Verificando código:', { code, userId, email })

    // Buscar el código de verificación
    const { data: verificationCode, error: codeError } = await supabaseClient
      .from('email_verification_codes')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code)
      .eq('email', email)
      .eq('used', false)
      .single()

    if (codeError) {
      console.error('Error buscando código:', codeError)
      return res.status(400).json({ error: 'Código inválido' })
    }

    if (!verificationCode) {
      console.log('Código no encontrado')
      return res.status(400).json({ error: 'Código inválido' })
    }

    // Verificar que no esté expirado
    const expiresAt = new Date(verificationCode.expires_at)
    const now = new Date()
    if (expiresAt < now) {
      console.log('Código expirado:', { expiresAt, now })
      return res.status(400).json({ error: 'Código expirado' })
    }

    console.log('Código válido encontrado, marcando como usado...')

    // Marcar código como usado
    const { error: markUsedError } = await supabaseClient
      .from('email_verification_codes')
      .update({ used: true })
      .eq('id', verificationCode.id)

    if (markUsedError) {
      console.error('Error marcando código como usado:', markUsedError)
    }

    // Marcar email como verificado en user_profiles
    const { error: updateError } = await supabaseClient
      .from('user_profiles')
      .update({ email_verified: true })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating user profile:', updateError)
      return res.status(500).json({ error: 'Error al actualizar perfil' })
    }

    res.status(200).json({ 
      success: true,
      message: 'Email verificado correctamente'
    })
  } catch (error) {
    console.error('Error in verify-code:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

