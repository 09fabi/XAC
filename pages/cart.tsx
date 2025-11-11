import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartItem from '@/components/CartItem'
import { useCart } from '@/context/CartContext'

export default function Cart() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price)
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Tu carrito está vacío')
      return
    }

    try {
      // Redirigir a la API de Flow para procesar el pago
      const response = await fetch('/api/flow/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getTotalPrice(),
          items: cart,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // En producción, redirigir a la URL de Flow
        if (data.url) {
          window.location.href = data.url
        } else {
          // Guardar orden en Supabase antes de limpiar el carrito
          try {
            const orderResponse = await fetch('/api/orders/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                total: getTotalPrice(),
                items: cart,
              }),
            })
            
            if (orderResponse.ok) {
              console.log('Orden guardada exitosamente en Supabase')
            }
          } catch (error) {
            console.error('Error al guardar orden:', error)
          }
          
          alert('Pago simulado exitoso. En producción, serías redirigido a Flow.')
          clearCart()
          router.push('/profile')
        }
      } else {
        alert('Error al procesar el pago. Por favor, intenta nuevamente.')
      }
    } catch (error) {
      console.error('Error during checkout:', error)
      alert('Error al procesar el pago. Por favor, intenta nuevamente.')
    }
  }

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content="Revisa los productos en tu carrito" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-black mb-12 uppercase tracking-tight">Carrito</h1>

            {cart.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-32 h-32 border-2 border-black mx-auto mb-8 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm uppercase tracking-wider mb-8">Tu carrito está vacío</p>
                <button
                  onClick={() => router.push('/store')}
                  className="btn-primary"
                >
                  Explorar Tienda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de productos */}
                <div className="lg:col-span-2 space-y-4">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={clearCart}
                      className="text-sm text-gray-600 hover:text-black uppercase tracking-wide font-medium border-b-2 border-transparent hover:border-black transition-all duration-300"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>

                {/* Resumen */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-8 border-2 border-black sticky top-24">
                    <h2 className="text-xl font-bold mb-6 uppercase tracking-wide">Resumen</h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-600 uppercase tracking-wide">Subtotal:</span>
                        <span className="font-bold">{formatPrice(getTotalPrice())}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-sm text-gray-600 uppercase tracking-wide">Envío:</span>
                        <span className="font-bold">Gratis</span>
                      </div>
                      <div className="border-t-2 border-black pt-4">
                        <div className="flex justify-between text-lg font-black">
                          <span className="uppercase tracking-wide">Total:</span>
                          <span className="text-black">{formatPrice(getTotalPrice())}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full btn-primary py-4 text-sm mb-3"
                    >
                      Proceder al Pago
                    </button>
                    <button
                      onClick={() => router.push('/store')}
                      className="w-full btn-secondary py-4 text-sm"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

