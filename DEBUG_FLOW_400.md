# 🐛 Debug: Error 400 de Flow API

## Posibles Causas del Error 400

### 1. **Firma HMAC Incorrecta** ⚠️ MÁS COMÚN
**Síntoma:** Error 400 sin mensaje específico

**Causas posibles:**
- La `FLOW_SECRET_KEY` está incorrecta o tiene espacios
- El formato de la firma no coincide con lo que Flow espera
- Los parámetros no están ordenados correctamente

**Solución:**
1. Verifica que `FLOW_SECRET_KEY` en Vercel sea exactamente: `d29585f8c04dd92f4d89dba8601820aec94639a9`
2. No debe tener espacios antes o después
3. Asegúrate de que esté marcada para **Production**

### 2. **Monto con Decimales** ✅ CORREGIDO
**Síntoma:** Error 400 con mensaje "Amount can not contain decimals"

**Causa:** Flow no acepta decimales para CLP

**Solución:** Ya corregido - el código ahora redondea el monto a entero

### 3. **Monto Mínimo** ✅ CORREGIDO
**Síntoma:** Error 400 con mensaje "The minimum amount is 350 CLP"

**Causa:** Flow requiere un monto mínimo de $350 CLP

**Solución:** Ya corregido - el código valida el monto mínimo

### 4. **URLs Mal Formateadas**
**Síntoma:** Error 400 relacionado con URLs

**Causas posibles:**
- `NEXT_PUBLIC_BASE_URL` no está configurada o está mal
- Las URLs no usan HTTPS en producción
- Las URLs tienen caracteres especiales mal codificados

**Solución:**
1. Verifica que `NEXT_PUBLIC_BASE_URL` en Vercel sea tu URL completa:
   - ✅ Correcto: `https://tu-proyecto.vercel.app`
   - ❌ Incorrecto: `tu-proyecto.vercel.app` (sin https://)
   - ❌ Incorrecto: `http://tu-proyecto.vercel.app` (debe ser https)

### 5. **Email Inválido**
**Síntoma:** Error 400 relacionado con email

**Causa:** El email no tiene formato válido

**Solución:** El código usa `cliente@example.com` por defecto, que es válido

### 6. **Parámetros Faltantes**
**Síntoma:** Error 400 genérico

**Causa:** Falta algún parámetro requerido

**Parámetros requeridos según el manual:**
- ✅ apiKey
- ✅ commerceOrder
- ✅ subject
- ✅ amount
- ✅ email
- ✅ urlConfirmation
- ✅ urlReturn
- ✅ s (firma)

## 🔍 Cómo Debuggear

### Paso 1: Revisar los Logs de Vercel

1. Ve a tu proyecto en Vercel
2. Ve a **Deployments** → Selecciona el último deployment
3. Haz clic en **Functions** → Busca `/api/flow/create-payment`
4. Revisa los logs para ver el error exacto

### Paso 2: Verificar Variables de Entorno

En Vercel, verifica que estas variables estén configuradas:

```bash
NEXT_PUBLIC_FLOW_API_KEY=71A35A7F-A9B2-4595-9FCB-951E55998LDF
FLOW_SECRET_KEY=d29585f8c04dd92f4d89dba8601820aec94639a9
NEXT_PUBLIC_BASE_URL=https://tu-proyecto.vercel.app
```

**Importante:**
- No deben tener espacios
- No deben tener comillas
- `NEXT_PUBLIC_BASE_URL` debe usar HTTPS

### Paso 3: Probar con un Monto Mayor

Asegúrate de que el monto sea:
- ✅ Mayor o igual a $350 CLP
- ✅ Un número entero (sin decimales)

### Paso 4: Verificar las URLs en Flow

En el panel de Flow, verifica que las URLs estén configuradas:
- URL de Confirmación: `https://tu-proyecto.vercel.app/api/flow/confirm`
- URL de Retorno: `https://tu-proyecto.vercel.app/cart?payment=success`

## 🛠️ Solución Rápida

1. **Verifica las variables en Vercel:**
   - Settings → Environment Variables
   - Asegúrate de que las 3 variables estén correctas
   - Haz un **Redeploy** después de verificar

2. **Verifica el monto:**
   - Prueba con un monto de al menos $1000 CLP
   - Asegúrate de que no tenga decimales

3. **Revisa los logs:**
   - Los logs ahora muestran más información
   - Busca el mensaje de error específico de Flow

## 📝 Checklist de Verificación

- [ ] `FLOW_SECRET_KEY` está correcta (sin espacios)
- [ ] `NEXT_PUBLIC_BASE_URL` usa HTTPS
- [ ] `NEXT_PUBLIC_BASE_URL` es tu URL completa de Vercel
- [ ] El monto es >= $350 CLP
- [ ] El monto es un entero (sin decimales)
- [ ] Variables están marcadas para Production
- [ ] Se hizo un Redeploy después de agregar variables

## 🚨 Si el Error Persiste

1. **Revisa los logs de Vercel** para ver el mensaje exacto de Flow
2. **Comparte el error completo** que aparece en los logs
3. **Verifica en el panel de Flow** que tu cuenta esté activa y configurada

---

**Nota:** El código ahora tiene mejor logging. Después de hacer un nuevo despliegue, los logs mostrarán más información sobre qué está causando el error 400.

