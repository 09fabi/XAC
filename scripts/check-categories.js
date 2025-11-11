/**
 * Script para verificar categorías en Supabase
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno no configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkCategories() {
  console.log('🔍 Verificando categorías en Supabase...\n')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, category')

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`📦 Total de productos: ${products.length}\n`)
  console.log('📋 Productos y sus categorías:')
  products.forEach(p => {
    console.log(`   - ${p.name}: ${p.category || '(sin categoría)'}`)
  })

  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  console.log(`\n📊 Categorías únicas: ${categories.sort().join(', ')}`)

  const validCategories = ['POLERONES', 'POLERAS', 'PANTALONES', 'CHAQUETAS', 'CONJUNTOS']
  const invalid = categories.filter(c => !validCategories.includes(c))
  
  if (invalid.length > 0) {
    console.log(`\n⚠️  Categorías inválidas: ${invalid.join(', ')}`)
  } else {
    console.log('\n✅ Todas las categorías son válidas!')
  }
}

checkCategories()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('❌ Error:', error)
    process.exit(1)
  })


