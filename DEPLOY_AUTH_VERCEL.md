# 🚀 Guía: Desplegar Autenticación en Vercel

Esta guía te ayudará a configurar todo para que la autenticación funcione correctamente en producción (Vercel).

## 📋 Checklist Pre-Despliegue

Antes de desplegar, asegúrate de tener:

- [ ] Cuenta en Vercel
- [ ] Proyecto desplegado en Vercel
- [ ] Cuenta en Resend (o SendGrid) para emails
- [ ] Google OAuth configurado con URLs de producción
- [ ] Variables de entorno configuradas

---

## 🔧 Paso 1: Configurar Servicio de Email (Resend)

### 1.1 Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta (es gratis hasta 3,000 emails/mes)
3. Verifica tu email

### 1.2 Obtener API Key

1. Ve a **API Keys** en el dashboard de Resend
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "XuleriaLCorte Production")
4. **Copia el API Key** (solo se muestra una vez)

### 1.3 Verificar Dominio (Opcional pero Recomendado)

Para producción, es mejor verificar tu dominio:

1. Ve a **Domains** en Resend
2. Haz clic en **Add Domain**
3. Ingresa tu dominio (ej: `xulerialcorte.vercel.app` o tu dominio personalizado)
4. Sigue las instrucciones para agregar los registros DNS

**Nota:** Si no verificas un dominio, Resend te dará un dominio de prueba que funciona pero puede ir a spam.

---

## 📧 Paso 2: Instalar y Configurar Resend en el Código

### 2.1 Instalar Resend

```bash
npm install resend
```

### 2.2 Actualizar el Endpoint de Envío de Códigos

Ya está preparado, solo necesitas agregar la variable de entorno.

---

## ⚙️ Paso 3: Configurar Variables de Entorno en Vercel

### 3.1 Variables Obligatorias

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**

Agrega estas variables para **Production**, **Preview** y **Development**:

```env
# Supabase (ya deberías tenerlas)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key

# Resend (NUEVO - para emails)
RESEND_API_KEY=re_tu_api_key_de_resend

# Base URL (importante para callbacks)
NEXT_PUBLIC_BASE_URL=https://tu-proyecto.vercel.app
```

**⚠️ IMPORTANTE:**
- Reemplaza `tu-proyecto.vercel.app` con tu URL real de Vercel
- Reemplaza `re_tu_api_key_de_resend` con tu API Key de Resend
- Asegúrate de seleccionar **Production**, **Preview** y **Development**

### 3.2 Cómo Encontrar tu URL de Vercel

1. Ve a tu proyecto en Vercel
2. Tu URL está en la parte superior, algo como: `https://xulerialcorte.vercel.app`
3. O ve a **Settings** → **Domains** para ver tu dominio

---

## 🔐 Paso 4: Actualizar Google OAuth para Producción

### 4.1 Obtener tu URL de Vercel

Tu URL será algo como: `https://xulerialcorte.vercel.app`

### 4.2 Actualizar Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Edita tu **OAuth 2.0 Client ID**
4. En **Authorized JavaScript origins**, agrega:
   ```
   https://tu-proyecto.vercel.app
   ```
   (Si tienes dominio personalizado, también agrégalo)

5. En **Authorized redirect URIs**, agrega:
   ```
   https://tu-proyecto.vercel.app/auth/callback
   ```
   (Si tienes dominio personalizado, también agrégalo)

6. **Guarda** los cambios

**Nota:** Mantén también `http://localhost:3000` para desarrollo local.

### 4.3 Verificar Supabase

En Supabase → **Authentication** → **Providers** → **Google**:
- Verifica que el **Redirect URL** sea: `https://tu-proyecto-supabase.supabase.co/auth/v1/callback`
- Esto no debería cambiar

---

## 📝 Paso 5: Actualizar Código para Enviar Emails

El código ya está preparado, pero necesitas descomentar la parte de Resend. Te muestro cómo:

### 5.1 Actualizar `pages/api/auth/send-verification-code.ts`

Busca esta sección (alrededor de la línea 98-113) y reemplázala:

