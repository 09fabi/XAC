import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'
import { Product } from '@/context/CartContext'
import { useAlert } from '@/context/AlertContext'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const { addToCart, getTotalItems } = useCart()
  const { showSuccess, showWarning } = useAlert()
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
        showWarning('Por favor selecciona una talla')
        return
      }
      const productWithSize = { ...product, selectedSize }
      addToCart(productWithSize, quantity)
      showSuccess('Producto agregado al carrito')
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
        <Head>
          <title>XAC</title>
        </Head>
        <div className="min-h-screen flex flex-col bg-white">
          <div className="relative w-full bg-white pt-4 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-center py-2">
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
                <div className="flex-1 flex justify-center">
                  <Link href="/">
                    <div className="text-black font-black tracking-tight uppercase cursor-pointer hover:opacity-70 transition-opacity duration-150" style={{ fontSize: 'clamp(3rem, 6vw, 3.5rem)' }}>
                      XAC
                    </div>
                  </Link>
                </div>
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
          </div>
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Cargando producto...</p>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Head>
          <title>XAC</title>
        </Head>
        <div className="min-h-screen flex flex-col bg-white">
          <div className="relative w-full bg-white pt-4 pb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-center py-2">
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
                <div className="flex-1 flex justify-center">
                  <Link href="/">
                    <div className="text-black font-black tracking-tight uppercase cursor-pointer hover:opacity-70 transition-opacity duration-150" style={{ fontSize: 'clamp(3rem, 6vw, 3.5rem)' }}>
                      XAC
                    </div>
                  </Link>
                </div>
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
          </div>
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
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content={product.description || product.name} />
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
        </div>

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
