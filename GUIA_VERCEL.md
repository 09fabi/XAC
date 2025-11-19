# Guía de Despliegue en Vercel

## ✅ Problemas Corregidos

1. **Error de ESLint con `<a>` tags**: Ya corregido en `pages/recommendations.tsx`
2. **Error de tipos en Cloudinary**: Ya corregido en `lib/cloudinary.ts`

## ⚠️ Problemas Potenciales Identificados

### 1. Variable de Entorno `NEXT_PUBLIC_BASE_URL`
El archivo `pages/api/flow/create-payment.ts` usa `NEXT_PUBLIC_BASE_URL` pero no está en `next.config.js`. Necesitas agregarla o Vercel la detectará automáticamente.

**Solución**: Agregar la variable en Vercel (ver pasos más abajo).

### 2. Configuración de Imágenes
La configuración de Next.js Image está correcta, pero asegúrate de que todas las URLs de imágenes externas estén en `remotePatterns` o `domains`.

## 📋 Pasos para Desplegar en Vercel

### Paso 1: Preparar el Repositorio

1. **Asegúrate de que todos los cambios estén commiteados**:
```bash
git add .
git commit -m "Fix: Corregir errores de build para Vercel"
git push origin main
```

### Paso 2: Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub)
2. Haz clic en **"Add New Project"** o **"New Project"**
3. Selecciona tu repositorio `xulerialcorte` de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js

### Paso 3: Configurar Variables de Entorno

⚠️ **IMPORTANTE**: Si ves productos mock (como "Polera Básica Negra", "Polerón Oversize Gris", etc.) en lugar de tus productos reales de Supabase, significa que las variables de entorno de Supabase NO están configuradas correctamente.

En la sección **"Environment Variables"** de Vercel, agrega las siguientes variables:

#### Variables Públicas (NEXT_PUBLIC_*) - OBLIGATORIAS
Estas son accesibles en el cliente y **SON NECESARIAS** para que funcione Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

**Cómo obtener estas variables:**
1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** → **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Variables Públicas Adicionales (Opcionales)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_de_cloudinary
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_FLOW_API_KEY=tu_api_key_de_flow
NEXT_PUBLIC_BASE_URL=https://tu-proyecto.vercel.app
```

#### Variables Privadas (Solo servidor)
Estas solo están disponibles en el servidor (API routes):

```
CLOUDINARY_CLOUD_NAME=tu_cloud_name_de_cloudinary
CLOUDINARY_API_KEY=tu_api_key_de_cloudinary
CLOUDINARY_API_SECRET=tu_api_secret_de_cloudinary
CLERK_SECRET_KEY=sk_live_xxxxx
FLOW_SECRET_KEY=tu_secret_key_de_flow
```

**⚠️ IMPORTANTE para Flow:**
- `NEXT_PUBLIC_FLOW_API_KEY`: Tu API Key de Flow (pública)
- `FLOW_SECRET_KEY`: Tu Secret Key de Flow (privada, solo servidor)
- `NEXT_PUBLIC_BASE_URL`: Debe ser la URL de tu proyecto en Vercel (ej: `https://xulerialcorte.vercel.app`)

**Nota**: 
- `NEXT_PUBLIC_BASE_URL` debe ser la URL de tu proyecto en Vercel (ej: `https://xulerialcorte.vercel.app`)
- Puedes obtener esta URL después del primer despliegue, o usar un dominio personalizado si lo configuras

**⚠️ IMPORTANTE**: Después de agregar las variables de entorno:
1. **DEBES hacer un nuevo despliegue** para que las variables surtan efecto
2. Ve a **Deployments** → Selecciona el último deployment → **Redeploy**
3. O haz un nuevo commit y push para activar un nuevo despliegue

### Paso 4: Configuración del Proyecto

Vercel debería detectar automáticamente:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (o `next build`)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install`

Si necesitas configurar manualmente:
- **Root Directory**: `./` (raíz del proyecto)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### Paso 5: Desplegar

1. Haz clic en **"Deploy"**
2. Espera a que termine el build (puede tomar 2-5 minutos)
3. Si hay errores, revisa los logs en la consola de Vercel

### Paso 6: Verificar el Despliegue

1. Una vez completado, Vercel te dará una URL (ej: `https://xulerialcorte.vercel.app`)
2. Visita la URL y verifica que todo funcione correctamente
3. Revisa la consola del navegador para errores

### Paso 7: Actualizar NEXT_PUBLIC_BASE_URL (si es necesario)

Si usas la URL de Vercel:
1. Ve a **Settings** → **Environment Variables**
2. Actualiza `NEXT_PUBLIC_BASE_URL` con la URL real de tu proyecto
3. Haz un nuevo despliegue

## 🔧 Configuración Adicional Recomendada

### Dominio Personalizado (Opcional)

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Sigue las instrucciones de DNS que Vercel te proporciona

### Variables de Entorno por Ambiente

Puedes configurar variables diferentes para:
- **Production**: Producción
- **Preview**: Pull requests y branches
- **Development**: Desarrollo local

Para cada ambiente, puedes tener valores diferentes si es necesario.

## 🐛 Solución de Problemas Comunes

### Problema: "Veo productos mock en lugar de mis productos reales de Supabase"

**Causa**: Las variables de entorno de Supabase no están configuradas o no se aplicaron correctamente.

**Solución**:
1. Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
2. Verifica que existan estas dos variables:
   - `NEXT_PUBLIC_SUPABASE_URL` (debe tener tu URL de Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (debe tener tu anon key de Supabase)
3. Si no existen, agrégalas (ver Paso 3 arriba)
4. Si existen pero están vacías o incorrectas, edítalas con los valores correctos
5. **Haz un nuevo despliegue**:
   - Ve a **Deployments**
   - Haz clic en los tres puntos (⋯) del último deployment
   - Selecciona **Redeploy**
   - O haz un nuevo commit y push

**Verificación**:
- Después del despliegue, revisa los logs en Vercel
- Si ves el mensaje "⚠️ Supabase no está configurado", las variables aún no están correctas
- Si no ves ese mensaje, las variables están funcionando

### Error: "Environment variables not found"
- Verifica que todas las variables estén configuradas en Vercel
- Asegúrate de que las variables `NEXT_PUBLIC_*` estén marcadas como "Available for all environments"
- **Recuerda**: Después de agregar variables, debes hacer un nuevo despliegue

### Error: "Build failed"
- Revisa los logs de build en Vercel
- Verifica que no haya errores de TypeScript o ESLint
- Asegúrate de que todas las dependencias estén en `package.json`

### Error: "Image optimization error"
- Verifica que los dominios de imágenes estén en `next.config.js`
- Revisa que las URLs de imágenes sean válidas

### Error: "API route error"
- Verifica que las variables de entorno del servidor estén configuradas
- Revisa los logs de la función en Vercel

## 📝 Checklist Pre-Despliegue

Antes de desplegar, verifica:

- [ ] Todos los cambios están commiteados y pusheados
- [ ] No hay errores de TypeScript (`npm run build` funciona localmente)
- [ ] No hay errores de ESLint
- [ ] Todas las variables de entorno están listas
- [ ] Las URLs de imágenes externas están configuradas en `next.config.js`
- [ ] Las dependencias están actualizadas en `package.json`

## 🔄 Actualizaciones Futuras

Cada vez que hagas `git push` a la rama `main`, Vercel desplegará automáticamente una nueva versión.

Para desplegar desde otra rama:
1. Crea un Pull Request
2. Vercel creará automáticamente un "Preview Deployment"
3. Puedes probar los cambios antes de hacer merge

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno en Vercel](https://vercel.com/docs/environment-variables)

