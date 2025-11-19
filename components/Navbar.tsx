"use client";
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface NavbarProps {
  textColor?: 'white' | 'black'
  borderColor?: 'white' | 'black'
  showTitle?: boolean
  title?: string
  simple?: boolean
}

const Navbar = ({ textColor = 'white', borderColor = 'white', showTitle = false, title = 'xac', simple = false }: NavbarProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/store', label: 'Tienda' },
    { href: '/recommendations', label: 'Recomendaciones' },
  ]

  const textColorClass = textColor === 'black' ? 'text-black' : 'text-white'
  const borderColorClass = borderColor === 'black' ? 'border-black' : 'border-white'
  const hoverBorderClass = borderColor === 'black' ? 'hover:border-black' : 'hover:border-white'

  // Modo simple para login/register: solo título con botón de volver
  if (simple) {
    const handleBackClick = () => {
      // Si estamos en sign-up y venimos de redirecting, ir al inicio sin alert
      if (pathname === "/sign-up" && (document.referrer.includes("/redirecting") || sessionStorage.getItem("from_redirecting") === "true")) {
        sessionStorage.removeItem("from_redirecting");
        sessionStorage.setItem("clerk_user_cancelled", "true");
        router.push("/");
      } else {
        router.back();
      }
    };

    return (
      <nav className="bg-transparent" style={{ borderBottom: 'none' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center relative py-3 md:py-4">
            {/* Botón de volver a la izquierda */}
            <button
              onClick={handleBackClick}
              className={`absolute left-0 sm:left-2 ${textColorClass} hover:opacity-70 transition-opacity`}
              aria-label="Volver atrás"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {/* Título centrado */}
            <h1 className={`${textColorClass} text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight`}>
              {title}
            </h1>
          </div>
        </div>
      </nav>
    )
  }

  // Modo normal con botones de navegación
  return (
    <nav className="bg-transparent" style={{ borderBottom: 'none' }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {showTitle && (
          <div className="flex justify-center items-center py-3 md:py-4">
            <h1 className={`${textColorClass} text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight`}>
              {title}
            </h1>
          </div>
        )}
        <div className="flex justify-between items-center h-10 sm:h-12 md:h-14">
          {/* Botones de navegación centrados */}
          <div className="flex space-x-0.5 sm:space-x-1 flex-1 justify-center overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium uppercase tracking-wider transition-[border] duration-150 whitespace-nowrap ${
                  pathname === item.href
                    ? `${textColorClass} border-b-2 ${borderColorClass}`
                    : `${textColorClass} border-b-2 border-transparent ${hoverBorderClass}`
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </nav>
  )
}

export default Navbar

