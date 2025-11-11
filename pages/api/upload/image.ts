import type { NextApiRequest, NextApiResponse } from 'next'
import { uploadImageFromUrl, uploadImageFromBuffer } from '@/lib/cloudinary'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verificar que Cloudinary esté configurado
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({ 
        error: 'Cloudinary no está configurado. Verifica las variables de entorno.' 
      })
    }

    const { imageUrl, imageBase64, folder, filename } = req.body

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({ error: 'imageUrl o imageBase64 es requerido' })
    }

    let result

    if (imageUrl) {
      // Subir desde URL
      result = await uploadImageFromUrl(imageUrl, folder)
    } else if (imageBase64) {
      // Subir desde base64
      // Remover el prefijo data:image/...;base64, si existe
      const base64Data = imageBase64.includes(',') 
        ? imageBase64.split(',')[1] 
        : imageBase64
      
      result = await uploadImageFromBuffer(
        Buffer.from(base64Data, 'base64'),
        folder,
        filename
      )
    } else {
      return res.status(400).json({ error: 'imageUrl o imageBase64 es requerido' })
    }

    if (!result) {
      return res.status(500).json({ error: 'Error al subir la imagen' })
    }

    return res.status(200).json({
      success: true,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    })
  } catch (error: any) {
    console.error('Error uploading image:', error)
    return res.status(500).json({ 
      error: error.message || 'Error al subir la imagen' 
    })
  }
}




