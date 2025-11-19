import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

// Generar código de 6 dígitos
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, userId, accessToken } = req.body

    if (!email || !userId) {
      return res.status(400).json({ error: 'Email y userId son requeridos' })
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

    // Verificar que el usuario existe en user_profiles, si no existe, crearlo
    let { data: profile, error: profileError } = await supabaseClient
      .from('user_profiles')
      .select('id, email')
      .eq('id', userId)
      .single()

    // Si no existe el perfil, crearlo
    if (profileError && profileError.code === 'PGRST116') {
      console.log('Perfil no existe, creando perfil para usuario:', userId)
      
      const { data: newProfile, error: insertError } = await supabaseClient
        .from('user_profiles')
        .insert({
          id: userId,
          email: email,
          name: 'Usuario',
          email_verified: false,
        })
        .select('id, email')
        .single()

      if (insertError) {
        console.error('Error creating profile:', insertError)
        // Si falla por RLS, el trigger debería haberlo creado, intentar leer de nuevo
        await new Promise(resolve => setTimeout(resolve, 1000))
        const { data: retryProfile } = await supabaseClient
          .from('user_profiles')
          .select('id, email')
          .eq('id', userId)
          .single()
        
        if (retryProfile) {
          profile = retryProfile
        } else {
          return res.status(500).json({ 
            error: 'Error al crear perfil. Por favor, recarga la página e intenta de nuevo.' 
          })
        }
      } else {
        profile = newProfile
      }
    } else if (profileError) {
      console.error('Error checking profile:', profileError)
      return res.status(500).json({ error: 'Error al verificar usuario' })
    }

    // Verificar que el email coincide
    if (profile && profile.email !== email) {
      // Actualizar el email si es diferente
      const { error: updateError } = await supabaseClient
        .from('user_profiles')
        .update({ email: email })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating email:', updateError)
      }
    }

    // Generar código
    const code = generateVerificationCode()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15) // Expira en 15 minutos

    // Eliminar códigos anteriores no usados del mismo usuario
    await supabaseClient
      .from('email_verification_codes')
      .delete()
      .eq('user_id', userId)
      .eq('used', false)

    // Insertar nuevo código
    const { error: insertError } = await supabaseClient
      .from('email_verification_codes')
      .insert({
        user_id: userId,
        email: email,
        code: code,
        expires_at: expiresAt.toISOString(),
        used: false,
      })

    if (insertError) {
      console.error('Error inserting verification code:', insertError)
      return res.status(500).json({ error: 'Error al generar código de verificación' })
    }

    // Enviar email con el código
    const resendApiKey = process.env.RESEND_API_KEY
    
    if (resendApiKey) {
      // Intentar enviar email con Resend
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(resendApiKey)
        
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: email,
          subject: 'Código de verificación - XuleriaLCorte',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
                Código de Verificación
              </h2>
              <p style="color: #666; font-size: 16px;">Hola,</p>
              <p style="color: #666; font-size: 16px;">
                Tu código de verificación para XuleriaLCorte es:
              </p>
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          padding: 30px; 
                          text-align: center; 
                          border-radius: 10px; 
                          margin: 30px 0;">
                <div style="font-size: 42px; 
                            font-weight: bold; 
                            letter-spacing: 8px; 
                            color: white; 
                            font-family: 'Courier New', monospace;">
                  ${code}
                </div>
              </div>
              <p style="color: #666; font-size: 14px;">
                ⏰ Este código expira en <strong>15 minutos</strong>.
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                Si no solicitaste este código, puedes ignorar este email de forma segura.
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 10px;">
                © XuleriaLCorte
              </p>
            </div>
          `,
        })
        
        console.log('✅ Email enviado correctamente a:', email)
      } catch (emailError: any) {
        console.error('❌ Error enviando email con Resend:', emailError)
        // Fallback: mostrar en consola si falla el envío
        console.log('='.repeat(50))
        console.log(`📧 CÓDIGO DE VERIFICACIÓN (FALLBACK - Email falló)`)
        console.log(`Email: ${email}`)
        console.log(`Código: ${code}`)
        console.log(`Expira en: 15 minutos`)
        console.log('='.repeat(50))
      }
    } else {
      // Si no hay API Key de Resend, mostrar en consola (desarrollo)
      console.log('='.repeat(50))
      console.log(`📧 CÓDIGO DE VERIFICACIÓN`)
      console.log(`Email: ${email}`)
      console.log(`Código: ${code}`)
      console.log(`Expira en: 15 minutos`)
      console.log(`⚠️ RESEND_API_KEY no configurada - Email no enviado`)
      console.log('='.repeat(50))
    }

    res.status(200).json({ 
      success: true,
      message: 'Código de verificación enviado',
      // En desarrollo, devolvemos el código. En producción, elimina esto.
      code: process.env.NODE_ENV === 'development' ? code : undefined
    })
  } catch (error) {
    console.error('Error in send-verification-code:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

