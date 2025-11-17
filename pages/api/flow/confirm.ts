import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

interface FlowConfirmRequest {
  token: string
  commerceOrder: string
  status?: string
  s?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CRÍTICO: Flow requiere respuesta HTTP 200 en menos de 15 segundos
  // Respondemos inmediatamente y procesamos de forma asíncrona
  
  // Aceptar todos los métodos HTTP (Flow puede usar GET o POST)
  // Esto es importante para evitar errores 405
  
  // Log para debugging
  console.log('Flow confirm recibido:', {
    method: req.method,
    query: req.query,
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
    },
    timestamp: new Date().toISOString(),
  })
  
  // Flow puede enviar datos por GET o POST
  // También puede enviar datos en el body como form-data o JSON
  let rawData: any = {}
  
  if (req.method === 'GET') {
    rawData = req.query
  } else if (req.method === 'POST') {
    // Intentar parsear como JSON primero
    if (typeof req.body === 'object' && req.body !== null) {
      rawData = req.body
    } else if (typeof req.body === 'string') {
      try {
        rawData = JSON.parse(req.body)
      } catch (e) {
        // Si no es JSON, podría ser form-data
        rawData = req.body
      }
    } else {
      rawData = req.query
    }
  } else {
    // Para cualquier otro método, usar query
    rawData = req.query
  }
  
  const flowData: FlowConfirmRequest = {
    token: typeof rawData.token === 'string' ? rawData.token : '',
    commerceOrder: typeof rawData.commerceOrder === 'string' ? rawData.commerceOrder : '',
    status: typeof rawData.status === 'string' ? rawData.status : undefined,
    s: typeof rawData.s === 'string' ? rawData.s : undefined,
  }

  const { token, commerceOrder, status, s } = flowData

  // Si Flow no está configurado, responder inmediatamente
  if (!process.env.NEXT_PUBLIC_FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
    console.warn('Flow no configurado, confirmación simulada')
    // Responder con texto plano simple para máxima compatibilidad
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).end('OK')
    return
  }

  // Validación básica - pero siempre respondemos 200 a Flow
  if (!token || !commerceOrder) {
    console.error('Flow confirm: Token o commerceOrder faltantes', { 
      token: token || 'missing', 
      commerceOrder: commerceOrder || 'missing',
      rawData: Object.keys(rawData),
    })
    // IMPORTANTE: Flow espera HTTP 200 siempre, incluso con errores
    // Responder con texto plano simple - usar end() para evitar que Next.js agregue JSON
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(200).end('OK')
    return
  }

  // Responder INMEDIATAMENTE a Flow con HTTP 200
  // Esto es crítico para evitar el timeout de 15 segundos
  // Usar texto plano "OK" que es lo que Flow espera según su documentación
  // Usar end() en lugar de send() para asegurar que no se agregue JSON
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.status(200).end('OK')

  // Procesar confirmación de forma asíncrona (después de responder)
  // Esto evita que Flow espere y cause timeout
  processConfirmationAsync(token, commerceOrder, status, s).catch(error => {
    console.error('Error en procesamiento asíncrono de confirmación:', error)
  })
}

