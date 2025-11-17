# 🚀 Guía Rápida: Desplegar Flow en Vercel

## ⚠️ Problema Actual
Estás viendo "error al procesar el pago" porque:
1. Los cambios de Flow no están desplegados en Vercel
2. Las variables de entorno de Flow no están configuradas en Vercel

## ✅ Solución: 3 Pasos Simples

### Paso 1: Agregar Variables de Entorno en Vercel

1. **Ve a tu proyecto en Vercel:**
   - https://vercel.com/dashboard
   - Selecciona tu proyecto `xulerialcorte`

2. **Ve a Settings → Environment Variables**

3. **Agrega estas variables:**

   **Variable 1:**
   - **Name:** `NEXT_PUBLIC_FLOW_API_KEY`
   - **Value:** `71A35A7F-A9B2-4595-9FCB-951E55998LDF`
   - **Environment:** ✅ Production, ✅ Preview, ✅ Development
   - Haz clic en **Save**

   **Variable 2:**
   - **Name:** `FLOW_SECRET_KEY`
   - **Value:** `d29585f8c04dd92f4d89dba8601820aec94639a9`
   - **Environment:** ✅ Production, ✅ Preview, ✅ Development
   - Haz clic en **Save**

   **Variable 3:**
   - **Name:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** `https://tu-proyecto.vercel.app` (reemplaza con tu URL real de Vercel)
   - **Environment:** ✅ Production, ✅ Preview, ✅ Development
   - Haz clic en **Save**

   **💡 Cómo encontrar tu URL de Vercel:**
   - Ve a **Deployments** en Vercel
   - Tu URL está arriba, algo como: `https://xulerialcorte.vercel.app`
   - O ve a **Settings → Domains** para ver tu dominio

### Paso 2: Hacer Commit y Push de los Cambios

Los cambios de Flow están en tu código local, pero no en Vercel. Necesitas subirlos:

```bash
# Ver qué archivos cambiaron
git status

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "feat: Integración completa de Flow Payment"

# Subir a GitHub
git push origin main
```

**O si prefieres hacerlo manualmente:**
1. Ve a tu repositorio en GitHub
2. Haz clic en **"Upload files"** o usa GitHub Desktop
3. Sube los archivos nuevos/modificados:
   - `pages/api/flow/create-payment.ts`
   - `pages/api/flow/confirm.ts`
   - `supabase-flow-migration.sql`
   - Cualquier otro archivo modificado

### Paso 3: Desplegar en Vercel

**Opción A: Despliegue Automático (Recomendado)**
- Si conectaste Vercel con GitHub, automáticamente desplegará cuando hagas `git push`
- Ve a **Deployments** en Vercel y espera a que termine (2-5 minutos)

**Opción B: Redeploy Manual**
1. Ve a **Deployments** en Vercel
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. Espera a que termine

**⚠️ IMPORTANTE:** Después de agregar las variables de entorno, **SIEMPRE debes hacer un nuevo despliegue** para que surtan efecto.

## 🔍 Verificar que Funcione

1. **Espera a que termine el despliegue** (verás "Ready" en verde)

2. **Visita tu página en Vercel**

3. **Prueba hacer un pago:**
   - Agrega productos al carrito
   - Haz clic en "Proceder al Pago"
   - Deberías ser redirigido a Flow (no debería aparecer error)

4. **Si aún ves error:**
   - Abre la consola del navegador (F12)
   - Ve a la pestaña **Network**
   - Intenta hacer el pago de nuevo
   - Busca la petición a `/api/flow/create-payment`
   - Haz clic en ella y revisa la respuesta
   - Comparte el error que veas

## 🐛 Errores Comunes

### Error: "Flow no configurado"
**Causa:** Las variables de entorno no están configuradas o no se aplicaron.

**Solución:**
1. Verifica que las variables estén en Vercel (Settings → Environment Variables)
2. Verifica que estén marcadas para **Production**
3. Haz un **nuevo despliegue** después de agregarlas

### Error: "Invalid signature"
**Causa:** La `FLOW_SECRET_KEY` está incorrecta o tiene espacios.

**Solución:**
1. Verifica que `FLOW_SECRET_KEY` sea exactamente: `d29585f8c04dd92f4d89dba8601820aec94639a9`
2. No debe tener espacios antes o después
3. Haz un nuevo despliegue

### Error: "Flow API error"
**Causa:** Problema con la API de Flow o URLs mal configuradas.

**Solución:**
1. Verifica que `NEXT_PUBLIC_BASE_URL` sea tu URL real de Vercel
2. Configura las URLs en el panel de Flow:
   - URL de Confirmación: `https://tu-proyecto.vercel.app/api/flow/confirm`
   - URL de Retorno: `https://tu-proyecto.vercel.app/cart?payment=success`

## ✅ Checklist Final

Antes de probar, verifica:

- [ ] Variables de entorno agregadas en Vercel:
  - [ ] `NEXT_PUBLIC_FLOW_API_KEY`
  - [ ] `FLOW_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_BASE_URL` (con tu URL de Vercel)
- [ ] Cambios subidos a GitHub (commit + push)
- [ ] Nuevo despliegue completado en Vercel
- [ ] URLs configuradas en el panel de Flow (opcional, pero recomendado)

## 🎯 Resumen Rápido

1. **Agrega variables en Vercel** (Settings → Environment Variables)
2. **Sube los cambios a GitHub** (`git push`)
3. **Espera el despliegue automático** o haz Redeploy manual
4. **Prueba el pago** en tu página desplegada

---

¿Necesitas ayuda con algún paso específico? 🚀

