# 🗄️ Configuración de Supabase - XuleriaLCorte

Esta guía te ayudará a configurar Supabase y conectarlo con tu proyecto.

## 📋 Pasos para Configurar Supabase

### 1. Crear las Tablas en Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Navega a **SQL Editor** (en el menú lateral)
3. Haz clic en **New Query**
4. Copia y pega todo el contenido del archivo `supabase-schema.sql`
5. Haz clic en **Run** (o presiona `Ctrl+Enter` / `Cmd+Enter`)

Esto creará:
- ✅ Tabla `products` con productos de ejemplo
- ✅ Tabla `user_profiles` para perfiles de usuario
- ✅ Tabla `orders` para órdenes de compra
- ✅ Políticas de seguridad (RLS)
- ✅ Triggers para actualizar timestamps

### 2. Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

**Dónde encontrar estas credenciales:**
1. Ve a tu proyecto en Supabase
2. Click en **Settings** (⚙️) → **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Probar la Conexión

Ejecuta el script de prueba:

```bash
npm run test:supabase
```

Este script verificará:
- ✅ Que las variables de entorno estén configuradas
- ✅ Que la conexión con Supabase funcione
- ✅ Que las tablas existan
- ✅ Que puedas leer productos

### 4. Verificar que Funciona

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Abre tu navegador en `http://localhost:3000`

3. Ve a la página de **Tienda** (`/store`)

4. Deberías ver los productos cargados desde Supabase

## 🔍 Solución de Problemas

### Error: "relation 'products' does not exist"

**Solución:** Ejecuta el script SQL `supabase-schema.sql` en el SQL Editor de Supabase.

### Error: "Invalid API key"

**Solución:** 
- Verifica que copiaste correctamente la clave `anon public` (no la `service_role`)
- Asegúrate de que no haya espacios extra en `.env.local`
- Reinicia el servidor después de cambiar `.env.local`

### No se muestran productos

**Solución:**
1. Verifica que hay productos en la tabla:
   - Ve a Supabase → **Table Editor** → `products`
   - Deberías ver al menos 6 productos de ejemplo

2. Verifica las políticas RLS:
   - Ve a Supabase → **Authentication** → **Policies**
   - La tabla `products` debe tener una política que permita SELECT a todos

### Error de CORS

Si ves errores de CORS, verifica:
- Que estés usando `NEXT_PUBLIC_SUPABASE_URL` (no la URL interna)
- Que las políticas RLS estén configuradas correctamente

## 📊 Estructura de las Tablas

### `products`
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `price` (INTEGER) - precio en centavos/pesos chilenos
- `image_url` (TEXT)
- `description` (TEXT)
- `category` (VARCHAR)
- `color` (VARCHAR)
- `stock` (INTEGER)
- `featured` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `orders`
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key a auth.users)
- `total` (INTEGER)
- `status` (VARCHAR) - 'pending', 'completed', 'cancelled'
- `items` (JSONB) - array de productos
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🚀 Próximos Pasos

Una vez que todo funcione:

1. **Agregar más productos:**
   - Ve a Supabase → **Table Editor** → `products`
   - Haz clic en **Insert** para agregar nuevos productos

2. **Configurar autenticación (opcional):**
   - Ve a Supabase → **Authentication** → **Providers**
   - Habilita los proveedores que necesites (Email, Google, etc.)

3. **Subir imágenes a Cloudinary:**
   - Actualiza los `image_url` en la tabla `products` con URLs de Cloudinary

## ✅ Checklist de Configuración

- [ ] Script SQL ejecutado en Supabase
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Script de prueba ejecutado exitosamente (`npm run test:supabase`)
- [ ] Productos visibles en la página de tienda
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en la terminal del servidor

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola del navegador (F12)
2. Revisa los logs en la terminal donde corre `npm run dev`
3. Verifica los logs en Supabase → **Logs** → **Postgres Logs`





