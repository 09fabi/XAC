import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { uploadImageFromUrl } from '@/lib/cloudinary'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, price, image_url, description, category, color, stock, featured } = req.body

    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' })
    }

    // Si Supabase no está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return res.status(500).json({ error: 'Supabase no está configurado' })
    }

    let finalImageUrl = image_url

    // Si hay una imagen URL y Cloudinary está configurado, subirla a Cloudinary
    if (image_url && process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const cloudinaryResult = await uploadImageFromUrl(image_url, 'xulerialcorte/products')
        finalImageUrl = cloudinaryResult.secure_url
      } catch (error) {
        console.error('Error uploading to Cloudinary, using original URL:', error)
        // Continuar con la URL original si falla Cloudinary
      }
    }

    // Crear producto en Supabase
    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        price: parseInt(price),
        image_url: finalImageUrl,
        description: description || null,
        category: category || null,
        color: color || null,
        stock: stock ? parseInt(stock) : 0,
        featured: featured || false,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Error creating product' })
    }

    return res.status(200).json({
      success: true,
      product: {
        id: data.id,
        name: data.name,
        price: data.price,
        image: data.image_url,
        description: data.description,
        category: data.category,
        color: data.color,
        stock: data.stock,
        featured: data.featured,
      },
    })
  } catch (error: any) {
    console.error('API error:', error)
    return res.status(500).json({ error: error.message || 'Internal server error' })
  }
}





