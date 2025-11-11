import Head from 'next/head'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Order {
  id: string
  date: string
  total: number
  items: number
  status: string
}

export default function Profile() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simular carga de datos del usuario
    // En producción, esto vendría de Supabase Auth
    setUser({
      name: 'Usuario Demo',
      email: 'usuario@example.com',
    })

    // Cargar historial de pedidos
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        } else {
          // Mock data
          setOrders([
            {
              id: '1',
              date: new Date().toISOString(),
              total: 42980,
              items: 2,
              status: 'Completado',
            },
            {
              id: '2',
              date: new Date(Date.now() - 86400000 * 7).toISOString(),
              total: 29990,
              items: 1,
              status: 'Completado',
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchOrders()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content="Gestiona tu perfil y revisa tu historial de pedidos" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

            {/* Información del Usuario */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
              {user ? (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Nombre: </span>
                    <span className="text-gray-900">{user.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email: </span>
                    <span className="text-gray-900">{user.email}</span>
                  </div>
                  <button className="btn-secondary mt-4">
                    Editar Perfil
                  </button>
                </div>
              ) : (
                <p className="text-gray-600">Cargando información...</p>
              )}
            </div>

            {/* Historial de Pedidos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Historial de Pedidos</h2>
              {orders.length === 0 ? (
                <p className="text-gray-600">No tienes pedidos aún.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary-600">
                            {formatPrice(order.total)}
                          </p>
                          <p className="text-sm text-gray-600">{order.items} artículo(s)</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm ${
                            order.status === 'Completado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

