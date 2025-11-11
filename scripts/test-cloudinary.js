/**
 * Script para probar la conexión con Cloudinary
 * Ejecuta: node scripts/test-cloudinary.js
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

const cloudinary = require('cloudinary').v2

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Error: Variables de entorno de Cloudinary no configuradas')
  console.error('\n📋 Verifica que .env.local contenga:')
  console.error('   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name')
  console.error('   CLOUDINARY_API_KEY=tu_api_key')
  console.error('   CLOUDINARY_API_SECRET=tu_api_secret')
  console.error('\n💡 Asegúrate de que:')
  console.error('   - No haya espacios alrededor del signo =')
  console.error('   - No haya comillas alrededor de los valores')
  console.error('   - El archivo esté en la raíz del proyecto')
  console.error('\n🔍 Variables encontradas:')
  console.error('   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', cloudName ? '✅' : '❌')
  console.error('   CLOUDINARY_API_KEY:', apiKey ? '✅' : '❌')
  console.error('   CLOUDINARY_API_SECRET:', apiSecret ? '✅' : '❌')
  process.exit(1)
}

// Configurar Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

async function testConnection() {
  console.log('☁️  Probando conexión con Cloudinary...\n')
  console.log('Cloud Name:', cloudName)
  console.log('API Key:', apiKey.substring(0, 10) + '...\n')

  try {
    // Probar conexión básica
    console.log('1. Probando conexión básica...')
    const result = await cloudinary.api.ping()
    
    if (result.status === 'ok') {
      console.log('✅ Conexión exitosa!\n')
    } else {
      console.error('❌ Error de conexión:', result)
      return false
    }

    // Probar subida de imagen de prueba
    console.log('2. Probando subida de imagen de prueba...')
    const testImageUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
    
    const uploadResult = await cloudinary.uploader.upload(testImageUrl, {
      folder: 'xulerialcorte/test',
      public_id: 'test-connection',
      overwrite: true,
    })

    console.log('✅ Imagen de prueba subida exitosamente!')
    console.log('   URL:', uploadResult.secure_url)
    console.log('   Public ID:', uploadResult.public_id)
    console.log('   Tamaño:', uploadResult.width + 'x' + uploadResult.height)
    console.log('   Formato:', uploadResult.format)

    // Limpiar imagen de prueba
    console.log('\n3. Limpiando imagen de prueba...')
    await cloudinary.uploader.destroy('xulerialcorte/test/test-connection')
    console.log('✅ Imagen de prueba eliminada')

    console.log('\n✅ Todas las pruebas pasaron correctamente!')
    console.log('\n💡 Cloudinary está listo para usar en tu proyecto.')
    return true
  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.message.includes('Invalid API Key')) {
      console.error('\n💡 Solución: Verifica que las credenciales sean correctas')
    } else if (error.message.includes('Invalid signature')) {
      console.error('\n💡 Solución: Verifica que el API Secret sea correcto')
    }
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