```typescript
// Reemplazar esto:
console.log('='.repeat(50))
console.log(`📧 CÓDIGO DE VERIFICACIÓN`)
// ... resto del console.log

// Con esto:
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// En la función handler, después de generar el código:
try {
  await resend.emails.send({
    from: 'noreply@tudominio.com', // O usa el dominio de Resend: 'onboarding@resend.dev'
    to: email,
    subject: 'Código de verificación - XuleriaLCorte',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Código de Verificación</h2>
        <p>Hola,</p>
        <p>Tu código de verificación es:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${code}
        </div>
        <p>Este código expira en <strong>15 minutos</strong>.</p>
        <p>Si no solicitaste este código, puedes ignorar este email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">XuleriaLCorte</p>
      </div>
    `,
  })
  
  console.log('Email enviado correctamente a:', email)
} catch (emailError) {
  console.error('Error enviando email:', emailError)
  // En desarrollo, aún mostrar el código en consola
  if (process.env.NODE_ENV === 'development') {
    console.log('='.repeat(50))
    console.log(`📧 CÓDIGO DE VERIFICACIÓN (FALLBACK)`)
    console.log(`Email: ${email}`)
    console.log(`Código: ${code}`)
    console.log('='.repeat(50))
  }
}
```

**Nota:** Si no verificaste un dominio en Resend, usa `onboarding@resend.dev` como `from`.

---

## 🚀 Paso 6: Desplegar en Vercel

### 6.1 Hacer Commit y Push

```bash
git add .
git commit -m "feat: Configurar envío de emails con Resend"
git push origin main
```

### 6.2 Vercel Desplegará Automáticamente

Si tienes Vercel conectado a GitHub, se desplegará automáticamente.

O puedes hacer un **Redeploy** manual:
1. Ve a Vercel → Tu proyecto → **Deployments**
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**

### 6.3 Verificar el Despliegue

1. Espera a que termine el build (2-5 minutos)
2. Visita tu URL de Vercel
3. Prueba iniciar sesión con Google
4. **Revisa tu email** - deberías recibir el código

---

## ✅ Paso 7: Verificación Final

### Checklist de Verificación:

- [ ] Variables de entorno configuradas en Vercel
- [ ] Resend API Key agregada
- [ ] Google OAuth URLs actualizadas con dominio de Vercel
- [ ] Código actualizado para enviar emails
- [ ] Proyecto desplegado en Vercel
- [ ] Prueba de login funciona
- [ ] Email de verificación llega correctamente

---

## 🐛 Solución de Problemas

### Problema: No llegan los emails

**Soluciones:**
1. Verifica que `RESEND_API_KEY` esté configurada en Vercel
2. Revisa los logs de Vercel para errores
3. Verifica que el dominio esté verificado en Resend (o usa `onboarding@resend.dev`)
4. Revisa la carpeta de spam

### Problema: Error "redirect_uri_mismatch"

**Solución:**
- Verifica que agregaste la URL de Vercel en Google Cloud Console
- Asegúrate de que sea `https://` (no `http://`)

### Problema: "Usuario no encontrado" en producción

**Solución:**
- Verifica que las políticas RLS estén ejecutadas en Supabase
- Revisa los logs de Vercel para más detalles

---

## 📝 Notas Importantes

1. **En desarrollo local**, los códigos seguirán apareciendo en la consola (por seguridad)
2. **En producción**, los códigos se envían por email
3. **Resend tiene límite gratuito** de 3,000 emails/mes
4. **Verifica tu dominio** en Resend para mejor deliverability
5. **Mantén las URLs de localhost** en Google OAuth para desarrollo

---

## 🎯 Resumen Rápido

1. ✅ Crear cuenta en Resend y obtener API Key
2. ✅ Agregar `RESEND_API_KEY` en Vercel
3. ✅ Actualizar Google OAuth con URL de Vercel
4. ✅ Actualizar código para enviar emails (si no lo has hecho)
5. ✅ Desplegar en Vercel
6. ✅ Probar login y verificar que llegue el email

¿Necesitas ayuda con algún paso específico? 🚀

