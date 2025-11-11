# 📝 Guía: Cómo Configurar .env.local Correctamente

## ⚠️ Problema Común

Si los scripts no encuentran tus variables, probablemente es un problema de **formato** en el archivo `.env.local`.

## ✅ Formato Correcto

Tu archivo `.env.local` debe verse **EXACTAMENTE** así:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

## ❌ Errores Comunes

### 1. Espacios alrededor del signo =
```env
# ❌ MAL
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co

# ✅ BIEN
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```

### 2. Comillas alrededor de los valores
```env
# ❌ MAL
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"

# ✅ BIEN
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```

### 3. Comentarios mal colocados
```env
# ❌ MAL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co # Mi URL de Supabase

# ✅ BIEN (comentario en línea separada)
# Mi URL de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```

### 4. Líneas vacías con espacios
```env
# ❌ MAL (línea con espacios)
    
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co

# ✅ BIEN (línea completamente vacía o sin espacios)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```

## 🔍 Cómo Verificar

1. **Ejecuta el script de verificación:**
   ```bash
   npm run check:env
   ```

2. **Si muestra ❌, verifica:**
   - Abre `.env.local` en un editor de texto simple (Notepad, VS Code)
   - Asegúrate de que cada línea tenga el formato: `VARIABLE=valor`
   - No debe haber espacios antes o después del `=`
   - No debe haber comillas alrededor de los valores
   - Guarda el archivo

3. **Vuelve a ejecutar:**
   ```bash
   npm run check:env
   ```

## 📋 Plantilla Completa

Copia y pega esto en tu `.env.local` (reemplaza con tus valores reales):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key_aqui

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Flow Payment (opcional)
NEXT_PUBLIC_FLOW_API_KEY=tu_flow_key

# Base URL (opcional)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🚨 Importante

- **NO** pongas comillas alrededor de los valores
- **NO** pongas espacios alrededor del signo `=`
- **NO** uses `export` o `export const`
- **SÍ** usa el formato exacto: `VARIABLE=valor`
- **SÍ** guarda el archivo después de editarlo

## ✅ Después de Configurar

Una vez que el formato esté correcto:

```bash
# Verificar que todo esté bien
npm run check:env

# Probar Supabase
npm run test:supabase

# Probar Cloudinary
npm run test:cloudinary
```




