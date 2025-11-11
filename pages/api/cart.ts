import type { NextApiRequest, NextApiResponse } from 'next'

// Esta API route puede usarse para guardar el carrito en el servidor
// Por ahora, el carrito se maneja en el cliente con localStorage
// pero esta ruta está preparada para futuras implementaciones

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Obtener carrito del usuario (si está autenticado)
    // Por ahora retornamos vacío ya que usamos localStorage
    return res.status(200).json({ cart: [] })
  }

  if (req.method === 'POST') {
    // Guardar carrito en el servidor
    // Implementación futura con Supabase
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    // Limpiar carrito del servidor
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

