# 🔧 Configurar URLs en Supabase para Producción

## ⚠️ Problema Común

Si Google redirige a `localhost` en producción, es porque las URLs en Supabase están configuradas para desarrollo local.

## ✅ Solución: Configurar URLs en Supabase

### Paso 1: Ir a Configuración de URLs

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** → **Authentication** → **URL Configuration**

### Paso 2: Configurar Site URL

En **Site URL**, pon tu URL de producción:

```
https://xac-fawn.vercel.app
```

**⚠️ IMPORTANTE:**
- Debe ser `https://` (no `http://`)
- No debe terminar con `/`
- Debe ser tu URL real de Vercel

### Paso 3: Configurar Redirect URLs

En **Redirect URLs**, agrega **TODAS** estas URLs (una por línea):

```
https://xac-fawn.vercel.app/auth/callback
http://localhost:3000/auth/callback
https://xac-fawn.vercel.app/**
```

**Explicación:**
- Primera línea: URL de producción (Vercel)
- Segunda línea: URL de desarrollo local
- Tercera línea: Permite cualquier ruta en tu dominio de Vercel (útil para otras redirecciones)

### Paso 4: Guardar

Haz clic en **Save** y espera unos segundos.

## ✅ Verificación

Después de configurar:

1. Espera 1-2 minutos (puede tardar en actualizarse)
2. Prueba iniciar sesión en producción: `https://xac-fawn.vercel.app/auth/login`
3. Debería redirigir a `https://xac-fawn.vercel.app/auth/callback` (no a localhost)

## 📝 Notas

- **Site URL** es la URL base de tu aplicación
- **Redirect URLs** son las URLs permitidas para redirecciones después de autenticación
- Puedes tener múltiples URLs (una por línea)
- El orden no importa, pero es buena práctica poner producción primero

## 🐛 Si Aún Redirige a Localhost

1. Verifica que guardaste los cambios en Supabase
2. Espera 2-3 minutos (puede tardar en propagarse)
3. Limpia la caché del navegador (Ctrl+Shift+Delete)
4. Prueba en una ventana de incógnito

