import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'

interface NavbarProps {
  textColor?: 'white' | 'black'
  borderColor?: 'white' | 'black'
}

const Navbar = ({ textColor = 'white', borderColor = 'white' }: NavbarProps) => {
  const router = useRouter()
  const { user, signOut, loading } = useAuth()

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/store', label: 'Tienda' },
    { href: '/recommendations', label: 'Recomendaciones' },
  ]

  const textColorClass = textColor === 'black' ? 'text-black' : 'text-white'
  const borderColorClass = borderColor === 'black' ? 'border-black' : 'border-white'
  const hoverBorderClass = borderColor === 'black' ? 'hover:border-black' : 'hover:border-white'

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className="bg-transparent" style={{ borderBottom: 'none' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 md:h-14">
          {/* Botones de navegación centrados */}
          <div className="flex space-x-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-[border] duration-150 ${
                  router.pathname === item.href
                    ? `${textColorClass} border-b-2 ${borderColorClass}`
                    : `${textColorClass} border-b-2 border-transparent ${hoverBorderClass}`
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Botones de autenticación a la derecha */}
          <div className="flex items-center space-x-4">
            {loading ? (
              // Mostrar algo mientras carga, o simplemente no mostrar nada
              <div className="w-20 h-6"></div> // Espacio reservado
            ) : (
              <>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className={`px-3 py-1.5 text-sm font-medium ${textColorClass} hover:opacity-80 transition-opacity`}
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`px-3 py-1.5 text-sm font-medium ${textColorClass} hover:opacity-80 transition-opacity`}
                    >
                      Salir
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className={`px-3 py-1.5 text-sm font-medium ${textColorClass} hover:opacity-80 transition-opacity`}
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

