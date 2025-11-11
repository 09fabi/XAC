# ☁️ Configuración de Cloudinary - XuleriaLCorte

Esta guía te ayudará a configurar Cloudinary para subir y gestionar imágenes de productos.

## 📋 Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env.local`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**Dónde encontrar estas credenciales:**
1. Ve a tu [Dashboard de Cloudinary](https://cloudinary.com/console)
2. En la página principal verás:
   - **Cloud name** → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET` (haz clic en "Reveal" para verla)

## 🚀 Funcionalidades Implementadas

### 1. Subir Imágenes desde URL
```typescript
POST /api/upload/image
Body: {
  "imageUrl": "https://ejemplo.com/imagen.jpg",
  "folder": "xulerialcorte/products" // opcional
}
```

### 2. Subir Imágenes desde Base64
```typescript
POST /api/upload/image
Body: {
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQ...",
  "folder": "xulerialcorte/products", // opcional
  "filename": "producto-1" // opcional
}
```

### 3. Crear Producto con Imagen Automática
```typescript
POST /api/products/create
Body: {
  "name": "Polera Negra",
  "price": 12990,
  "image_url": "https://ejemplo.com/imagen.jpg",
  "description": "Descripción del producto",
  "category": "Poleras",
  "color": "Negro",
  "stock": 50,
  "featured": true
}
```

Si proporcionas una `image_url`, automáticamente se subirá a Cloudinary y se guardará la URL optimizada.

## 📝 Ejemplo de Uso

### Desde el Frontend (React)

```typescript
// Subir imagen desde URL
const uploadImage = async (imageUrl: string) => {
  const response = await fetch('/api/upload/image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageUrl,
      folder: 'xulerialcorte/products',
    }),
  })
  
  const data = await response.json()
  return data.image.url // URL de Cloudinary
}

// Subir imagen desde archivo
const uploadImageFromFile = async (file: File) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  
  reader.onload = async () => {
    const base64 = reader.result as string
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: base64,
        folder: 'xulerialcorte/products',
        filename: file.name.replace(/\.[^/.]+$/, ''),
      }),
    })
    
    const data = await response.json()
    return data.image.url
  }
}
```

## 🎨 Optimizaciones Automáticas

Las imágenes subidas a Cloudinary se optimizan automáticamente:
- **Tamaño máximo:** 800x800px (mantiene proporción)
- **Calidad:** Auto (optimización automática)
- **Formato:** Auto (WebP cuando es posible)
- **Carpeta:** `xulerialcorte/products` (organización)

## 🔧 Funciones Disponibles

### `uploadImageFromUrl(imageUrl, folder?)`
Sube una imagen desde una URL externa.

### `uploadImageFromBuffer(buffer, folder?, filename?)`
Sube una imagen desde un buffer (base64 o archivo).

### `deleteImage(publicId)`
Elimina una imagen de Cloudinary.

### `getOptimizedImageUrl(publicId, options?)`
Genera una URL optimizada con transformaciones:
```typescript
getOptimizedImageUrl('xulerialcorte/products/producto-1', {
  width: 400,
  height: 400,
  quality: 'auto',
  format: 'auto'
})
```

## 📊 Estructura de Carpetas en Cloudinary

```
xulerialcorte/
  └── products/
      ├── producto-1.jpg
      ├── producto-2.jpg
      └── ...
```

## ✅ Verificar Configuración

1. **Verifica las variables de entorno:**
   ```bash
   # En .env.local deberías tener:
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```

2. **Prueba la subida de imagen:**
   ```bash
   curl -X POST http://localhost:3000/api/upload/image \
     -H "Content-Type: application/json" \
     -d '{"imageUrl": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"}'
   ```

3. **Verifica en Cloudinary:**
   - Ve a tu Dashboard de Cloudinary
   - Click en **Media Library**
   - Deberías ver la carpeta `xulerialcorte/products` con las imágenes subidas

## 🔍 Solución de Problemas

### Error: "Cloudinary no está configurado"

**Solución:**
- Verifica que todas las variables de entorno estén en `.env.local`
- Reinicia el servidor después de agregar las variables
- Asegúrate de usar `CLOUDINARY_API_KEY` y `CLOUDINARY_API_SECRET` (no `NEXT_PUBLIC_`)

### Error: "Invalid API key"

**Solución:**
- Verifica que copiaste correctamente las credenciales desde el Dashboard
- Asegúrate de no tener espacios extra en `.env.local`
- La API Secret debe estar visible (click en "Reveal" en Cloudinary)

### Las imágenes no se optimizan

**Solución:**
- Verifica que `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` esté configurado
- Las optimizaciones se aplican automáticamente al subir
- Puedes usar `getOptimizedImageUrl()` para generar URLs con transformaciones

## 🚀 Próximos Pasos

1. **Subir imágenes de productos existentes:**
   - Usa el endpoint `/api/upload/image` para subir imágenes
   - Actualiza los `image_url` en Supabase con las URLs de Cloudinary

2. **Crear productos con imágenes:**
   - Usa `/api/products/create` con `image_url`
   - La imagen se subirá automáticamente a Cloudinary

3. **Optimizar imágenes existentes:**
   - Usa `getOptimizedImageUrl()` para generar URLs optimizadas
   - Actualiza las URLs en Supabase

## 📞 Recursos

- [Documentación de Cloudinary](https://cloudinary.com/documentation)
- [Transformaciones de Imagen](https://cloudinary.com/documentation/image_transformations)
- [Dashboard de Cloudinary](https://cloudinary.com/console)




