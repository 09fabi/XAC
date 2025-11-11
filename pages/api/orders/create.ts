import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

interface CreateOrderRequest {
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    selectedSize?: string
  }>
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
    const { total, items, user_id }: CreateOrderRequest = req.body

    if (!total || !items || items.length === 0) {
      return res.status(400).json({ error: 'Total and items are required' })
    }

    // Si Supabase no está configurado, retornar éxito simulado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return res.status(200).json({
        success: true,
        orderId: `mock_${Date.now()}`,
        message: 'Order created (mock mode)',
      })
    }

    // Crear orden en Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user_id || null,
        total: total,
        status: 'pending',
        items: items,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Error creating order' })
    }

    return res.status(200).json({
      success: true,
      orderId: data.id,
      order: data,
    })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}




