import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  resource_type: string
}

/**
 * Sube una imagen a Cloudinary desde una URL
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  folder: string = 'xulerialcorte/products'
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      transformation: [
        {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto',
          format: 'auto',
        },
      ],
    })

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Sube una imagen a Cloudinary desde un buffer (base64 o file)
 */
export async function uploadImageFromBuffer(
  buffer: Buffer | string,
  folder: string = 'xulerialcorte/products',
  filename?: string
): Promise<UploadResult> {
  try {
    const uploadOptions: any = {
      folder,
      transformation: [
        {
          width: 800,
          height: 800,
          crop: 'limit',
          quality: 'auto',
          format: 'auto',
        },
      ],
    }

    if (filename) {
      uploadOptions.public_id = filename
    }

    // Convertir buffer a data URI si es necesario, o usar directamente
    // TypeScript necesita que sea explícitamente string
    let uploadSource: string
    if (typeof buffer === 'string') {
      uploadSource = buffer
    } else {
      uploadSource = `data:image/jpeg;base64,${buffer.toString('base64')}`
    }
    
    const result = await cloudinary.uploader.upload(uploadSource, uploadOptions)

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Elimina una imagen de Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    throw new Error('Failed to delete image from Cloudinary')
  }
}

/**
 * Genera una URL optimizada de Cloudinary
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string | number
    format?: string
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  
  if (!cloudName) {
    return publicId // Retornar la URL original si no hay configuración
  }

  const { width, height, quality = 'auto', format = 'auto' } = options
  
  let url = `https://res.cloudinary.com/${cloudName}/image/upload`
  
  const transformations: string[] = []
  if (width) transformations.push(`w_${width}`)
  if (height) transformations.push(`h_${height}`)
  transformations.push(`q_${quality}`)
  transformations.push(`f_${format}`)
  
  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`
  }
  
  url += `/${publicId}`
  
  return url
}

export default cloudinary




