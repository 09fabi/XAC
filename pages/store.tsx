import Head from 'next/head'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/context/CartContext'

export default function Store() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
          
          // Categorías fijas (nuevas categorías del negocio)
          const validCategories = ['POLERONES', 'POLERAS', 'PANTALONES', 'CHAQUETAS', 'CONJUNTOS']
          
          // Extraer categorías únicas de los productos, pero filtrar solo las válidas
          const uniqueCategories = Array.from(
            new Set(data.products?.map((p: Product) => p.category).filter(Boolean) || [])
          ).filter((cat): cat is string => typeof cat === 'string' && validCategories.includes(cat))
          
          // Si no hay categorías válidas, usar todas las válidas
          setCategories(uniqueCategories.length > 0 ? uniqueCategories : validCategories)
        } else {
          // Mock data si la API no está disponible
          const mockProducts: Product[] = [
            {
              id: '1',
              name: 'Polera Básica Negra',
              price: 12990,
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
              description: 'Polera básica de algodón 100%',
              category: 'POLERAS',
              color: 'Negro',
            },
            {
              id: '2',
              name: 'Polerón Oversize Gris',
              price: 34990,
              image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
              description: 'Polerón oversize cómodo y cálido',
              category: 'POLERONES',
              color: 'Gris',
            },
            {
              id: '3',
              name: 'Chaqueta Denim Clásica',
              price: 39990,
              image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
              description: 'Chaqueta denim versátil',
              category: 'CHAQUETAS',
              color: 'Azul',
            },
            {
              id: '4',
              name: 'Jeans Clásicos',
              price: 29990,
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
              description: 'Jeans de corte clásico',
              category: 'PANTALONES',
              color: 'Azul',
            },
            {
              id: '5',
              name: 'Conjunto Deportivo',
              price: 44990,
              image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
              description: 'Conjunto deportivo completo',
              category: 'CONJUNTOS',
              color: 'Negro',
            },
            {
              id: '6',
              name: 'Polera Estampada',
              price: 15990,
              image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
              description: 'Polera con estampado exclusivo',
              category: 'POLERAS',
              color: 'Blanco',
            },
            {
              id: '7',
              name: 'Polerón con Capucha',
              price: 37990,
              image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
              description: 'Polerón con capucha, abrigado',
              category: 'POLERONES',
              color: 'Negro',
            },
            {
              id: '8',
              name: 'Chaqueta Bomber',
              price: 42990,
              image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
              description: 'Chaqueta bomber moderna',
              category: 'CHAQUETAS',
              color: 'Negro',
            },
            {
              id: '9',
              name: 'Pantalón Cargo',
              price: 32990,
              image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
              description: 'Pantalón cargo funcional',
              category: 'PANTALONES',
              color: 'Verde',
            },
            {
              id: '10',
              name: 'Conjunto Casual',
              price: 49990,
              image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400',
              description: 'Conjunto casual elegante',
              category: 'CONJUNTOS',
              color: 'Beige',
            },
          ]
          setProducts(mockProducts)
          setCategories(['POLERONES', 'POLERAS', 'PANTALONES', 'CHAQUETAS', 'CONJUNTOS'])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter)

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content="Explora nuestro catálogo completo de ropa" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-black mb-12 uppercase tracking-tight">Tienda</h1>

            {/* Filtros */}
            <div className="mb-12 border-b-2 border-black pb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 border-2 ${
                    filter === 'all'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-black hover:bg-black hover:text-white'
                  }`}
                >
                  Todos
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 border-2 ${
                      filter === category
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Productos */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No se encontraron productos en esta categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

