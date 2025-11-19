import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product, useCart } from '@/context/CartContext'

export default function Store() {
  const router = useRouter()
  const { getTotalItems } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])

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
              stock: 15,
            },
            {
              id: '2',
              name: 'Polerón Oversize Gris',
              price: 34990,
              image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
              description: 'Polerón oversize cómodo y cálido',
              category: 'POLERONES',
              color: 'Gris',
              stock: 8,
            },
            {
              id: '3',
              name: 'Chaqueta Denim Clásica',
              price: 39990,
              image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
              description: 'Chaqueta denim versátil',
              category: 'CHAQUETAS',
              color: 'Azul',
              stock: 0,
            },
            {
              id: '4',
              name: 'Jeans Clásicos',
              price: 29990,
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
              description: 'Jeans de corte clásico',
              category: 'PANTALONES',
              color: 'Azul',
              stock: 12,
            },
            {
              id: '5',
              name: 'Conjunto Deportivo',
              price: 44990,
              image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
              description: 'Conjunto deportivo completo',
              category: 'CONJUNTOS',
              color: 'Negro',
              stock: 5,
            },
            {
              id: '6',
              name: 'Polera Estampada',
              price: 15990,
              image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400',
              description: 'Polera con estampado exclusivo',
              category: 'POLERAS',
              color: 'Blanco',
              stock: 20,
            },
            {
              id: '7',
              name: 'Polerón con Capucha',
              price: 37990,
              image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400',
              description: 'Polerón con capucha, abrigado',
              category: 'POLERONES',
              color: 'Negro',
              stock: 0,
            },
            {
              id: '8',
              name: 'Chaqueta Bomber',
              price: 42990,
              image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
              description: 'Chaqueta bomber moderna',
              category: 'CHAQUETAS',
              color: 'Negro',
              stock: 10,
            },
            {
              id: '9',
              name: 'Pantalón Cargo',
              price: 32990,
              image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
              description: 'Pantalón cargo funcional',
              category: 'PANTALONES',
              color: 'Verde',
              stock: 7,
            },
            {
              id: '10',
              name: 'Conjunto Casual',
              price: 49990,
              image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400',
              description: 'Conjunto casual elegante',
              category: 'CONJUNTOS',
              color: 'Beige',
              stock: 3,
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

  // Leer el parámetro category de la URL y aplicar el filtro
  useEffect(() => {
    if (router.isReady) {
      const categoryParam = router.query.category as string
      if (categoryParam) {
        setFilter(categoryParam)
      }
    }
  }, [router.isReady, router.query.category])

  const filteredProducts = products.filter((p) => {
    // Filtro por categoría
    const categoryMatch = filter === 'all' || p.category === filter
    
    // Filtro por disponibilidad (stock)
    const stockMatch = stockFilter === 'all' 
      ? true 
      : stockFilter === 'in-stock' 
        ? (p.stock ?? 0) > 0 
        : (p.stock ?? 0) === 0
    
    // Filtro por precio
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1]
    
    return categoryMatch && stockMatch && priceMatch
  })

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content="Explora nuestro catálogo completo de ropa" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        {/* Header con título XAC y botones */}
        <div className="relative w-full bg-white pt-4 pb-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Título XAC con botones de búsqueda, usuario y carrito */}
            <div className="relative flex items-center justify-center py-2">
              {/* Botón de búsqueda a la izquierda */}
              <button className="absolute left-0 p-2 text-black hover:opacity-70 transition-opacity duration-150">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>

              {/* Título XAC centrado */}
              <div className="flex-1 flex justify-center">
                <Link href="/">
                  <div className="text-black font-black tracking-tight uppercase cursor-pointer hover:opacity-70 transition-opacity duration-150" style={{ fontSize: 'clamp(3rem, 6vw, 3.5rem)' }}>
                    XAC
                  </div>
                </Link>
              </div>

              {/* Botones de usuario y carrito a la derecha */}
              <div className="absolute right-0 flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="p-2 text-black hover:opacity-70 transition-opacity duration-150"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </Link>
                <Link
                  href="/cart"
                  className="relative p-2 text-black hover:opacity-70 transition-opacity duration-150"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Navbar centrado debajo del título */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
            <Navbar textColor="black" borderColor="black" />
          </div>
        </div>

        <main className="flex-grow py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pl-0 lg:pr-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Barra lateral izquierda con filtros */}
              <aside className="w-full lg:w-64 flex-shrink-0 lg:-ml-4">
                <div className="sticky top-4 space-y-8">
                  {/* Título Recién llegado */}
                  <div>
                    <h2 className="text-xl font-semibold uppercase tracking-wide text-black mb-6">
                      Recién llegado
                    </h2>
                  </div>

                  {/* Disponibilidad */}
                  <div>
                    <h3 className="text-xs font-normal uppercase tracking-wider text-black mb-4">
                      Disponibilidad
                    </h3>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={stockFilter === 'in-stock'}
                          onChange={() => setStockFilter(stockFilter === 'in-stock' ? 'all' : 'in-stock')}
                          className="w-4 h-4 border-2 border-black rounded-sm appearance-none checked:bg-black checked:border-black transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                          style={{
                            backgroundImage: stockFilter === 'in-stock' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'white\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")' : 'none',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                        <span className="text-xs font-normal uppercase tracking-wider text-black group-hover:opacity-70 transition-opacity duration-300">
                          En stock
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={stockFilter === 'out-of-stock'}
                          onChange={() => setStockFilter(stockFilter === 'out-of-stock' ? 'all' : 'out-of-stock')}
                          className="w-4 h-4 border-2 border-black rounded-sm appearance-none checked:bg-black checked:border-black transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                          style={{
                            backgroundImage: stockFilter === 'out-of-stock' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'white\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")' : 'none',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }}
                        />
                        <span className="text-xs font-normal uppercase tracking-wider text-black group-hover:opacity-70 transition-opacity duration-300">
                          Sin stock
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Categorías */}
                  <div>
                    <h3 className="text-xs font-normal uppercase tracking-wider text-black mb-4">
                      Categorías
                    </h3>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={filter === 'all'}
                          onChange={() => setFilter('all')}
                          className="w-4 h-4 border-2 border-black rounded-full appearance-none checked:bg-black checked:border-black transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                          style={{
                            backgroundImage: filter === 'all' ? 'radial-gradient(circle, white 30%, transparent 30%)' : 'none'
                          }}
                        />
                        <span className="text-xs font-normal uppercase tracking-wider transition-all duration-300 group-hover:opacity-70 text-black">
                          Todas
                        </span>
                      </label>
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="category"
                            checked={filter === category}
                            onChange={() => setFilter(category)}
                            className="w-4 h-4 border-2 border-black rounded-full appearance-none checked:bg-black checked:border-black transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                            style={{
                              backgroundImage: filter === category ? 'radial-gradient(circle, white 30%, transparent 30%)' : 'none'
                            }}
                          />
                          <span className="text-xs font-normal uppercase tracking-wider transition-all duration-300 group-hover:opacity-70 text-black">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filtro de Precio */}
                  <div>
                    <h3 className="text-xs font-normal uppercase tracking-wider text-black mb-4">
                      Precio
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs text-black font-normal">
                        <span className="transition-all duration-300">${priceRange[0].toLocaleString('es-CL')}</span>
                        <span className="transition-all duration-300">${priceRange[1].toLocaleString('es-CL')}</span>
                      </div>
                      <div className="relative">
                        {/* Slider de rango doble */}
                        <div className="relative h-1 bg-gray-200 rounded-lg">
                          {/* Barra de rango seleccionado */}
                          <div 
                            className="absolute h-1 bg-black rounded-lg"
                            style={{
                              left: `${(priceRange[0] / 100000) * 100}%`,
                              width: `${((priceRange[1] - priceRange[0]) / 100000) * 100}%`
                            }}
                          />
                          {/* Input para el valor mínimo */}
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={priceRange[0]}
                            onChange={(e) => {
                              const newMin = parseInt(e.target.value)
                              if (newMin <= priceRange[1]) {
                                setPriceRange([newMin, priceRange[1]])
                              }
                            }}
                            className="absolute top-0 w-full h-1 bg-transparent appearance-none cursor-pointer z-10 range-slider"
                          />
                          {/* Input para el valor máximo */}
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={priceRange[1]}
                            onChange={(e) => {
                              const newMax = parseInt(e.target.value)
                              if (newMax >= priceRange[0]) {
                                setPriceRange([priceRange[0], newMax])
                              }
                            }}
                            className="absolute top-0 w-full h-1 bg-transparent appearance-none cursor-pointer z-10 range-slider"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Contenido principal con productos */}
              <div className="flex-1">
                {/* Lista de Productos */}
                {loading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Cargando productos...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No se encontraron productos con los filtros seleccionados.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

