import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

interface FlowPaymentRequest {
  amount: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  email?: string
  user_id?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, items, email, user_id }: FlowPaymentRequest = req.body

    if (!amount || !items || items.length === 0) {
      return res.status(400).json({ error: 'Amount and items are required' })
    }

    // Si Flow no está configurado, simular el pago
    if (!process.env.NEXT_PUBLIC_FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
      console.warn('Flow no configurado, usando modo simulación')
      return res.status(200).json({
        success: true,
        message: 'Pago simulado exitoso. En producción, serías redirigido a Flow.',
        transactionId: `mock_${Date.now()}`,
        url: null,
      })
    }

    // Configuración de Flow
    const flowApiKey = process.env.NEXT_PUBLIC_FLOW_API_KEY
    const flowSecretKey = process.env.FLOW_SECRET_KEY
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    // Validar que las URLs sean HTTPS en producción
    if (baseUrl.includes('vercel.app') && !baseUrl.startsWith('https://')) {
      console.warn('NEXT_PUBLIC_BASE_URL debería usar HTTPS en producción')
    }
    
    // Generar número de orden único
    const commerceOrder = `XAC_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    
    // Crear descripción de productos
    const subject = `Compra en XuleriaLCorte - ${items.length} producto(s)`
    const itemsDescription = items
      .map(item => `${item.name} x${item.quantity}`)
      .join(', ')

    // Validar y formatear el monto (debe ser entero sin decimales para CLP)
    const amountInt = Math.round(amount)
    if (amountInt < 350) {
      return res.status(400).json({ 
        error: 'El monto mínimo es $350 CLP',
        message: 'El monto mínimo permitido por Flow es $350 CLP'
      })
    }

    // Preparar datos para Flow
    const flowParams: Record<string, string> = {
      apiKey: flowApiKey,
      commerceOrder: commerceOrder,
      subject: subject,
      amount: amountInt.toString(), // Entero sin decimales
      currency: 'CLP', // Moneda: CLP para Chile
      email: email || 'cliente@example.com',
      urlConfirmation: `${baseUrl}/api/flow/confirm`,
      urlReturn: `${baseUrl}/cart?payment=success&order=${commerceOrder}`,
      optional: JSON.stringify({
        user_id: user_id || null,
        items: items,
        itemsDescription: itemsDescription,
      }),
    }

    // Generar firma de seguridad (Flow requiere firma HMAC)
    // IMPORTANTE: La firma se calcula SIN el parámetro "s"
    // Según el manual: concatenar nombre+valor sin signos, ordenados alfabéticamente
    // Ejemplo: "amount5000apiKeyXXXX-XXXX-XXXXcurrencyCLP"
    const sortedKeys = Object.keys(flowParams).sort()
    const paramsString = sortedKeys
      .map(key => `${key}${flowParams[key]}`)
      .join('')
    
    const signature = crypto
      .createHmac('sha256', flowSecretKey)
      .update(paramsString)
      .digest('hex')

    // Agregar la firma como parámetro "s" (NO se incluye en el cálculo de la firma)
    flowParams.s = signature

    // Realizar petición a Flow API
    const flowApiUrl = 'https://www.flow.cl/api/payment/create'
    
    const flowResponse = await fetch(flowApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(flowParams).toString(),
    })

    if (!flowResponse.ok) {
      const errorText = await flowResponse.text()
      console.error('Flow API error:', {
        status: flowResponse.status,
        statusText: flowResponse.statusText,
        error: errorText,
        paramsSent: Object.keys(flowParams),
      })
      
      // Intentar parsear el error si es JSON
      let errorMessage = `Flow API error: ${flowResponse.status}`
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorJson.error || errorMessage
      } catch (e) {
        // Si no es JSON, usar el texto directamente
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    const flowData = await flowResponse.json()

    // Verificar respuesta de Flow
    // Según el manual, la respuesta exitosa contiene url y token
    // La URL de redirección se forma como: url + "?token=" + token
    if (flowData.url && flowData.token) {
      const redirectUrl = `${flowData.url}?token=${flowData.token}`
      
      return res.status(200).json({
        success: true,
        url: redirectUrl, // URL completa lista para redirigir
        token: flowData.token,
        flowOrder: flowData.flowOrder, // Número de orden de Flow
        commerceOrder: commerceOrder,
      })
    } else {
      throw new Error(flowData.message || 'Error al crear pago en Flow')
    }
  } catch (error: any) {
    console.error('Flow payment error:', error)
    return res.status(500).json({ 
      error: 'Error processing payment',
      message: error.message || 'Error desconocido'
    })
  }
}

