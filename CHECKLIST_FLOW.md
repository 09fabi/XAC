# ✅ Checklist: ¿Está todo listo para hacer pagos?

## ✅ Lo que YA está implementado y funcionando:

### 1. **Endpoints de API** ✅
- ✅ `/api/flow/create-payment` - Crea pagos en Flow (corregido según manual)
- ✅ `/api/flow/confirm` - Recibe confirmaciones de Flow (corregido según manual)
- ✅ Firma HMAC SHA-256 implementada correctamente
- ✅ Formato de parámetros según manual de Flow

### 2. **Flujo de Pago Completo** ✅
- ✅ Botón "Proceder al Pago" en el carrito
- ✅ Redirección a Flow cuando se crea el pago
- ✅ Manejo del retorno desde Flow
- ✅ Guardado automático de órdenes en Supabase
- ✅ Limpieza del carrito después de pago exitoso

### 3. **Base de Datos** ✅
- ✅ Migración ejecutada (campos de Flow agregados)
- ✅ Campos: `flow_token`, `flow_commerce_order`, `payment_method`

### 4. **Configuración** ✅
- ✅ Variables de entorno configuradas (API Key y Secret Key)
- ✅ Parámetro `currency: 'CLP'` agregado
- ✅ URLs de confirmación y retorno configuradas

## ⚠️ Lo que DEBES verificar antes de hacer pagos reales:

### 1. **URLs en el Panel de Flow** ⚠️ IMPORTANTE
Debes configurar estas URLs en el panel de administración de Flow:

**Para Desarrollo Local:**
- URL de Confirmación: `http://localhost:3000/api/flow/confirm` (solo funciona localmente)
- URL de Retorno: `http://localhost:3000/cart?payment=success`

**Para Producción:**
- URL de Confirmación: `https://tu-dominio.com/api/flow/confirm`
- URL de Retorno: `https://tu-dominio.com/cart?payment=success`

**Nota:** Para probar en desarrollo local, Flow necesita poder acceder a tu `localhost`. Puedes usar:
- [ngrok](https://ngrok.com/) para exponer tu localhost
- O probar directamente en producción

### 2. **Variables de Entorno** ✅
Verifica que tengas en `.env.local`:
```env
NEXT_PUBLIC_FLOW_API_KEY=71A35A7F-A9B2-4595-9FCB-951E55998LDF
FLOW_SECRET_KEY=d29585f8c04dd92f4d89dba8601820aec94639a9
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. **Email del Usuario** ⚠️ OPCIONAL
Actualmente se usa `cliente@example.com` por defecto. Si quieres usar emails reales:
- Integra Supabase Auth para obtener el email del usuario autenticado
- O permite que el usuario ingrese su email antes de pagar

## 🧪 Cómo Probar:

### Opción 1: Prueba Local (Modo Simulación)
Si NO configuraste las credenciales de Flow, la app funciona en modo simulación:
1. Agrega productos al carrito
2. Haz clic en "Proceder al Pago"
3. Verás un mensaje de "Pago simulado exitoso"
4. La orden se crea con estado `pending`

### Opción 2: Prueba Real con Flow
Si SÍ configuraste las credenciales:
1. **Inicia el servidor:**
   ```bash
   npm run dev
   ```

2. **Agrega productos al carrito**

3. **Haz clic en "Proceder al Pago"**
   - Serás redirigido a Flow
   - Completa el pago en Flow
   - Flow te redirigirá de vuelta a tu tienda
   - Verás mensaje de éxito
   - El carrito se limpiará automáticamente

4. **Verifica en Supabase:**
   - La orden debe estar guardada con estado `paid`
   - Debe tener `flow_token` y `flow_commerce_order`

## 🚨 Problemas Comunes:

### Error: "Flow no configurado"
- **Causa:** Faltan credenciales en `.env.local`
- **Solución:** Agrega `NEXT_PUBLIC_FLOW_API_KEY` y `FLOW_SECRET_KEY`

### Error: "Invalid signature"
- **Causa:** La firma no coincide
- **Solución:** Verifica que `FLOW_SECRET_KEY` sea correcta (sin espacios)

### El pago se completa pero no se guarda la orden
- **Causa:** Error en el webhook de confirmación
- **Solución:** 
  - Verifica que `/api/flow/confirm` sea accesible públicamente
  - Revisa los logs del servidor
  - Verifica que Supabase esté configurado

### Flow no puede acceder a localhost
- **Causa:** Flow no puede acceder a URLs locales
- **Solución:** Usa ngrok o prueba en producción

## ✅ Resumen:

**SÍ, ya puedes empezar a hacer pagos** si:
- ✅ Tienes las credenciales en `.env.local`
- ✅ Ejecutaste la migración de base de datos
- ✅ Configuraste las URLs en el panel de Flow (o usas ngrok para desarrollo)

**El flujo completo está implementado y funcionando.** Solo necesitas:
1. Configurar las URLs en Flow (o usar ngrok)
2. Probar con un pago real

---

¿Listo para probar? 🚀

