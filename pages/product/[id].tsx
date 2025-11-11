import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { Product } from '@/context/CartContext'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string>('')
  
  const SIZES = ['S', 'M', 'L', 'XL', '2XL']

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          // Mock data si la API no está disponible
          const mockProducts: { [key: string]: Product } = {
            '1': {
              id: '1',
              name: 'Polera Básica Negra',
              price: 12990,
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
              description: 'Polera básica de algodón 100%, perfecta para el día a día. Cómoda, suave y duradera. Disponible en varios colores.',
              category: 'POLERAS',
              color: 'Negro',
              stock: 50,
            },
            '2': {
              id: '2',
              name: 'Jeans Clásicos',
              price: 29990,
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
              description: 'Jeans de corte clásico, cómodos y duraderos. Hechos con denim de alta calidad.',
              category: 'PANTALONES',
              color: 'Azul',
              stock: 30,
            },
          }
          setProduct(mockProducts[id as string] || null)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      if (!selectedSize) {
        alert('Por favor selecciona una talla')
        return
      }
      const productWithSize = { ...product, selectedSize }
      addToCart(productWithSize, quantity)
      alert('Producto agregado al carrito')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Cargando producto...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Producto no encontrado</p>
            <button
              onClick={() => router.push('/store')}
              className="btn-primary"
            >
              Volver a la Tienda
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content={product.description || product.name} />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="text-black hover:text-gray-600 mb-8 flex items-center text-sm uppercase tracking-wide"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Imagen */}
              <div className="relative w-full h-96 lg:h-[600px] bg-gray-100 overflow-hidden border-2 border-black">
                <Image
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Información */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tight">{product.name}</h1>
                <p className="text-3xl font-black text-black mb-8">
                  {formatPrice(product.price)}
                </p>

                {product.description && (
                  <p className="text-gray-600 mb-8 text-sm uppercase tracking-wide leading-relaxed">{product.description}</p>
                )}

                {/* Selector de Tallas - Estilo BANG GANG */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-4 uppercase tracking-wider">Talla:</label>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 border-2 border-black text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                          selectedSize === size
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selector de cantidad */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-4 uppercase tracking-wider">Cantidad:</label>
                  <div className="flex items-center border-2 border-black w-fit">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-6 py-3 hover:bg-black hover:text-white transition-all duration-300 font-medium"
                    >
                      −
                    </button>
                    <span className="px-8 py-3 font-bold border-x-2 border-black">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-6 py-3 hover:bg-black hover:text-white transition-all duration-300 font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Botón agregar al carrito */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !selectedSize}
                  className={`w-full py-4 text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                    product.stock === 0 || !selectedSize
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                      : 'btn-primary'
                  }`}
                >
                  {product.stock === 0 ? 'Agotado' : !selectedSize ? 'Selecciona una talla' : 'Añadir al carrito'}
                </button>

                {product.stock !== undefined && product.stock > 0 && (
                  <p className="text-xs text-gray-600 mt-4 uppercase tracking-wide">
                    Stock disponible: {product.stock} unidades
                  </p>
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