// Función asíncrona para procesar la confirmación sin bloquear la respuesta
async function processConfirmationAsync(
  token: string,
  commerceOrder: string,
  status: string | undefined,
  s: string | undefined
) {
  try {

    // Verificar firma de seguridad (si Flow la envía)
    if (s) {
      const flowSecretKey = process.env.FLOW_SECRET_KEY
      if (!flowSecretKey) {
        console.error('FLOW_SECRET_KEY no configurada')
        return
      }

      const paramsToVerify: Record<string, string> = {
        token,
        commerceOrder,
      }
      
      if (status) {
        paramsToVerify.status = status
      }

      // Formato de firma: nombre+valor sin signos, ordenados alfabéticamente
      const sortedKeys = Object.keys(paramsToVerify).sort()
      const paramsString = sortedKeys
        .map(key => `${key}${paramsToVerify[key]}`)
        .join('')
      
      const calculatedSignature = crypto
        .createHmac('sha256', flowSecretKey)
        .update(paramsString)
        .digest('hex')

      if (calculatedSignature !== s) {
        console.error('Firma de seguridad inválida', {
          received: s,
          calculated: calculatedSignature,
        })
        return // No fallar, solo loguear
      }
    }

    // Consultar estado del pago en Flow
    const flowApiKey = process.env.NEXT_PUBLIC_FLOW_API_KEY
    const flowSecretKey = process.env.FLOW_SECRET_KEY
    
    if (!flowApiKey || !flowSecretKey) {
      console.error('Credenciales de Flow no configuradas')
      return
    }

    const statusParams: Record<string, string> = {
      apiKey: flowApiKey,
      token: token,
    }

    // Generar firma para consulta de estado
    // Formato: nombre+valor sin signos, ordenados alfabéticamente
    const sortedStatusKeys = Object.keys(statusParams).sort()
    const statusParamsString = sortedStatusKeys
      .map(key => `${key}${statusParams[key]}`)
      .join('')
    
    const statusSignature = crypto
      .createHmac('sha256', flowSecretKey)
      .update(statusParamsString)
      .digest('hex')

    statusParams.s = statusSignature

    // Consultar estado del pago con timeout
    // Según el manual, payment/getStatus es un endpoint GET
    const flowStatusUrl = 'https://www.flow.cl/api/payment/getStatus'
    
    // Construir URL con parámetros para GET
    const queryParams = new URLSearchParams(statusParams).toString()
    const fullUrl = `${flowStatusUrl}?${queryParams}`
    
    // Usar timeout para evitar que se cuelgue
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

    try {
      const statusResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text()
        console.error('Error al consultar estado del pago en Flow:', {
          status: statusResponse.status,
          error: errorText,
        })
        return
      }

      const statusData = await statusResponse.json()

      // Verificar que el pago fue exitoso
      if (statusData.status === 2) { // 2 = Pagado en Flow
        console.log('Pago confirmado exitosamente:', { token, commerceOrder })
        
        // Intentar obtener datos adicionales del optional si están disponibles
        let orderItems: any[] = []
        let userId: string | null = null
        
        if (statusData.optional) {
          try {
            const optionalData = JSON.parse(statusData.optional)
            orderItems = optionalData.items || []
            userId = optionalData.user_id || null
          } catch (e) {
            console.warn('No se pudieron parsear datos opcionales:', e)
          }
        }

        // Si tenemos items, crear/actualizar la orden en Supabase
        if (orderItems.length > 0 && process.env.NEXT_PUBLIC_SUPABASE_URL) {
          try {
            const total = orderItems.reduce(
              (sum: number, item: any) => sum + (item.price * item.quantity),
              0
            )

            const { data: orderData, error: orderError } = await supabase
              .from('orders')
              .insert({
                user_id: userId,
                total: total,
                status: 'paid',
                items: orderItems,
                flow_token: token,
                flow_commerce_order: commerceOrder,
                payment_method: 'flow',
              })
              .select()
              .single()

            if (orderError) {
              console.error('Error al crear orden en Supabase:', orderError)
              // No fallar si hay error en Supabase, el pago ya fue procesado
            } else {
              console.log('Orden creada exitosamente en Supabase:', orderData.id)
            }
          } catch (supabaseError) {
            console.error('Error al guardar orden en Supabase:', supabaseError)
          }
        } else {
          console.warn('No se pudo crear orden: items vacíos o Supabase no configurado')
        }
      } else {
        console.log('Pago no completado, status:', statusData.status)
      }
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('Timeout al consultar estado del pago en Flow')
      } else {
        console.error('Error al consultar estado del pago:', fetchError)
      }
    }
  } catch (error: any) {
    console.error('Error en processConfirmationAsync:', error)
  }
}

