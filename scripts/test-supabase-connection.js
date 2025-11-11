/**
 * Script para probar la conexión con Supabase
 * Ejecuta: node scripts/test-supabase-connection.js
 */

const fs = require('fs')
const path = require('path')

// Verificar que el archivo .env.local existe
const envPath = path.join(process.cwd(), '.env.local')
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: No se encontró el archivo .env.local')
  console.error('💡 Crea el archivo .env.local en la raíz del proyecto con tus credenciales')
  process.exit(1)
}

// Cargar variables de entorno
require('dotenv').config({ path: envPath })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno no configuradas')
  console.error('\n📋 Verifica que .env.local contenga:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=tu_url')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key')
  console.error('\n💡 Asegúrate de que:')
  console.error('   - No haya espacios alrededor del signo =')
  console.error('   - No haya comillas alrededor de los valores')
  console.error('   - El archivo esté en la raíz del proyecto')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔌 Probando conexión con Supabase...\n')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...\n')

  try {
    // Probar conexión básica
    console.log('1. Probando conexión básica...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (healthError) {
      console.error('❌ Error de conexión:', healthError.message)
      if (healthError.message.includes('relation "products" does not exist')) {
        console.error('\n💡 Solución: Ejecuta el script SQL en Supabase (supabase-schema.sql)')
      }
      return false
    }

    console.log('✅ Conexión exitosa!\n')

    // Probar lectura de productos
    console.log('2. Probando lectura de productos...')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5)

    if (productsError) {
      console.error('❌ Error al leer productos:', productsError.message)
      return false
    }

    console.log(`✅ Productos encontrados: ${products.length}`)
    if (products.length > 0) {
      console.log('\n📦 Primeros productos:')
      products.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - $${p.price}`)
      })
    } else {
      console.log('⚠️  No hay productos en la base de datos')
      console.log('💡 Ejecuta el script SQL para insertar productos de ejemplo')
    }

    console.log('\n✅ Todas las pruebas pasaron correctamente!')
    return true
  } catch (error) {
    console.error('❌ Error inesperado:', error.message)
    return false
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })

