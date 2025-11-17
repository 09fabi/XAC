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
  // Flow puede enviar datos por GET o POST
  const rawData = req.method === 'GET' ? req.query : req.body
  const flowData: FlowConfirmRequest = {
    token: typeof rawData.token === 'string' ? rawData.token : '',
    commerceOrder: typeof rawData.commerceOrder === 'string' ? rawData.commerceOrder : '',
    status: typeof rawData.status === 'string' ? rawData.status : undefined,
    s: typeof rawData.s === 'string' ? rawData.s : undefined,
  }

  try {
    const { token, commerceOrder, status, s } = flowData

    if (!token || !commerceOrder) {
      return res.status(400).json({ error: 'Token and commerceOrder are required' })
    }

    // Si Flow no está configurado, simular confirmación
    if (!process.env.NEXT_PUBLIC_FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
      console.warn('Flow no configurado, confirmación simulada')
      return res.status(200).json({ 
        success: true, 
        message: 'Confirmación simulada' 
      })
    }

    // Verificar firma de seguridad (si Flow la envía)
    if (s) {
      const flowSecretKey = process.env.FLOW_SECRET_KEY
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
        console.error('Firma de seguridad inválida')
        return res.status(400).json({ error: 'Invalid signature' })
      }
    }

    // Consultar estado del pago en Flow
    const flowApiKey = process.env.NEXT_PUBLIC_FLOW_API_KEY
    const flowSecretKey = process.env.FLOW_SECRET_KEY
    
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

    // Consultar estado del pago
    // Según el manual, payment/getStatus es un endpoint GET
    const flowStatusUrl = 'https://www.flow.cl/api/payment/getStatus'
    
    // Construir URL con parámetros para GET
    const queryParams = new URLSearchParams(statusParams).toString()
    const fullUrl = `${flowStatusUrl}?${queryParams}`
    
    const statusResponse = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!statusResponse.ok) {
      throw new Error('Error al consultar estado del pago')
    }

    const statusData = await statusResponse.json()

    // Verificar que el pago fue exitoso
    if (statusData.status === 2) { // 2 = Pagado en Flow
      // Extraer información de la orden desde el commerceOrder
      // El formato es: XAC_timestamp_random
      const orderMatch = commerceOrder.match(/^XAC_(\d+)_/)
      
      // Intentar obtener datos adicionales del optional si están disponibles
      let orderItems: any[] = []
      let userId: string | null = null
      
      if (statusData.optional) {
        try {
          const optionalData = JSON.parse(statusData.optional)
          orderItems = optionalData.items || []
          userId = optionalData.user_id || null
        } catch (e) {
          console.warn('No se pudieron parsear datos opcionales')
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
            console.log('Orden creada exitosamente:', orderData.id)
          }
        } catch (supabaseError) {
          console.error('Error al guardar orden:', supabaseError)
        }
      }

      // Retornar confirmación exitosa
      return res.status(200).json({
        success: true,
        message: 'Pago confirmado exitosamente',
        commerceOrder: commerceOrder,
        status: 'paid',
      })
    } else {
      // Pago no completado
      return res.status(200).json({
        success: false,
        message: 'Pago no completado',
        status: statusData.status,
      })
    }
  } catch (error: any) {
    console.error('Flow confirmation error:', error)
    return res.status(500).json({ 
      error: 'Error processing confirmation',
      message: error.message || 'Error desconocido'
    })
  }
}

