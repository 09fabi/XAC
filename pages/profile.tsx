import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ProfilePage() {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  // Manejar cerrar sesión (solo UI, sin funcionalidad)
  const handleSignOut = async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      setSigningOut(true)
      // TODO: Implementar logout
      console.log('Logout')
      setTimeout(() => {
        setSigningOut(false)
        router.push('/')
      }, 1000)
    }
  }

  // Datos de ejemplo para el diseño
  const userName = 'Usuario Ejemplo'
  const userEmail = 'usuario@email.com'
  const memberSince = '1 de enero de 2024'
  const authMethod = 'Email y Contraseña'

  return (
    <>
      <Head>
        <title>Mi Perfil - XAC</title>
        <meta name="description" content="Tu perfil de usuario en XAC" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navbar textColor="white" borderColor="white" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Título */}
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-12 text-center">
            Mi Perfil
          </h1>

          {/* Información del usuario */}
          <div className="bg-transparent border-2 border-white p-8 mb-8">
            <div className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2 text-gray-400">
                  Nombre
                </label>
                <p className="text-xl font-semibold">{userName}</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2 text-gray-400">
                  Email
                </label>
                <p className="text-xl font-semibold">{userEmail}</p>
              </div>

              {/* Fecha de registro */}
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2 text-gray-400">
                  Miembro desde
                </label>
                <p className="text-xl font-semibold">{memberSince}</p>
              </div>

              {/* Método de autenticación */}
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2 text-gray-400">
                  Método de autenticación
                </label>
                <p className="text-xl font-semibold">{authMethod}</p>
              </div>
            </div>
          </div>

          {/* Sección de órdenes (placeholder para futuro) */}
          <div className="bg-transparent border-2 border-white p-8 mb-8">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6">
              Mis Órdenes
            </h2>
            <p className="text-gray-400">
              Tus órdenes aparecerán aquí próximamente.
            </p>
          </div>

          {/* Botón de cerrar sesión */}
          <div className="flex justify-center">
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="bg-transparent border-2 border-white text-white px-8 py-4 font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
            </button>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
