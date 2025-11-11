import type { NextApiRequest, NextApiResponse } from 'next'

interface FlowPaymentRequest {
  amount: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, items }: FlowPaymentRequest = req.body

    if (!amount || !items || items.length === 0) {
      return res.status(400).json({ error: 'Amount and items are required' })
    }

    // Si Flow no está configurado, simular el pago
    if (!process.env.NEXT_PUBLIC_FLOW_API_KEY) {
      // Simulación de pago exitoso
      return res.status(200).json({
        success: true,
        message: 'Pago simulado exitoso. En producción, serías redirigido a Flow.',
        transactionId: `mock_${Date.now()}`,
      })
    }

    // Implementación real con Flow API
    // Flow API endpoint: https://www.flow.cl/api
    const flowApiKey = process.env.NEXT_PUBLIC_FLOW_API_KEY
    const flowApiUrl = 'https://www.flow.cl/api/payment/create'

    const flowRequest = {
      apiKey: flowApiKey,
      commerceOrder: `ORDER_${Date.now()}`,
      subject: `Compra en XuleriaLCorte - ${items.length} producto(s)`,
      amount: amount,
      email: 'cliente@example.com', // En producción, obtener del usuario autenticado
      urlConfirmation: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/flow/confirm`,
      urlReturn: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart?payment=success`,
    }

    // Realizar petición a Flow
    const flowResponse = await fetch(flowApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flowRequest),
    })

    if (!flowResponse.ok) {
      throw new Error('Flow API error')
    }

    const flowData = await flowResponse.json()

    // Retornar URL de redirección a Flow
    return res.status(200).json({
      success: true,
      url: flowData.url,
      token: flowData.token,
    })
  } catch (error) {
    console.error('Flow payment error:', error)
    return res.status(500).json({ error: 'Error processing payment' })
  }
}

