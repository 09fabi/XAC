import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Esta API route maneja el retorno de Flow después del pago
 * Flow redirige con POST, así que necesitamos una API route para recibirlo
 * y luego redirigir al usuario a la página del carrito con los parámetros correctos
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Flow puede enviar datos por GET o POST en la URL de retorno
  // Según la documentación, Flow redirige con POST
  if (req.method === 'POST' || req.method === 'GET') {
    const token = typeof req.body?.token === 'string' 
      ? req.body.token 
      : typeof req.query?.token === 'string' 
        ? req.query.token 
        : null
    
    const commerceOrder = typeof req.body?.commerceOrder === 'string'
      ? req.body.commerceOrder
      : typeof req.query?.commerceOrder === 'string'
        ? req.query.commerceOrder
        : null

    const status = typeof req.body?.status === 'string'
      ? req.body.status
      : typeof req.query?.status === 'string'
        ? req.query.status
        : null

    // Construir URL de redirección con los parámetros
    const redirectUrl = new URL('/cart', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    
    if (status === '2' || status === '3') {
      // Status 2 = Pagado, Status 3 = Anulado
      redirectUrl.searchParams.set('payment', status === '2' ? 'success' : 'error')
    } else {
      redirectUrl.searchParams.set('payment', 'success')
    }
    
    if (commerceOrder) {
      redirectUrl.searchParams.set('order', commerceOrder)
    }

    // Redirigir al usuario a la página del carrito
    // Usamos 302 (temporary redirect) para que el navegador haga GET
    return res.redirect(302, redirectUrl.toString())
  }

  // Si no es POST ni GET, retornar error
  return res.status(405).json({ error: 'Method not allowed' })
}

