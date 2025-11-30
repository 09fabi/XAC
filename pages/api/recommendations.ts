import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { Product } from '@/context/CartContext'

interface RecommendationRequest {
  type: 'category' | 'color' | 'similar'
  cartCategories?: string[]
  cartColors?: string[]
  cartItems?: Product[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { type, cartCategories, cartColors, cartItems }: RecommendationRequest = req.body

    // Si Supabase no está configurado, usar lógica simple de recomendación
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const allProducts: Product[] = [
        {
          id: '1',
          name: 'Polera Básica Negra',
          price: 12990,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          description: 'Polera básica de algodón 100%',
          category: 'POLERAS',
          color: 'Negro',
        },
        {
          id: '2',
          name: 'Polerón Oversize Gris',
          price: 34990,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          description: 'Polerón oversize cómodo y cálido',
          category: 'POLERONES',
          color: 'Gris',
        },
        {
          id: '3',
          name: 'Chaqueta Denim Clásica',
          price: 39990,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
          description: 'Chaqueta denim versátil',
          category: 'CHAQUETAS',
          color: 'Azul',
        },
        {
          id: '4',
          name: 'Jeans Clásicos',
          price: 29990,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
          description: 'Jeans de corte clásico',
          category: 'PANTALONES',
          color: 'Azul',
        },
        {
          id: '5',
          name: 'Conjunto Deportivo',
          price: 44990,
          image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
          description: 'Conjunto deportivo completo',
          category: 'CONJUNTOS',
          color: 'Negro',
        },
        {
          id: '6',
          name: 'Polera Estampada',
          price: 15990,
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
          description: 'Polera con estampado exclusivo',
          category: 'POLERAS',
          color: 'Blanco',
        },
        {
          id: '7',
          name: 'Polerón con Capucha',
          price: 37990,
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
          description: 'Polerón con capucha, abrigado',
          category: 'POLERONES',
          color: 'Negro',
        },
        {
          id: '8',
          name: 'Chaqueta Bomber',
          price: 42990,
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
          description: 'Chaqueta bomber moderna',
          category: 'CHAQUETAS',
          color: 'Negro',
        },
        {
          id: '9',
          name: 'Pantalón Cargo',
          price: 32990,
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
          description: 'Pantalón cargo funcional',
          category: 'PANTALONES',
          color: 'Verde',
        },
        {
          id: '10',
          name: 'Conjunto Casual',
          price: 49990,
          image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400',
          description: 'Conjunto casual elegante',
          category: 'CONJUNTOS',
          color: 'Beige',
        },
      ]

      let recommendations: Product[] = []

      if (type === 'category' && cartCategories && cartCategories.length > 0) {
        recommendations = allProducts.filter(
          (p) => p.category && cartCategories.includes(p.category)
        )
      } else if (type === 'color' && cartColors && cartColors.length > 0) {
        recommendations = allProducts.filter(
          (p) => p.color && cartColors.includes(p.color)
        )
      } else if (type === 'similar' && cartItems && cartItems.length > 0) {
        // Productos similares: misma categoría pero diferente producto
        const cartProductIds = cartItems.map((item) => item.id)
        const cartCats = cartItems.map((item) => item.category).filter(Boolean)
        recommendations = allProducts.filter(
          (p) =>
            p.category &&
            cartCats.includes(p.category) &&
            !cartProductIds.includes(p.id)
        )
      } else {
        // Por defecto, productos destacados o primeros productos
        recommendations = allProducts.slice(0, 8)
      }

      return res.status(200).json({ recommendations: recommendations.slice(0, 8) })
    }

    // Implementación con Supabase y lógica de recomendación
    let query = supabase.from('products').select('*').limit(20)

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Error fetching recommendations' })
    }

    const allProducts = (data || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image_url,
      description: p.description,
      category: p.category,
      color: p.color,
      stock: p.stock,
      featured: p.featured || false,
    }))

    let recommendations: Product[] = []

    if (type === 'category' && cartCategories && cartCategories.length > 0) {
      recommendations = allProducts.filter(
        (p) => p.category && cartCategories.includes(p.category)
      )
    } else if (type === 'color' && cartColors && cartColors.length > 0) {
      recommendations = allProducts.filter(
        (p) => p.color && cartColors.includes(p.color)
      )
    } else if (type === 'similar' && cartItems && cartItems.length > 0) {
      const cartProductIds = cartItems.map((item) => item.id)
      const cartCats = cartItems.map((item) => item.category).filter(Boolean)
      recommendations = allProducts.filter(
        (p) =>
          p.category &&
          cartCats.includes(p.category) &&
          !cartProductIds.includes(p.id)
      )
    } else {
      // Si no hay criterios de filtrado, mostrar productos destacados o aleatorios
      // Priorizar productos con featured=true si existe ese campo
      const featuredProducts = allProducts.filter((p: any) => p.featured === true)
      if (featuredProducts.length > 0) {
        recommendations = featuredProducts.slice(0, 8)
      } else {
        recommendations = allProducts.slice(0, 8)
      }
    }

    // Limitar a 8 recomendaciones máximo
    return res.status(200).json({ recommendations: recommendations.slice(0, 8) })
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

