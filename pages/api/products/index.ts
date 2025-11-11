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
    const { featured, limit, category } = req.query

    // Si Supabase no está configurado, retornar mock data
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('⚠️ Supabase no está configurado. Variables de entorno faltantes:')
      console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌')
      console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌')
      console.error('⚠️ Usando datos mock. Configura las variables de entorno en Vercel.')
      const mockProducts: ProductRow[] = [
        {
          id: '1',
          name: 'Polera Básica Negra',
          price: 12990,
          image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          description: 'Polera básica de algodón 100%, perfecta para el día a día',
          category: 'POLERAS',
          color: 'Negro',
          stock: 50,
          featured: true,
        },
        {
          id: '2',
          name: 'Polerón Oversize Gris',
          price: 34990,
          image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          description: 'Polerón oversize cómodo y cálido, perfecto para el invierno',
          category: 'POLERONES',
          color: 'Gris',
          stock: 30,
          featured: true,
        },
        {
          id: '3',
          name: 'Chaqueta Denim Clásica',
          price: 39990,
          image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
          description: 'Chaqueta denim versátil para cualquier ocasión',
          category: 'CHAQUETAS',
          color: 'Azul',
          stock: 25,
          featured: true,
        },
        {
          id: '4',
          name: 'Jeans Clásicos',
          price: 29990,
          image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
          description: 'Jeans de corte clásico, cómodos y duraderos',
          category: 'PANTALONES',
          color: 'Azul',
          stock: 40,
          featured: true,
        },
        {
          id: '5',
          name: 'Conjunto Deportivo',
          price: 44990,
          image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
          description: 'Conjunto deportivo completo, cómodo y funcional',
          category: 'CONJUNTOS',
          color: 'Negro',
          stock: 20,
          featured: false,
        },
        {
          id: '6',
          name: 'Polera Estampada',
          price: 15990,
          image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
          description: 'Polera con estampado exclusivo, diseño único',
          category: 'POLERAS',
          color: 'Blanco',
          stock: 35,
          featured: false,
        },
        {
          id: '7',
          name: 'Polerón con Capucha',
          price: 37990,
          image_url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
          description: 'Polerón con capucha, abrigado y con estilo',
          category: 'POLERONES',
          color: 'Negro',
          stock: 28,
          featured: false,
        },
        {
          id: '8',
          name: 'Chaqueta Bomber',
          price: 42990,
          image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
          description: 'Chaqueta bomber moderna, perfecta para el día a día',
          category: 'CHAQUETAS',
          color: 'Negro',
          stock: 22,
          featured: false,
        },
        {
          id: '9',
          name: 'Pantalón Cargo',
          price: 32990,
          image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
          description: 'Pantalón cargo funcional con múltiples bolsillos',
          category: 'PANTALONES',
          color: 'Verde',
          stock: 30,
          featured: false,
        },
        {
          id: '10',
          name: 'Conjunto Casual',
          price: 49990,
          image_url: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400',
          description: 'Conjunto casual elegante, perfecto para cualquier ocasión',
          category: 'CONJUNTOS',
          color: 'Beige',
          stock: 15,
          featured: false,
        },
      ]

      let filtered = mockProducts
      if (featured === 'true') {
        filtered = filtered.filter((p) => p.featured)
      }
      if (category) {
        filtered = filtered.filter((p) => p.category === category)
      }
      if (limit) {
        filtered = filtered.slice(0, parseInt(limit as string))
      }

      return res.status(200).json({
        products: filtered.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image_url,
          description: p.description,
          category: p.category,
          color: p.color,
          stock: p.stock,
        })),
      })
    }

    // Consulta real a Supabase
    let query = supabase.from('products').select('*')

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (limit) {
      query = query.limit(parseInt(limit as string))
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Error fetching products' })
    }

    const products = (data || []).map((p: ProductRow) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image_url,
      description: p.description,
      category: p.category,
      color: p.color,
      stock: p.stock,
    }))

    return res.status(200).json({ products })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

