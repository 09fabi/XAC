# ⚡ Configuración Rápida de Flow - Paso a Paso

## ✅ Lo que ya tienes:
- ✅ API Key de Flow
- ✅ Secret Key de Flow

## 🚀 Pasos para Configurar (5 minutos)

### Paso 1: Agregar Variables de Entorno

Abre tu archivo `.env.local` y agrega estas líneas:

```env
# Flow Payment Configuration
NEXT_PUBLIC_FLOW_API_KEY=tu_api_key_aqui
FLOW_SECRET_KEY=tu_secret_key_aqui

# Base URL (para desarrollo local)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:**
- Reemplaza `tu_api_key_aqui` con tu API Key real
- Reemplaza `tu_secret_key_aqui` con tu Secret Key real
- **NO** pongas comillas alrededor de los valores
- **NO** pongas espacios alrededor del signo `=`

### Paso 2: Ejecutar Migración de Base de Datos

1. Abre tu proyecto en [Supabase](https://supabase.com)
2. Ve a **SQL Editor** (en el menú lateral)
3. Abre el archivo `supabase-flow-migration.sql` de este proyecto
4. Copia todo el contenido
5. Pégalo en el SQL Editor de Supabase
6. Haz clic en **Run** o presiona `Ctrl+Enter`

Esto agregará los campos necesarios para guardar la información de Flow en las órdenes.

### Paso 3: Configurar URLs en Flow (IMPORTANTE)

En el panel de administración de Flow, necesitas configurar estas URLs:

#### Para Desarrollo Local (usando ngrok o similar):

1. **URL de Confirmación (Webhook):**
   ```
   https://tu-tunel-ngrok.ngrok.io/api/flow/confirm
   ```
   Esta URL recibe notificaciones cuando se completa un pago.

2. **URL de Retorno:**
   ```
   https://tu-tunel-ngrok.ngrok.io/cart?payment=success
   ```
   Esta URL es donde Flow redirige al usuario después del pago.

#### Para Producción:

1. **URL de Confirmación:**
   ```
   https://tu-dominio.com/api/flow/confirm
   ```

2. **URL de Retorno:**
   ```
   https://tu-dominio.com/cart?payment=success
   ```

**💡 Nota:** Si no sabes dónde configurar estas URLs en Flow:
- Busca en el panel de Flow: "Configuración" → "URLs de Retorno" o "Webhooks"
- O busca en la sección de "API" o "Integraciones"

### Paso 4: Verificar Configuración

Ejecuta este comando para verificar que las variables estén correctas:

```bash
npm run check:env
```

Deberías ver:
```
💳 FLOW (opcional):
   ✅ NEXT_PUBLIC_FLOW_API_KEY: tu_api_key...
   ✅ FLOW_SECRET_KEY: tu_secret_key...
```

### Paso 5: Probar la Integración

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Abre tu aplicación en el navegador:**
   ```
   http://localhost:3000
   ```

3. **Prueba el flujo de pago:**
   - Agrega productos al carrito
   - Ve al carrito
   - Haz clic en "Proceder al Pago"
   - Deberías ser redirigido a Flow para completar el pago

## 🔍 ¿Dónde configurar las URLs en Flow?

Si no encuentras dónde configurar las URLs en el panel de Flow, busca:

1. **Sección "Configuración" o "Settings"**
2. **Sección "API" o "Integraciones"**
3. **Sección "Webhooks" o "Callbacks"**
4. **Sección "URLs de Retorno" o "Return URLs"**

Si aún no encuentras dónde configurarlas, puedes:
- Revisar la documentación de Flow: https://www.flow.cl/documentacion
- Contactar al soporte de Flow
- O probar sin configurarlas primero (algunas veces Flow las acepta automáticamente)

## ⚠️ Problemas Comunes

### Error: "Flow no configurado"
- Verifica que las variables estén en `.env.local`
- Reinicia el servidor: `npm run dev`

### Error: "Invalid signature"
- Verifica que `FLOW_SECRET_KEY` sea correcta
- Asegúrate de que no haya espacios extra

### El pago se completa pero no se crea la orden
- Verifica que ejecutaste la migración de base de datos
- Revisa los logs del servidor para ver errores

## 📝 Resumen de lo que necesitas hacer:

1. ✅ Agregar API Key y Secret Key a `.env.local`
2. ✅ Ejecutar `supabase-flow-migration.sql` en Supabase
3. ✅ Configurar URLs en el panel de Flow
4. ✅ Probar el flujo de pago

## 🎯 ¿Listo?

Una vez que hayas completado estos pasos, tu integración de Flow estará lista. El botón de pago de Flow que mencionaste **NO es necesario** porque estamos usando la API directamente, lo cual te da más control sobre el flujo de pago.

---

¿Necesitas ayuda con algún paso específico? ¡Dime cuál y te ayudo!

