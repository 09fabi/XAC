# 🔐 Guía: Configuración de Autenticación con Google y Verificación por Código

Esta guía te ayudará a configurar el sistema de autenticación con Google OAuth y verificación por código de email.

## 📋 Requisitos Previos

1. Cuenta en [Supabase](https://supabase.com)
2. Cuenta en [Google Cloud Console](https://console.cloud.google.com/)
3. (Opcional) Servicio de email para enviar códigos (Resend, SendGrid, etc.)

## 🔑 Paso 1: Configurar Google OAuth en Google Cloud

### 1.1 Crear un Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el nombre del proyecto

### 1.2 Habilitar Google+ API

1. En el menú lateral, ve a **APIs & Services** → **Library**
2. Busca "Google+ API" o "Google Identity Platform"
3. Haz clic en **Enable**

### 1.3 Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** → **Credentials**
2. Haz clic en **Create Credentials** → **OAuth client ID**
3. Si es la primera vez, configura la pantalla de consentimiento:
   - Tipo: **External**
   - Nombre de la app: "XuleriaLCorte" (o el que prefieras)
   - Email de soporte: tu email
   - Agrega tu email como usuario de prueba
   - Guarda y continúa

4. Configura el OAuth Client:
   - Tipo de aplicación: **Web application**
   - Nombre: "XuleriaLCorte Web Client"
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (para desarrollo local)
     - `https://tu-proyecto.vercel.app` (para producción en Vercel)
     - Si tienes dominio personalizado: `https://tu-dominio.com`
   - **Authorized redirect URIs:**
     - `http://localhost:3000/auth/callback` (para desarrollo local)
     - `https://tu-proyecto.vercel.app/auth/callback` (para producción en Vercel)
     - Si tienes dominio personalizado: `https://tu-dominio.com/auth/callback`
     - **IMPORTANTE:** También agrega: `https://[tu-proyecto-supabase].supabase.co/auth/v1/callback`
       (Reemplaza `[tu-proyecto-supabase]` con tu URL real de Supabase, ej: `https://abcdefgh.supabase.co/auth/v1/callback`)

5. Haz clic en **Create**
6. **Copia el Client ID y Client Secret** (los necesitarás en el siguiente paso)

## ⚙️ Paso 2: Configurar Google OAuth en Supabase

### 2.1 Habilitar Google Provider

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Navega a **Authentication** → **Providers**
3. Busca **Google** y haz clic para habilitarlo
4. Ingresa:
   - **Client ID (for OAuth)**: El Client ID que copiaste de Google Cloud
   - **Client Secret (for OAuth)**: El Client Secret que copiaste de Google Cloud
5. Haz clic en **Save**

### 2.2 Configurar URL de Redirección

En la misma página de configuración de Google:
- Asegúrate de que la **Redirect URL** esté configurada como:
  ```
  https://[tu-proyecto-supabase].supabase.co/auth/v1/callback
  ```

## 🗄️ Paso 3: Ejecutar Migración de Base de Datos

1. Abre el **SQL Editor** en tu proyecto de Supabase
2. Abre el archivo `supabase-auth-verification.sql` de este proyecto
3. Copia todo el contenido
4. Pégalo en el SQL Editor de Supabase
5. Haz clic en **Run** (o presiona `Ctrl+Enter` / `Cmd+Enter`)

Esto creará:
- ✅ Columna `email_verified` en `user_profiles`
- ✅ Tabla `email_verification_codes` para almacenar códigos
- ✅ Triggers para crear perfiles automáticamente
- ✅ Políticas de seguridad (RLS)

## 📧 Paso 4: Configurar Envío de Emails (Opcional pero Recomendado)

Actualmente, el sistema loguea los códigos en la consola. Para producción, necesitas un servicio de email.

### Opción A: Usar Resend (Recomendado)

1. Crea una cuenta en [Resend](https://resend.com)
2. Verifica tu dominio o usa el dominio de prueba
3. Obtén tu API Key
4. Instala el paquete:
   ```bash
   npm install resend
   ```
5. Actualiza `pages/api/auth/send-verification-code.ts`:

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// En la función handler, reemplaza el console.log con:
await resend.emails.send({
  from: 'noreply@tudominio.com',
  to: email,
  subject: 'Código de verificación - XuleriaLCorte',
  html: `
    <h2>Código de verificación</h2>
    <p>Tu código de verificación es: <strong>${code}</strong></p>
    <p>Este código expira en 15 minutos.</p>
    <p>Si no solicitaste este código, ignora este email.</p>
  `,
})
```

6. Agrega a `.env.local`:
```env
RESEND_API_KEY=tu_api_key_de_resend
```

### Opción B: Usar SendGrid

Similar a Resend, pero con SendGrid. Consulta la documentación de SendGrid para Node.js.

### Opción C: Usar SMTP de Supabase

Supabase tiene un servicio de email integrado. Consulta la documentación de Supabase para configurarlo.

## 🔧 Paso 5: Verificar Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga:

```env
# Supabase (ya deberías tenerlas)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima

# (Opcional) Para envío de emails
RESEND_API_KEY=tu_api_key_de_resend
```

## ✅ Paso 6: Probar el Sistema

1. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:3000/auth/login`

3. Haz clic en "Continuar con Google"

4. Inicia sesión con tu cuenta de Google

5. Serás redirigido a la página de verificación

6. **En desarrollo**, el código aparecerá en:
   - La consola del servidor (terminal donde corre `npm run dev`)
   - La respuesta de la API (en el navegador, en la consola de desarrollador)

7. Ingresa el código de 6 dígitos

8. Si es correcto, serás redirigido a tu perfil

## 🐛 Solución de Problemas

### Error: "redirect_uri_mismatch"

**Solución:** Verifica que las URLs de redirección en Google Cloud Console coincidan exactamente con:
- `http://localhost:3000/auth/callback` (desarrollo)
- `https://tu-dominio.com/auth/callback` (producción)
- `https://[tu-proyecto].supabase.co/auth/v1/callback` (Supabase)

### Error: "Invalid OAuth client"

**Solución:** Verifica que el Client ID y Client Secret en Supabase sean correctos y que hayas habilitado la API de Google+ en Google Cloud.

### El código no se envía por email

**Solución:** 
- En desarrollo, revisa la consola del servidor donde aparece el código
- En producción, configura un servicio de email (Resend, SendGrid, etc.)
- Verifica que la variable de entorno `RESEND_API_KEY` esté configurada

### El usuario no se crea automáticamente

**Solución:** Verifica que ejecutaste el script SQL `supabase-auth-verification.sql` que crea el trigger automático.

## 📝 Notas Importantes

1. **En desarrollo**, los códigos se muestran en la consola por seguridad. En producción, usa un servicio de email real.

2. **Los códigos expiran en 15 minutos** por seguridad.

3. **Solo se puede tener un código activo por usuario** a la vez. Si solicitas un nuevo código, el anterior se invalida.

4. **El email debe estar verificado** antes de que el usuario pueda acceder a páginas protegidas como `/profile`.

5. **Google OAuth ya verifica la identidad del usuario**, pero este sistema agrega una capa adicional de verificación por código para mayor seguridad.

## 🚀 Próximos Pasos

- [ ] Configurar servicio de email para producción
- [ ] Personalizar los emails de verificación
- [ ] Agregar límite de intentos de verificación
- [ ] Implementar recuperación de cuenta
- [ ] Agregar autenticación de dos factores (2FA)

