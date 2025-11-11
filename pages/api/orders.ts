import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase, OrderRow } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Si Supabase no está configurado, retornar mock data
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const mockOrders: OrderRow[] = [
        {
          id: '1',
          user_id: 'user_1',
          total: 42980,
          status: 'Completado',
          items: [
            { id: '1', name: 'Polera Básica Negra', quantity: 1, price: 12990 },
            { id: '2', name: 'Jeans Clásicos', quantity: 1, price: 29990 },
          ],
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: 'user_1',
          total: 29990,
          status: 'Completado',
          items: [{ id: '2', name: 'Jeans Clásicos', quantity: 1, price: 29990 }],
          created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        },
      ]

      return res.status(200).json({
        orders: mockOrders.map((o) => ({
          id: o.id,
          date: o.created_at,
          total: o.total,
          items: o.items.length,
          status: o.status,
        })),
      })
    }

    // Obtener usuario autenticado (implementación futura)
    // const user = await getAuthenticatedUser(req)
    // if (!user) {
    //   return res.status(401).json({ error: 'Unauthorized' })
    // }

    // Consulta real a Supabase
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      // .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Error fetching orders' })
    }

    const orders = (data || []).map((o: OrderRow) => ({
      id: o.id,
      date: o.created_at,
      total: o.total,
      items: Array.isArray(o.items) ? o.items.length : 0,
      status: o.status,
    }))

    return res.status(200).json({ orders })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

