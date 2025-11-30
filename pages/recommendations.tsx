import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/context/CartContext'
import { useCart } from '@/context/CartContext'
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Recommendations() {
  const { cart, getTotalItems } = useCart()
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
          } else if (recommendationType === 'similar' && cart.length > 0) {
            const cartProductIds = cart.map((item) => item.id)
            const cartCats = cart.map((item) => item.category).filter(Boolean)
            filtered = allProducts.filter(
              (p) => p.category && cartCats.includes(p.category) && !cartProductIds.includes(p.id)
            )
          } else {
            filtered = allProducts.slice(0, 4) // Productos destacados por defecto
          }

          setRecommendations(filtered.length > 0 ? filtered : allProducts.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        // En caso de error, mostrar productos destacados
        setRecommendations([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [cart, recommendationType])

  return (
    <>
      <Head>
        <title>XAC - Recomendaciones</title>
        <meta name="description" content="Productos recomendados especialmente para ti" />
      </Head>

      <div className="min-h-screen flex flex-col bg-white">
        {/* Header con título XAC y botones - Mismo diseño que store */}
        <div className="relative w-full bg-white pt-3 sm:pt-4 pb-3 sm:pb-4">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            {/* Título XAC con botones de búsqueda, usuario y carrito */}
            <div className="relative flex items-center justify-center py-2">
              {/* Botón de búsqueda a la izquierda */}
              <button className="absolute left-0 p-1.5 sm:p-2 text-black hover:opacity-70 transition-opacity duration-150">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
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
                  <div className="text-black font-black tracking-tight uppercase cursor-pointer hover:opacity-70 transition-opacity duration-150" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                    XAC
                  </div>
                </Link>
              </div>

              {/* Botones de autenticación y carrito a la derecha */}
              <div className="absolute right-0 flex items-center space-x-1.5 sm:space-x-2">
                {/* Autenticación: UserButton si está logueado, iconos de sign-in/sign-up si no */}
                <SignedIn>
                  <UserButton 
                    afterSignOutUrl="/" 
                    appearance={{
                      elements: {
                        avatarBox: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8",
                      },
                    }}
                  />
                </SignedIn>
                <SignedOut>
                  {/* Icono de registrarse */}
                  <Link
                    href="/sign-up"
                    className="p-1.5 sm:p-2 text-black hover:opacity-70 transition-opacity duration-150"
                    title="Registrarse"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                      />
                    </svg>
                  </Link>

                  {/* Icono de iniciar sesión */}
                  <Link
                    href="/sign-in"
                    className="p-1.5 sm:p-2 text-black hover:opacity-70 transition-opacity duration-150"
                    title="Iniciar sesión"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                      />
                    </svg>
                  </Link>
                </SignedOut>

                {/* Icono de carrito */}
                <Link
                  href="/cart"
                  className="relative p-1.5 sm:p-2 text-black hover:opacity-70 transition-opacity duration-150"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
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
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-black text-white text-[9px] sm:text-[10px] font-medium w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center rounded-full">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
          
          {/* Navbar centrado debajo del título */}
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mt-2">
            <Navbar textColor="black" borderColor="black" />
          </div>
        </div>

        <main className="flex-grow py-6 sm:py-8 md:py-12 bg-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            {/* Título de la página */}
            <div className="mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black mb-2">
                Recomendaciones
              </h1>
              <p className="text-sm sm:text-base text-black opacity-70 uppercase tracking-wider">
                Productos seleccionados especialmente para ti
              </p>
            </div>

            {/* Selector de tipo de recomendación - Estilo minimalista */}
            <div className="mb-8 sm:mb-12">
              <h2 className="text-xs font-normal uppercase tracking-wider text-black mb-4">
                Filtrar por
              </h2>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="recommendationType"
                    checked={recommendationType === 'category'}
                    onChange={() => setRecommendationType('category')}
                    className="w-4 h-4 border-2 border-black rounded-full appearance-none checked:bg-black checked:border-black transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    style={{
                      backgroundImage: recommendationType === 'category' ? 'radial-gradient(circle, white 30%, transparent 30%)' : 'none'
                    }}
                  />
                  <span className="text-xs font-normal uppercase tracking-wider transition-all duration-300 group-hover:opacity-70 text-black">
                    Por Categoría
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="recommendationType"
                    checked={recommendationType === 'color'}
                    onChange={() => setRecommendationType('color')}
                    className="w-4 h-4 border-2 border-black rounded-full appearance-none checked:bg-black checked:border-black transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    style={{
                      backgroundImage: recommendationType === 'color' ? 'radial-gradient(circle, white 30%, transparent 30%)' : 'none'
                    }}
                  />
                  <span className="text-xs font-normal uppercase tracking-wider transition-all duration-300 group-hover:opacity-70 text-black">
                    Por Color
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="recommendationType"
                    checked={recommendationType === 'similar'}
                    onChange={() => setRecommendationType('similar')}
                    className="w-4 h-4 border-2 border-black rounded-full appearance-none checked:bg-black checked:border-black transition-all duration-300 relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    style={{
                      backgroundImage: recommendationType === 'similar' ? 'radial-gradient(circle, white 30%, transparent 30%)' : 'none'
                    }}
                  />
                  <span className="text-xs font-normal uppercase tracking-wider transition-all duration-300 group-hover:opacity-70 text-black">
                    Productos Similares
                  </span>
                </label>
              </div>
            </div>

            {/* Lista de recomendaciones */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-black opacity-70 uppercase tracking-wider">Cargando recomendaciones...</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12 border-2 border-black bg-white p-8 sm:p-12">
                <p className="text-black mb-4 uppercase tracking-wider text-sm sm:text-base">
                  {cart.length === 0
                    ? 'Agrega productos a tu carrito para ver recomendaciones personalizadas'
                    : 'No hay recomendaciones disponibles en este momento'}
                </p>
                {cart.length === 0 && (
                  <Link 
                    href="/store" 
                    className="inline-block bg-black text-white px-6 sm:px-8 py-3 sm:py-4 font-medium tracking-wider uppercase text-xs sm:text-sm border-2 border-black hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Explorar Tienda
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="mb-6 sm:mb-8">
                  <p className="text-xs sm:text-sm text-black opacity-70 uppercase tracking-wider">
                    {recommendationType === 'category' && 'Basado en las categorías de tu carrito'}
                    {recommendationType === 'color' && 'Basado en los colores de tu carrito'}
                    {recommendationType === 'similar' && 'Productos similares a los de tu carrito'}
                    {cart.length === 0 && 'Productos destacados'}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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

