/**
 * Script para diagnosticar y crear una versión limpia de .env.local
 */

const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró .env.local')
  process.exit(1)
}

console.log('🔍 Leyendo archivo .env.local...\n')

// Leer el archivo con diferentes codificaciones
let content = ''
try {
  // Intentar UTF-8 primero
  content = fs.readFileSync(envPath, 'utf8')
} catch (error) {
  try {
    // Intentar Latin1 si UTF-8 falla
    content = fs.readFileSync(envPath, 'latin1')
  } catch (error2) {
    console.error('❌ Error leyendo el archivo:', error2.message)
    process.exit(1)
  }
}

console.log('📄 Contenido del archivo (primeras líneas):')
const lines = content.split('\n').slice(0, 10)
lines.forEach((line, i) => {
  console.log(`${i + 1}: ${JSON.stringify(line)}`)
})

console.log('\n🔧 Extrayendo variables...\n')

// Extraer variables válidas
const variables = {}
const validLines = []

content.split('\n').forEach((line, index) => {
  // Limpiar la línea
  let cleanLine = line.trim()
  
  // Saltar líneas vacías y comentarios
  if (!cleanLine || cleanLine.startsWith('#')) {
    if (cleanLine.startsWith('#')) {
      validLines.push(cleanLine)
    }
    return
  }
  
  // Buscar patrón VARIABLE=valor
  const match = cleanLine.match(/^([A-Z_]+)=(.*)$/)
  if (match) {
    const varName = match[1]
    let varValue = match[2]
    
    // Remover comillas si las hay
    if ((varValue.startsWith('"') && varValue.endsWith('"')) ||
        (varValue.startsWith("'") && varValue.endsWith("'"))) {
      varValue = varValue.slice(1, -1)
    }
    
    // Remover espacios al inicio y final del valor
    varValue = varValue.trim()
    
    variables[varName] = varValue
    validLines.push(`${varName}=${varValue}`)
    
    console.log(`✅ ${varName}: ${varValue.substring(0, 30)}...`)
  } else {
    console.log(`⚠️  Línea ${index + 1} no reconocida: ${JSON.stringify(cleanLine)}`)
  }
})

console.log('\n📋 Variables encontradas:')
Object.keys(variables).forEach(key => {
  console.log(`   ${key}: ✅`)
})

// Crear archivo limpio
const cleanContent = validLines.join('\n')
const backupPath = envPath + '.backup'
const cleanPath = envPath + '.clean'

// Hacer backup
fs.writeFileSync(backupPath, content, 'utf8')
console.log(`\n💾 Backup creado: ${backupPath}`)

// Crear versión limpia
fs.writeFileSync(cleanPath, cleanContent, 'utf8')
console.log(`✨ Versión limpia creada: ${cleanPath}`)

console.log('\n📝 Contenido de la versión limpia:')
console.log('='.repeat(50))
console.log(cleanContent)
console.log('='.repeat(50))

console.log('\n💡 Para aplicar la versión limpia:')
console.log(`   1. Revisa ${cleanPath}`)
console.log(`   2. Si está bien, reemplaza .env.local con el contenido limpio`)
console.log(`   3. O ejecuta: copy ${cleanPath} .env.local`)




