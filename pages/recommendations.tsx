import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/context/CartContext'
import { useCart } from '@/context/CartContext'

export default function Recommendations() {
  const { cart } = useCart()
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [recommendationType, setRecommendationType] = useState<string>('category')

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        
        // Obtener productos del carrito para recomendaciones basadas en ellos
        const cartCategories = Array.from(
          new Set(cart.map((item) => item.category).filter(Boolean))
        )
        const cartColors = Array.from(
          new Set(cart.map((item) => item.color).filter(Boolean))
        )

        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: recommendationType,
            cartCategories,
            cartColors,
            cartItems: cart,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setRecommendations(data.recommendations || [])
        } else {
          // Mock recommendations basadas en el tipo
          const allProducts: Product[] = [
            {
              id: '1',
              name: 'Polera Básica Negra',
              price: 12990,
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
              description: 'Polera básica de algodón',
              category: 'POLERAS',
              color: 'Negro',
            },
            {
              id: '2',
              name: 'Jeans Clásicos',
              price: 29990,
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
              description: 'Jeans de corte clásico',
              category: 'PANTALONES',
              color: 'Azul',
            },
            {
              id: '3',
              name: 'Chaqueta Denim',
              price: 39990,
              image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
              description: 'Chaqueta denim versátil',
              category: 'CHAQUETAS',
              color: 'Azul',
            },
            {
              id: '4',
              name: 'Vestido Casual',
              price: 24990,
              image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
              description: 'Vestido casual y cómodo',
              category: 'CONJUNTOS',
              color: 'Rojo',
            },
            {
              id: '5',
              name: 'Camisa Formal Blanca',
              price: 19990,
              image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e0e6?w=400',
              description: 'Camisa formal para ocasiones especiales',
              category: 'POLERAS',
              color: 'Blanco',
            },
            {
              id: '6',
              name: 'Short Deportivo',
              price: 14990,
              image: 'https://images.unsplash.com/photo-1506629905607-cc2c0c8c8c0?w=400',
              description: 'Short cómodo para deportes',
              category: 'PANTALONES',
              color: 'Gris',
            },
          ]

          // Lógica simple de recomendación
          let filtered: Product[] = []
          if (recommendationType === 'category' && cartCategories.length > 0) {
            filtered = allProducts.filter((p) => cartCategories.includes(p.category || ''))
          } else if (recommendationType === 'color' && cartColors.length > 0) {
            filtered = allProducts.filter((p) => cartColors.includes(p.color || ''))
          } else {
            filtered = allProducts.slice(0, 4) // Productos destacados por defecto
          }

          setRecommendations(filtered.length > 0 ? filtered : allProducts.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [cart, recommendationType])

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content="Productos recomendados especialmente para ti" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Recomendaciones para Ti</h1>

            {/* Selector de tipo de recomendación */}
            <div className="mb-6 sm:mb-8">
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Filtrar por:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setRecommendationType('category')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                    recommendationType === 'category'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Por Categoría
                </button>
                <button
                  onClick={() => setRecommendationType('color')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                    recommendationType === 'color'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Por Color
                </button>
                <button
                  onClick={() => setRecommendationType('similar')}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors ${
                    recommendationType === 'similar'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Productos Similares
                </button>
              </div>
            </div>

            {/* Lista de recomendaciones */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Cargando recomendaciones...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  {cart.length === 0
                    ? 'Agrega productos a tu carrito para ver recomendaciones personalizadas'
                    : 'No hay recomendaciones disponibles en este momento'}
                </p>
                {cart.length === 0 && (
                  <Link href="/store" className="btn-primary inline-block">
                    Explorar Tienda
                  </Link>
                )}
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Basado en tus preferencias, te recomendamos estos productos:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {recommendations.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

