import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase, ProductRow } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    // Si Supabase no está configurado, retornar mock data
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const mockProducts: { [key: string]: ProductRow } = {
        '1': {
          id: '1',
          name: 'Polera Básica Negra',
          price: 12990,
          image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          description: 'Polera básica de algodón 100%, perfecta para el día a día. Cómoda, suave y duradera.',
          category: 'POLERAS',
          color: 'Negro',
          stock: 50,
        },
        '2': {
          id: '2',
          name: 'Polerón Oversize Gris',
          price: 34990,
          image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
          description: 'Polerón oversize cómodo y cálido, perfecto para el invierno. Diseño moderno y versátil.',
          category: 'POLERONES',
          color: 'Gris',
          stock: 30,
        },
        '3': {
          id: '3',
          name: 'Chaqueta Denim Clásica',
          price: 39990,
          image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
          description: 'Chaqueta denim versátil para cualquier ocasión. Diseño atemporal y resistente.',
          category: 'CHAQUETAS',
          color: 'Azul',
          stock: 25,
        },
        '4': {
          id: '4',
          name: 'Jeans Clásicos',
          price: 29990,
          image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
          description: 'Jeans de corte clásico, cómodos y duraderos. Hechos con denim de alta calidad.',
          category: 'PANTALONES',
          color: 'Azul',
          stock: 40,
        },
        '5': {
          id: '5',
          name: 'Conjunto Deportivo',
          price: 44990,
          image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
          description: 'Conjunto deportivo completo, cómodo y funcional. Perfecto para entrenar o uso casual.',
          category: 'CONJUNTOS',
          color: 'Negro',
          stock: 20,
        },
      }

      const product = mockProducts[id]
      if (!product) {
        return res.status(404).json({ error: 'Product not found' })
      }

      return res.status(200).json({
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image_url,
          description: product.description,
          category: product.category,
          color: product.color,
          stock: product.stock,
        },
      })
    }

    // Consulta real a Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const product: ProductRow = data

    return res.status(200).json({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url,
        description: product.description,
        category: product.category,
        color: product.color,
        stock: product.stock,
      },
    })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

