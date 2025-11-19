# 🔐 Configuración Rápida de Google OAuth

## ⚠️ Importante: URLs para Vercel

Si tu aplicación está desplegada en **Vercel**, debes configurar **AMBAS** URLs:
- ✅ `localhost:3000` (para desarrollo local)
- ✅ Tu dominio de Vercel (para producción)

## 📋 Paso a Paso

### 0. Configurar Pantalla de Consentimiento (OBLIGATORIO PRIMERO)

**⚠️ IMPORTANTE:** Debes hacer esto ANTES de crear las credenciales OAuth.

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a **APIs & Services** → **OAuth consent screen**
4. Selecciona **External** (a menos que tengas cuenta de Google Workspace)
5. Haz clic en **Create**

#### Paso 1: Información de la App
- **App name**: `XuleriaLCorte` (o el nombre que prefieras)
- **User support email**: Tu email
- **App logo**: (Opcional, puedes saltarlo)
- **App domain**: (Opcional, puedes saltarlo)
- **Application home page**: `https://tu-proyecto.vercel.app` (o tu dominio)
- **Application privacy policy link**: (Opcional por ahora)
- **Application terms of service link**: (Opcional por ahora)
- **Authorized domains**: (Opcional, puedes saltarlo)
- **Developer contact information**: Tu email

Haz clic en **Save and Continue**

#### Paso 2: Scopes (Permisos)
- Por ahora, puedes dejarlo vacío o hacer clic en **Save and Continue**
- Los scopes básicos se agregarán automáticamente

#### Paso 3: Test Users (Usuarios de Prueba)
- **IMPORTANTE:** Agrega tu email aquí para poder probar
- Haz clic en **Add Users**
- Ingresa tu email
- Haz clic en **Add**
- Haz clic en **Save and Continue**

#### Paso 4: Resumen
- Revisa la información
- Haz clic en **Back to Dashboard**

**✅ Listo!** Ahora puedes crear las credenciales OAuth.

### 1. Obtener tu URL de Vercel

1. Ve a [vercel.com](https://vercel.com) → Tu proyecto
2. Tu URL será algo como: `https://xulerialcorte.vercel.app`
3. O ve a **Settings** → **Domains** para ver tu dominio

### 2. Obtener tu URL de Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** → **API**
3. Copia tu **Project URL** (ej: `https://abcdefgh.supabase.co`)

### 3. Habilitar Google+ API

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Library**
3. Busca "Google+ API" o "Google Identity Platform"
4. Haz clic en **Enable** (si no está habilitada)

### 4. Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** → **Credentials**
2. Haz clic en **Create Credentials** → **OAuth client ID**
3. Si es la primera vez, te pedirá configurar la pantalla de consentimiento (ver paso 0 arriba)
4. Selecciona **Web application** como tipo
5. En **Authorized JavaScript origins**, agrega:
   ```
   http://localhost:3000
   https://tu-proyecto.vercel.app
   ```
   (Si tienes dominio personalizado, también agrégalo)

6. En **Authorized redirect URIs**, agrega **TODAS** estas URLs:
   ```
   http://localhost:3000/auth/callback
   https://tu-proyecto.vercel.app/auth/callback
   https://[tu-proyecto-supabase].supabase.co/auth/v1/callback
   ```
   
   **Ejemplo real:**
   ```
   http://localhost:3000/auth/callback
   https://xulerialcorte.vercel.app/auth/callback
   https://abcdefgh.supabase.co/auth/v1/callback
   ```

7. Haz clic en **Create**
8. **Copia el Client ID y Client Secret** (los necesitarás para Supabase)

### 5. Configurar en Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. **Authentication** → **Providers** → **Google**
3. Habilita Google
4. Ingresa:
   - **Client ID**: De Google Cloud Console
   - **Client Secret**: De Google Cloud Console
5. **Save**

## ✅ Verificación

### Para Desarrollo Local:
1. Inicia: `npm run dev`
2. Ve a: `http://localhost:3000/auth/login`
3. Prueba el login con Google

### Para Producción (Vercel):
1. Ve a: `https://tu-proyecto.vercel.app/auth/login`
2. Prueba el login con Google

## 🐛 Problemas Comunes

### Error: "redirect_uri_mismatch"

**Causa:** La URL de redirección no está en la lista de Google Cloud.

**Solución:**
1. Verifica que agregaste **TODAS** las URLs en Google Cloud Console
2. Asegúrate de que la URL de Supabase esté correcta (sin espacios, con `https://`)
3. Espera unos minutos después de guardar (puede tardar en actualizarse)

### Error: "Invalid OAuth client"

**Causa:** Client ID o Secret incorrectos en Supabase.

**Solución:**
1. Verifica que copiaste correctamente el Client ID y Secret
2. Asegúrate de que no hay espacios extra
3. Verifica que el OAuth Client esté habilitado en Google Cloud

## 📝 Notas

- **Puedes tener múltiples URLs** en Google Cloud Console, no hay problema
- **La URL de Supabase es obligatoria** - Google redirige primero a Supabase, luego a tu app
- **En desarrollo local**, usa `localhost:3000`
- **En producción**, usa tu dominio de Vercel
- **Si cambias de dominio**, actualiza las URLs en Google Cloud Console

