# 🔧 Verificar Variables de Entorno en Vercel

Si tu aplicación se queda en "Cargando..." en producción, es probable que las variables de entorno no estén configuradas correctamente en Vercel.

## ✅ Pasos para Verificar y Configurar

### 1. Verificar Variables en Vercel

1. Ve a tu proyecto en [Vercel](https://vercel.com)
2. Haz clic en tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Verifica que tengas estas variables configuradas:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```

### 2. Agregar Variables de Entorno

Si no están configuradas:

1. En **Settings** → **Environment Variables**
2. Haz clic en **Add New**
3. Agrega cada variable:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://tu-proyecto.supabase.co` (tu URL real de Supabase)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `tu_clave_anonima_de_supabase` (tu clave real)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **Variable 3:**
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_live_xxxxx` (tu clave de producción de Clerk)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **Variable 4:**
   - Name: `CLERK_SECRET_KEY`
   - Value: `sk_live_xxxxx` (tu clave secreta de producción de Clerk)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

4. Haz clic en **Save**

### 3. Obtener las Credenciales de Supabase

Si no las tienes:

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** (⚙️) → **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **IMPORTANTE:** Usa la clave `anon public`, NO la `service_role`

### 3.1 Obtener las Credenciales de Clerk

Si no las tienes:

1. Ve a tu proyecto en [Clerk Dashboard](https://dashboard.clerk.com)
2. Ve a **API Keys**
3. Copia:
   - **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** → `CLERK_SECRET_KEY`

⚠️ **IMPORTANTE:** 
- En producción, usa las claves que empiezan con `pk_live_` y `sk_live_`
- No uses las claves de test (`pk_test_` y `sk_test_`) en producción

### 4. Redesplegar la Aplicación

Después de agregar las variables:

1. Ve a **Deployments** en Vercel
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo commit y push (Vercel desplegará automáticamente)

### 5. Verificar que Funciona

1. Espera a que termine el deployment
2. Ve a `https://xac-fawn.vercel.app/profile`
3. Debería funcionar correctamente

## 🐛 Solución de Problemas

### Sigue mostrando "Cargando..."

1. **Verifica las variables en Vercel:**
   - Asegúrate de que estén en **Production**
   - Verifica que los valores sean correctos (sin espacios extra)

2. **Revisa la consola del navegador:**
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña **Console**
   - Busca errores relacionados con Supabase

3. **Verifica las URLs de Supabase:**
   - Asegúrate de que la URL de Supabase sea correcta
   - Debe ser `https://` (no `http://`)

4. **Limpia la caché:**
   - Prueba en una ventana de incógnito
   - O limpia el localStorage: `localStorage.clear()` en la consola

### Error: "Invalid API key"

- Verifica que copiaste la clave `anon public` correcta
- Asegúrate de que no haya espacios antes o después del valor
- Verifica que la clave esté completa (son muy largas)

### Error: "Failed to fetch"

- Verifica que la URL de Supabase sea correcta
- Verifica que tu proyecto de Supabase esté activo
- Revisa si hay restricciones de CORS en Supabase

## 📝 Notas Importantes

- Las variables `NEXT_PUBLIC_*` son públicas y se incluyen en el bundle del cliente
- No uses la clave `service_role` en el cliente (es solo para el servidor)
- Después de cambiar variables de entorno, siempre redesplega la aplicación
- Las variables se aplican en el próximo deployment

## ✅ Checklist

- [ ] Variables configuradas en Vercel
- [ ] Variables disponibles en Production, Preview y Development
- [ ] Valores correctos (URL y clave de Supabase)
- [ ] Aplicación redesplegada después de agregar variables
- [ ] Probado en producción

