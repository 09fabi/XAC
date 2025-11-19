# 🔐 Guía: Configuración de Clerk Authentication

Esta guía te ayudará a configurar Clerk como sistema de autenticación en tu aplicación.

## 📋 Requisitos Previos

1. Cuenta en [Clerk](https://clerk.com)
2. Proyecto creado en Clerk

## 🔑 Paso 1: Crear Proyecto en Clerk

1. Ve a [Clerk Dashboard](https://dashboard.clerk.com)
2. Si no tienes cuenta, crea una (es gratis para desarrollo)
3. Haz clic en **"Create Application"** o **"New Application"**
4. Configura tu aplicación:
   - **Name**: "XuleriaLCorte" (o el nombre que prefieras)
   - **Authentication options**: Selecciona los métodos que quieras (Email, Google, etc.)
5. Haz clic en **"Create"**

## 🔑 Paso 2: Obtener las Claves de API

1. En el dashboard de Clerk, ve a **"API Keys"** en el menú lateral
2. Verás dos claves importantes:
   - **Publishable Key**: Empieza con `pk_test_` o `pk_live_`
   - **Secret Key**: Empieza con `sk_test_` o `sk_live_`
3. **Copia ambas claves** (las necesitarás en el siguiente paso)

⚠️ **IMPORTANTE:**
- Las claves que empiezan con `pk_test_` y `sk_test_` son para **desarrollo**
- Las claves que empiezan con `pk_live_` y `sk_live_` son para **producción**
- En desarrollo, usa las claves de test
- En producción, usa las claves de live

## ⚙️ Paso 3: Configurar Variables de Entorno Local

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

**⚠️ Importante:**
- Reemplaza `pk_test_xxxxx` con tu Publishable Key real
- Reemplaza `sk_test_xxxxx` con tu Secret Key real
- **NO** pongas comillas alrededor de los valores
- **NO** pongas espacios alrededor del signo `=`
- En desarrollo, usa las claves de test (`pk_test_` y `sk_test_`)
- En producción, usa las claves de live (`pk_live_` y `sk_live_`)

## 🔧 Paso 4: Verificar Variables de Entorno

Ejecuta el script de verificación:

```bash
npm run check:env
```

Deberías ver:
```
🔐 CLERK:
   ✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: pk_test_xxxxx...
   ✅ CLERK_SECRET_KEY: sk_test_xxxxx...
```

## 🌐 Paso 5: Configurar URLs en Clerk

1. En el dashboard de Clerk, ve a **"Paths"** o **"Redirect URLs"**
2. Agrega las siguientes URLs:

### Para Desarrollo Local:
```
http://localhost:3000
http://localhost:3000/sign-in
http://localhost:3000/sign-up
```

### Para Producción (Vercel):
```
https://tu-proyecto.vercel.app
https://tu-proyecto.vercel.app/sign-in
https://tu-proyecto.vercel.app/sign-up
```

Si tienes un dominio personalizado:
```
https://tu-dominio.com
https://tu-dominio.com/sign-in
https://tu-dominio.com/sign-up
```

## ✅ Paso 6: Probar el Sistema

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:3000/sign-in`

3. Deberías ver el formulario de inicio de sesión de Clerk

4. Prueba crear una cuenta o iniciar sesión

5. Si todo funciona, verás el botón de usuario en el Navbar

## 🚀 Paso 7: Configurar para Producción (Vercel)

### 7.1 Agregar Variables en Vercel

1. Ve a tu proyecto en [Vercel](https://vercel.com)
2. Haz clic en tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_live_xxxxx` (tu clave de producción)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

   **Variable 2:**
   - Name: `CLERK_SECRET_KEY`
   - Value: `sk_live_xxxxx` (tu clave de producción)
   - Environment: Selecciona **Production**, **Preview**, y **Development**

5. Haz clic en **Save**

⚠️ **IMPORTANTE:** 
- En producción, usa las claves que empiezan con `pk_live_` y `sk_live_`
- No uses las claves de test en producción

### 7.2 Redesplegar la Aplicación

Después de agregar las variables:

1. Ve a **Deployments** en Vercel
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. O simplemente haz un nuevo commit y push (Vercel desplegará automáticamente)

## 🐛 Solución de Problemas

### Error: "Clerk: Missing publishableKey"

**Solución:** 
- Verifica que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` esté en tu `.env.local`
- Asegúrate de que no tenga comillas ni espacios
- Reinicia el servidor de desarrollo (`npm run dev`)

### Error: "Clerk: Missing secretKey"

**Solución:**
- Verifica que `CLERK_SECRET_KEY` esté en tu `.env.local`
- Esta variable solo se usa en el servidor, no necesita `NEXT_PUBLIC_`
- Reinicia el servidor de desarrollo

### El formulario de login no aparece

**Solución:**
- Verifica que las URLs estén configuradas en Clerk Dashboard
- Asegúrate de que `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` esté correctamente configurada
- Revisa la consola del navegador para ver errores

### Error de CORS o redirect

**Solución:**
- Verifica que las URLs de redirección en Clerk coincidan exactamente con tu dominio
- Asegúrate de incluir `http://localhost:3000` para desarrollo
- Asegúrate de incluir tu URL de Vercel para producción

## 📝 Notas Importantes

1. **Clerk maneja automáticamente:**
   - Autenticación por email/código
   - Autenticación por contraseña
   - OAuth (Google, GitHub, etc.)
   - Verificación de email
   - Recuperación de contraseña
   - Gestión de sesiones

2. **Las páginas de autenticación están en:**
   - `/sign-in` - Inicio de sesión
   - `/sign-up` - Registro
   - `/user-profile` - Perfil de usuario

3. **Componentes de Clerk disponibles:**
   - `<SignIn />` - Formulario de inicio de sesión
   - `<SignUp />` - Formulario de registro
   - `<UserButton />` - Botón de usuario (ya está en Navbar)
   - `<UserProfile />` - Perfil completo del usuario
   - `<SignedIn />` - Muestra contenido solo si el usuario está autenticado
   - `<SignedOut />` - Muestra contenido solo si el usuario NO está autenticado

4. **Hooks de Clerk:**
   - `useUser()` - Obtener información del usuario actual
   - `useAuth()` - Obtener información de autenticación
   - `auth()` - En Server Components, obtener información del usuario

## 🚀 Próximos Pasos

- [ ] Configurar métodos de autenticación adicionales (Google, GitHub, etc.)
- [ ] Personalizar el tema de los formularios de Clerk
- [ ] Configurar webhooks de Clerk para sincronizar con tu base de datos
- [ ] Agregar roles y permisos
- [ ] Configurar autenticación de dos factores (2FA)

