# 📦 Guía para Agregar Productos

Tienes **3 opciones** para agregar productos a tu tienda. Te recomiendo usar el **Script** (Opción 1) si tienes varios productos, o **Supabase directamente** (Opción 2) si son pocos.

---

## 🚀 Opción 1: Usar el Script (RECOMENDADO para múltiples productos)

### Paso 1: Editar el script
Abre el archivo `scripts/add-products.js` y edita el array `productos` con tus datos:

```javascript
const productos = [
  {
    name: 'Polera Básica Negra',
    price: 12990,
    image_url: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/products/polera-negra.jpg',
    description: 'Polera básica de algodón 100%, perfecta para el día a día.',
    category: 'POLERAS', // IMPORTANTE: Debe ser una de estas:
                         // POLERONES, POLERAS, PANTALONES, CHAQUETAS, CONJUNTOS
    color: 'Negro',
    stock: 50,
    featured: true, // true = aparece en la página principal
  },
  {
    name: 'Polerón Oversize Gris',
    price: 34990,
    image_url: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/products/poleron-gris.jpg',
    description: 'Polerón oversize cómodo y cálido.',
    category: 'POLERONES',
    color: 'Gris',
    stock: 30,
    featured: true,
  },
  // Agrega más productos aquí...
]
```

### Paso 2: Ejecutar el script
```bash
npm run add:products
```

O directamente:
```bash
node scripts/add-products.js
```

### ✅ Ventajas:
- ✅ Agregas múltiples productos de una vez
- ✅ Validación automática de categorías
- ✅ Fácil de editar y reutilizar
- ✅ Ver errores claramente

---

## 🎯 Opción 2: Directamente en Supabase (Rápido para pocos productos)

### Paso 1: Ir a Supabase
1. Ve a tu [Dashboard de Supabase](https://app.supabase.com)
2. Selecciona tu proyecto
3. Ve a **Table Editor** en el menú lateral
4. Haz clic en la tabla `products`

### Paso 2: Agregar producto
1. Haz clic en el botón **Insert** → **Insert row**
2. Completa los campos:

| Campo | Tipo | Ejemplo | Requerido |
|-------|------|---------|-----------|
| `name` | Texto | "Polera Básica Negra" | ✅ Sí |
| `price` | Número | 12990 | ✅ Sí |
| `image_url` | Texto | URL de Cloudinary | ❌ No |
| `description` | Texto | "Polera básica..." | ❌ No |
| `category` | Texto | **POLERAS** | ❌ No |
| `color` | Texto | "Negro" | ❌ No |
| `stock` | Número | 50 | ❌ No (default: 0) |
| `featured` | Checkbox | ☑️ | ❌ No (default: false) |

### ⚠️ IMPORTANTE - Categorías válidas:
Debes usar **EXACTAMENTE** una de estas (en MAYÚSCULAS):
- `POLERONES`
- `POLERAS`
- `PANTALONES`
- `CHAQUETAS`
- `CONJUNTOS`

### Paso 3: Guardar
Haz clic en **Save** o presiona `Ctrl + Enter`

### ✅ Ventajas:
- ✅ Interfaz visual
- ✅ Ver todos los productos existentes
- ✅ Editar productos fácilmente

---

## 🔧 Opción 3: Usar la API (Para integraciones)

Si quieres agregar productos desde otra aplicación o script personalizado:

### Endpoint:
```
POST /api/products/create
```

### Headers:
```json
{
  "Content-Type": "application/json"
}
```

### Body:
```json
{
  "name": "Polera Básica Negra",
  "price": 12990,
  "image_url": "https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/products/polera-negra.jpg",
  "description": "Polera básica de algodón 100%",
  "category": "POLERAS",
  "color": "Negro",
  "stock": 50,
  "featured": true
}
```

### Ejemplo con cURL:
```bash
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Polera Básica Negra",
    "price": 12990,
    "image_url": "https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/products/polera-negra.jpg",
    "description": "Polera básica de algodón 100%",
    "category": "POLERAS",
    "color": "Negro",
    "stock": 50,
    "featured": true
  }'
```

---

## 📝 Formato de URLs de Cloudinary

Si ya tienes las imágenes en Cloudinary, usa el formato completo:

```
https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/products/nombre-imagen.jpg
```

O el formato optimizado:
```
https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/w_800,h_800,c_fill/products/nombre-imagen.jpg
```

### Obtener URLs de Cloudinary:
1. Ve a tu [Dashboard de Cloudinary](https://cloudinary.com/console)
2. Ve a **Media Library**
3. Haz clic en la imagen
4. Copia la **URL** o **Secure URL**

---

## ✅ Checklist antes de agregar productos

- [ ] Tienes las URLs de las imágenes en Cloudinary
- [ ] Sabes la categoría correcta (POLERONES, POLERAS, PANTALONES, CHAQUETAS, o CONJUNTOS)
- [ ] Tienes el precio en pesos chilenos (número entero, sin puntos ni comas)
- [ ] Tienes la descripción del producto
- [ ] Sabes el stock disponible
- [ ] Decidiste si el producto será "featured" (aparece en la página principal)

---

## 🐛 Solución de Problemas

### Error: "Variables de entorno no configuradas"
**Solución:** Asegúrate de tener `.env.local` con:
```
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

### Error: "Categoría inválida"
**Solución:** Usa exactamente una de estas (en MAYÚSCULAS):
- POLERONES
- POLERAS
- PANTALONES
- CHAQUETAS
- CONJUNTOS

### Error: "Row Level Security policy violation"
**Solución:** 
1. Ve a Supabase → **Authentication** → **Policies**
2. Asegúrate de que la tabla `products` tenga una política que permita INSERT

### Las imágenes no se ven
**Solución:**
1. Verifica que la URL de Cloudinary sea correcta
2. Asegúrate de que la imagen sea pública en Cloudinary
3. Prueba la URL directamente en el navegador

---

## 📚 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Dashboard de Supabase](https://app.supabase.com)
- [Dashboard de Cloudinary](https://cloudinary.com/console)
- [Guía de Supabase del proyecto](./SETUP_SUPABASE.md)
- [Guía de Cloudinary del proyecto](./SETUP_CLOUDINARY.md)

---

## 💡 Tips

1. **Para agregar muchos productos:** Usa el script (Opción 1)
2. **Para agregar pocos productos:** Usa Supabase directamente (Opción 2)
3. **Para automatizar:** Usa la API (Opción 3)
4. **Para productos destacados:** Marca `featured: true` - aparecerán en la página principal
5. **Para organizar:** Usa las categorías correctamente para que los filtros funcionen bien


