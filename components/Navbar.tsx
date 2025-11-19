import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavbarProps {
  textColor?: 'white' | 'black'
  borderColor?: 'white' | 'black'
  showProfileIcon?: boolean
}

const Navbar = ({ textColor = 'white', borderColor = 'white', showProfileIcon = false }: NavbarProps) => {
  const router = useRouter()

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/store', label: 'Tienda' },
    { href: '/recommendations', label: 'Recomendaciones' },
  ]

  const textColorClass = textColor === 'black' ? 'text-black' : 'text-white'
  const borderColorClass = borderColor === 'black' ? 'border-black' : 'border-white'
  const hoverBorderClass = borderColor === 'black' ? 'hover:border-black' : 'hover:border-white'

  const handleProfileClick = () => {
    // TODO: Implementar lógica de autenticación
    router.push('/auth/login')
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

          {/* Icono de perfil a la derecha (si showProfileIcon es true) */}
          {showProfileIcon && (
            <div className="flex items-center">
              <button
                onClick={handleProfileClick}
                className={`p-2 ${textColorClass} hover:opacity-70 transition-opacity duration-150 relative`}
                aria-label="Iniciar sesión"
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
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

