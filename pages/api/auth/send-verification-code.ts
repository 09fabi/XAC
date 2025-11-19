import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    const { email, userId } = req.body

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email y userId son requeridos' })
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

    // Verificar que el usuario existe (usando RPC o consulta directa)
    const { data: profile, error: profileError } = await authenticatedSupabase
      .from('user_profiles')
      .select('id, email')
      .eq('id', userId)
      .single()
    
    if (profileError || !profile) {
      // Si no existe perfil, intentar crearlo
      const { error: createError } = await authenticatedSupabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: email,
          email_verified: false,
        })
      
      if (createError) {
        console.error('Error creando perfil:', createError)
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
    }

    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15) // Expira en 15 minutos

    // Invalidar códigos anteriores del usuario
    await authenticatedSupabase
      .from('email_verification_codes')
      .update({ used: true })
      .eq('user_id', userId)
      .eq('used', false)

    // Insertar nuevo código
    const { error: insertError } = await authenticatedSupabase
      .from('email_verification_codes')
      .insert({
        user_id: userId,
        email: email,
        code: code,
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (insertError) {
      console.error('Error insertando código:', insertError)
      return res.status(500).json({ error: 'Error al generar código' })
    }

    // Enviar email
    const isDevelopment = process.env.NODE_ENV === 'development'
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    if (isDevelopment) {
      // En desarrollo, mostrar en consola
      console.log('==================================================')
      console.log('📧 CÓDIGO DE VERIFICACIÓN')
      console.log('Email:', email)
      console.log('Código:', code)
      console.log('Expira en: 15 minutos')
      console.log('==================================================')
    }

    try {
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Código de verificación - XAC',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
              Código de Verificación
            </h2>
            <p style="color: #333; font-size: 16px;">
              Tu código de verificación es:
            </p>
            <div style="background-color: #f5f5f5; border: 2px solid #000; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #000; font-size: 32px; letter-spacing: 5px; margin: 0;">
                ${code}
              </h1>
            </div>
            <p style="color: #666; font-size: 14px;">
              Este código expira en <strong>15 minutos</strong>.
            </p>
            <p style="color: #666; font-size: 14px;">
              Si no solicitaste este código, ignora este email.
            </p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Error enviando email:', emailError)
      // En desarrollo, aún retornamos éxito aunque falle el email
      if (isDevelopment) {
        return res.status(200).json({ 
          success: true, 
          code: code, // Devolver código en desarrollo
          message: 'Código generado (mostrado en consola)' 
        })
      }
      return res.status(500).json({ error: 'Error al enviar email' })
    }

    res.status(200).json({ 
      success: true,
      message: isDevelopment ? `Código enviado (ver consola): ${code}` : 'Código enviado a tu email'
    })
  } catch (error: any) {
    console.error('Error en send-verification-code:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

