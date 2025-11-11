/**
 * Script para agregar productos a Supabase
 * Uso: node scripts/add-products.js
 * 
 * Edita el array de productos abajo con tus datos
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.error('   Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// EDITA ESTE ARRAY CON TUS PRODUCTOS
// ============================================
const productos = [
  {
    name: 'Polera Básica Negra',
    price: 12990,
    image_url: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/products/polera-negra.jpg',
    description: 'Polera básica de algodón 100%, perfecta para el día a día. Cómoda, suave y duradera.',
    category: 'POLERAS', // Debe ser: POLERONES, POLERAS, PANTALONES, CHAQUETAS, o CONJUNTOS
    color: 'Negro',
    stock: 50,
    featured: true, // true si quieres que aparezca en la página principal
  },
  // Agrega más productos aquí...
  // {
  //   name: 'Polerón Oversize Gris',
  //   price: 34990,
  //   image_url: 'https://res.cloudinary.com/TU_CLOUD_NAME/image/upload/v1234567890/products/poleron-gris.jpg',
  //   description: 'Polerón oversize cómodo y cálido, perfecto para el invierno.',
  //   category: 'POLERONES',
  //   color: 'Gris',
  //   stock: 30,
  //   featured: true,
  // },
]

// Validar categorías
const validCategories = ['POLERONES', 'POLERAS', 'PANTALONES', 'CHAQUETAS', 'CONJUNTOS']

async function addProducts() {
  console.log('🔄 Agregando productos a Supabase...\n')

  if (productos.length === 0) {
    console.error('❌ No hay productos para agregar. Edita el array "productos" en el script.')
    process.exit(1)
  }

  // Validar productos antes de insertar
  const invalidProducts = productos.filter(p => !validCategories.includes(p.category))
  if (invalidProducts.length > 0) {
    console.error('❌ Error: Algunos productos tienen categorías inválidas:')
    invalidProducts.forEach(p => {
      console.error(`   - ${p.name}: "${p.category}" (debe ser una de: ${validCategories.join(', ')})`)
    })
    process.exit(1)
  }

  try {
    let successCount = 0
    let errorCount = 0

    for (const producto of productos) {
      console.log(`\n📦 Agregando: ${producto.name}...`)
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: producto.name,
          price: producto.price,
          image_url: producto.image_url,
          description: producto.description || null,
          category: producto.category,
          color: producto.color || null,
          stock: producto.stock || 0,
          featured: producto.featured || false,
        })
        .select()
        .single()

      if (error) {
        console.error(`   ❌ Error: ${error.message}`)
        errorCount++
      } else {
        console.log(`   ✅ Producto agregado exitosamente (ID: ${data.id})`)
        successCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ ${successCount} producto(s) agregado(s) exitosamente`)
    if (errorCount > 0) {
      console.log(`❌ ${errorCount} producto(s) con error(es)`)
    }
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Error fatal:', error.message)
    process.exit(1)
  }
}

addProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })


