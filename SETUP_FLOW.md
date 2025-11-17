# 💳 Guía: Configuración de Flow Payment

Esta guía te ayudará a configurar Flow.cl como pasarela de pagos en tu aplicación.

## 📋 Requisitos Previos

1. Cuenta en [Flow.cl](https://www.flow.cl/)
2. Acceso al panel de administración de Flow
3. Credenciales de API (API Key y Secret Key)

## 🔑 Paso 1: Obtener Credenciales de Flow

1. **Inicia sesión en Flow.cl**
   - Ve a [https://www.flow.cl/](https://www.flow.cl/)
   - Inicia sesión con tu cuenta

2. **Accede al Panel de Administración**
   - Ve a la sección de "Configuración" o "API"
   - Busca las credenciales de API

3. **Obtén tus credenciales:**
   - **API Key**: Clave pública para identificar tu comercio
   - **Secret Key**: Clave secreta para firmar las peticiones (¡manténla segura!)

## ⚙️ Paso 2: Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```env
# Flow Payment Configuration
NEXT_PUBLIC_FLOW_API_KEY=tu_api_key_aqui
FLOW_SECRET_KEY=tu_secret_key_aqui

# Base URL (importante para callbacks)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ Importante:**
- `NEXT_PUBLIC_FLOW_API_KEY` es pública y puede estar en el cliente
- `FLOW_SECRET_KEY` es privada y **NUNCA** debe exponerse al cliente
- En producción, usa tu dominio real: `https://tu-dominio.com`

## 🗄️ Paso 3: Actualizar Base de Datos

Ejecuta el script de migración en Supabase para agregar los campos de Flow:

1. Abre el **SQL Editor** en tu proyecto de Supabase
2. Copia y pega el contenido de `supabase-flow-migration.sql`
3. Ejecuta el script

Esto agregará las siguientes columnas a la tabla `orders`:
- `flow_token`: Token de transacción de Flow
- `flow_commerce_order`: Número de orden de comercio
- `payment_method`: Método de pago utilizado

## 🔗 Paso 4: Configurar URLs en Flow

En el panel de administración de Flow, configura las siguientes URLs:

### URL de Confirmación (Webhook)
```
https://tu-dominio.com/api/flow/confirm
```
Esta URL recibirá notificaciones cuando se complete un pago.

### URL de Retorno
```
https://tu-dominio.com/cart?payment=success&order={commerceOrder}
```
Esta URL es donde Flow redirigirá al usuario después del pago.

**Para desarrollo local:**
- Puedes usar herramientas como [ngrok](https://ngrok.com/) para exponer tu localhost
- O configurar Flow en modo sandbox/pruebas

## 🧪 Paso 5: Probar la Integración

### Modo Desarrollo (Sin Flow configurado)

Si no has configurado las credenciales de Flow, la aplicación funcionará en **modo simulación**:
- Los pagos se simularán automáticamente
- Se crearán órdenes en Supabase con estado `pending`
- Verás mensajes indicando que es modo simulación

### Modo Producción (Con Flow configurado)

1. **Agrega productos al carrito**
2. **Ve al carrito y haz clic en "Proceder al Pago"**
3. **Serás redirigido a Flow** para completar el pago
4. **Después del pago**, Flow te redirigirá de vuelta a tu tienda
5. **La orden se creará automáticamente** en Supabase con estado `paid`

## 📊 Flujo de Pago Completo

```
1. Usuario → Carrito → "Proceder al Pago"
2. Aplicación → /api/flow/create-payment
3. Flow → Crea pago y retorna URL
4. Usuario → Redirigido a Flow
5. Usuario → Completa pago en Flow
6. Flow → POST /api/flow/confirm (webhook)
7. Aplicación → Crea orden en Supabase
8. Flow → Redirige usuario a /cart?payment=success
9. Usuario → Ve confirmación y es redirigido a perfil
```

## 🔒 Seguridad

### Firma HMAC

La integración usa firma HMAC SHA-256 para validar las peticiones:

- **Al crear pago**: Se firman todos los parámetros antes de enviar a Flow
- **Al confirmar pago**: Se verifica la firma recibida de Flow

### Variables de Entorno

- **NUNCA** commitees `.env.local` al repositorio
- **NUNCA** expongas `FLOW_SECRET_KEY` en el cliente
- Usa variables de entorno en Vercel/Netlify para producción

## 🐛 Solución de Problemas

### Error: "Flow no configurado"

**Causa**: Faltan las credenciales de Flow en `.env.local`

**Solución**: 
1. Verifica que `NEXT_PUBLIC_FLOW_API_KEY` y `FLOW_SECRET_KEY` estén configuradas
2. Reinicia el servidor de desarrollo: `npm run dev`

### Error: "Invalid signature"

**Causa**: La firma HMAC no coincide

**Solución**:
1. Verifica que `FLOW_SECRET_KEY` sea correcta
2. Asegúrate de que no haya espacios extra en las variables de entorno

### Error: "Flow API error"

**Causa**: Problema con la API de Flow

**Solución**:
1. Verifica que las credenciales sean correctas
2. Revisa que las URLs de confirmación y retorno estén configuradas en Flow
3. Verifica que estés usando el entorno correcto (sandbox vs producción)

### El pago se completa pero no se crea la orden

**Causa**: Error en el webhook de confirmación

**Solución**:
1. Revisa los logs del servidor
2. Verifica que `/api/flow/confirm` sea accesible públicamente
3. Verifica que Supabase esté configurado correctamente

## 📚 Recursos Adicionales

- [Documentación de Flow.cl](https://www.flow.cl/documentacion)
- [Panel de Administración Flow](https://www.flow.cl/admin)
- [Guía de Variables de Entorno](./GUIA_ENV_LOCAL.md)

## ✅ Checklist de Configuración

- [ ] Cuenta creada en Flow.cl
- [ ] Credenciales de API obtenidas
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Script de migración ejecutado en Supabase
- [ ] URLs configuradas en el panel de Flow
- [ ] Prueba de pago realizada exitosamente
- [ ] Variables de entorno configuradas en producción (Vercel/Netlify)

## 🚀 Producción

Cuando despliegues a producción:

1. **Configura las variables de entorno** en tu plataforma (Vercel, Netlify, etc.)
2. **Actualiza `NEXT_PUBLIC_BASE_URL`** con tu dominio real
3. **Configura las URLs en Flow** con tu dominio de producción
4. **Prueba un pago real** con una cantidad pequeña primero
5. **Monitorea los logs** para asegurar que todo funcione correctamente

---

¿Necesitas ayuda? Revisa los logs del servidor o consulta la documentación de Flow.cl

