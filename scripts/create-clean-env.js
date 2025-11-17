/**
 * Script para crear una versión limpia de .env.local en UTF-8
 */

const fs = require('fs')
const path = require('path')

const envPath = path.join(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.error('❌ No se encontró .env.local')
  process.exit(1)
}

// Leer el archivo como buffer y convertir de UTF-16 a UTF-8
const buffer = fs.readFileSync(envPath)
let content = ''

// Detectar si es UTF-16 (BOM: FE FF o FF FE)
if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
  // UTF-16 LE
  content = buffer.toString('utf16le')
} else if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
  // UTF-16 BE
  console.log('UTF-16 BE detectado, convirtiendo...')
  // Convertir manualmente
  let utf16le = Buffer.alloc(buffer.length)
  for (let i = 0; i < buffer.length - 1; i += 2) {
    utf16le[i] = buffer[i + 1]
    utf16le[i + 1] = buffer[i]
  }
  content = utf16le.toString('utf16le')
} else {
  // Intentar como UTF-8 primero
  try {
    content = buffer.toString('utf8')
  } catch {
    // Si falla, intentar UTF-16
    content = buffer.toString('utf16le')
  }
}

// Limpiar caracteres nulos
content = content.replace(/\u0000/g, '')

// Extraer variables
const lines = content.split('\n')
const cleanLines = []

lines.forEach(line => {
  let cleanLine = line.trim()
  
  // Saltar líneas vacías
  if (!cleanLine) return
  
  // Mantener comentarios
  if (cleanLine.startsWith('#')) {
    cleanLines.push(cleanLine)
    return
  }
  
  // Procesar variables
  const match = cleanLine.match(/^([A-Z_]+)\s*=\s*(.*)$/)
  if (match) {
    const varName = match[1]
    let varValue = match[2].trim()
    
    // Remover comillas
    if ((varValue.startsWith('"') && varValue.endsWith('"')) ||
        (varValue.startsWith("'") && varValue.endsWith("'"))) {
      varValue = varValue.slice(1, -1)
    }
    
    cleanLines.push(`${varName}=${varValue}`)
  }
})

// Crear contenido limpio
const cleanContent = cleanLines.join('\n') + '\n'

// Hacer backup
const backupPath = envPath + '.backup'
fs.writeFileSync(backupPath, buffer, 'binary')
console.log('✅ Backup creado: .env.local.backup')

// Guardar versión limpia en UTF-8
fs.writeFileSync(envPath, cleanContent, 'utf8')
console.log('✅ Archivo .env.local limpiado y convertido a UTF-8')

console.log('\n📝 Contenido del archivo limpio:')
console.log('='.repeat(50))
console.log(cleanContent)
console.log('='.repeat(50))

console.log('\n✅ Ahora puedes ejecutar: npm run check:env')





