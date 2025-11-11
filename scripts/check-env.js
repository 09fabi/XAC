/**
 * Script para verificar las variables de entorno
 * Ejecuta: node scripts/check-env.js
 */

const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env.local')

console.log('🔍 Verificando configuración de variables de entorno...\n')

if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró el archivo .env.local')
  console.error('💡 Crea el archivo .env.local en la raíz del proyecto')
  process.exit(1)
}

console.log('✅ Archivo .env.local encontrado\n')

// Cargar variables
require('dotenv').config({ path: envPath })

// Función para mostrar el estado de una variable (sin mostrar el valor completo)
function checkVar(name, value, required = true) {
  const status = value ? '✅' : '❌'
  const preview = value 
    ? (value.length > 20 ? value.substring(0, 20) + '...' : value)
    : 'NO CONFIGURADA'
  
  if (required && !value) {
    console.log(`   ${status} ${name}: ${preview}`)
    return false
  } else {
    console.log(`   ${status} ${name}: ${preview}`)
    return true
  }
}

console.log('📋 SUPABASE:')
const supabaseOk = 
  checkVar('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  checkVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

console.log('\n☁️  CLOUDINARY:')
const cloudinaryOk =
  checkVar('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME) &&
  checkVar('CLOUDINARY_API_KEY', process.env.CLOUDINARY_API_KEY) &&
  checkVar('CLOUDINARY_API_SECRET', process.env.CLOUDINARY_API_SECRET)

console.log('\n💳 FLOW (opcional):')
checkVar('NEXT_PUBLIC_FLOW_API_KEY', process.env.NEXT_PUBLIC_FLOW_API_KEY, false)

console.log('\n' + '='.repeat(50))

if (supabaseOk && cloudinaryOk) {
  console.log('\n✅ Todas las variables requeridas están configuradas!')
  console.log('\n💡 Puedes probar las conexiones con:')
  console.log('   npm run test:supabase')
  console.log('   npm run test:cloudinary')
  process.exit(0)
} else {
  console.log('\n❌ Faltan algunas variables requeridas')
  console.log('\n💡 Asegúrate de que .env.local tenga el formato correcto:')
  console.log('   VARIABLE=valor')
  console.log('   (sin espacios alrededor del =)')
  console.log('   (sin comillas alrededor de los valores)')
  process.exit(1)
}




