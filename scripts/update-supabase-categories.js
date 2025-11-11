/**
 * Script para actualizar las categorías en Supabase
 * Ejecuta: node scripts/update-supabase-categories.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mapeo de categorías antiguas a nuevas
const categoryMapping = {
  'Vestidos': 'CONJUNTOS',
  'Camisas': 'POLERAS',
  'Shorts': 'PANTALONES',
  // Mantener las que ya están correctas
  'Poleras': 'POLERAS',
  'POLERAS': 'POLERAS',
  'Polerones': 'POLERONES',
  'POLERONES': 'POLERONES',
  'Pantalones': 'PANTALONES',
  'PANTALONES': 'PANTALONES',
  'Chaquetas': 'CHAQUETAS',
  'CHAQUETAS': 'CHAQUETAS',
  'Conjuntos': 'CONJUNTOS',
  'CONJUNTOS': 'CONJUNTOS',
}

// Categorías válidas (orden específico requerido)
const validCategories = ['POLERONES', 'POLERAS', 'PANTALONES', 'CHAQUETAS', 'CONJUNTOS']

async function updateCategories() {
  console.log('🔄 Actualizando categorías en Supabase...\n')

  try {
    // 1. Obtener todos los productos
    console.log('1. Obteniendo productos...')
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')

    if (fetchError) {
      console.error('❌ Error al obtener productos:', fetchError.message)
      return false
    }

    console.log(`✅ ${products.length} productos encontrados\n`)

    // 2. Verificar categorías actuales
    const currentCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
    console.log('📋 Categorías actuales:', currentCategories.join(', '))

    // 3. Actualizar productos con categorías antiguas
    console.log('\n2. Actualizando categorías...')
    let updated = 0

    // Actualizar por lotes usando CASE en SQL
    const updates = []
    
    // Actualizar categorías específicas
    const categoryUpdates = [
      { old: 'Vestidos', new: 'CONJUNTOS' },
      { old: 'Camisas', new: 'POLERAS' },
      { old: 'Shorts', new: 'PANTALONES' },
      { old: 'Poleras', new: 'POLERAS' },
      { old: 'Polerones', new: 'POLERONES' },
      { old: 'Pantalones', new: 'PANTALONES' },
      { old: 'Chaquetas', new: 'CHAQUETAS' },
      { old: 'Conjuntos', new: 'CONJUNTOS' },
    ]

    for (const { old, new: newCat } of categoryUpdates) {
      const { data, error } = await supabase
        .from('products')
        .update({ category: newCat })
        .eq('category', old)
        .select()

      if (error) {
        console.error(`❌ Error actualizando ${old}:`, error.message)
      } else if (data && data.length > 0) {
        updated += data.length
        data.forEach(p => {
          console.log(`   ✅ ${p.name}: ${old} → ${newCat}`)
        })
      }
    }

    // Actualizar productos sin categoría
    const { data: noCategory, error: noCatError } = await supabase
      .from('products')
      .update({ category: 'POLERAS' })
      .is('category', null)
      .select()

    if (!noCatError && noCategory && noCategory.length > 0) {
      updated += noCategory.length
      noCategory.forEach(p => {
        console.log(`   ✅ ${p.name}: (sin categoría) → POLERAS`)
      })
    }

    // Actualizar cualquier categoría inválida restante a POLERAS
    const { data: allProducts } = await supabase
      .from('products')
      .select('id, name, category')

    for (const product of allProducts || []) {
      if (product.category && !validCategories.includes(product.category)) {
        const { error } = await supabase
          .from('products')
          .update({ category: 'POLERAS' })
          .eq('id', product.id)

        if (!error) {
          updated++
          console.log(`   ✅ ${product.name}: ${product.category} → POLERAS`)
        }
      }
    }

    console.log(`\n✅ ${updated} productos actualizados`)

    // 4. Verificar categorías finales
    console.log('\n3. Verificando categorías finales...')
    const { data: finalProducts } = await supabase
      .from('products')
      .select('category')

    const finalCategories = Array.from(new Set(finalProducts.map(p => p.category).filter(Boolean)))
    console.log('📋 Categorías finales:', finalCategories.sort().join(', '))

    // 5. Verificar que todas sean válidas
    const invalidCategories = finalCategories.filter(cat => !validCategories.includes(cat))
    if (invalidCategories.length > 0) {
      console.log(`\n⚠️  Categorías inválidas encontradas: ${invalidCategories.join(', ')}`)
    } else {
      console.log('\n✅ Todas las categorías son válidas!')
    }

    return true
  } catch (error) {
    console.error('❌ Error:', error.message)
    return false
  }
}

updateCategories()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Actualización completada!')
    }
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error)
    process.exit(1)
  })

