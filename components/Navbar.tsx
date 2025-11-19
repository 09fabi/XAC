import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavbarProps {
  textColor?: 'white' | 'black'
  borderColor?: 'white' | 'black'
}

const Navbar = ({ textColor = 'white', borderColor = 'white' }: NavbarProps) => {
  const router = useRouter()

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/store', label: 'Tienda' },
    { href: '/recommendations', label: 'Recomendaciones' },
  ]

  const textColorClass = textColor === 'black' ? 'text-black' : 'text-white'
  const borderColorClass = borderColor === 'black' ? 'border-black' : 'border-white'
  const hoverBorderClass = borderColor === 'black' ? 'hover:border-black' : 'hover:border-white'

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
        </div>
      </div>
    </nav>
  )
}

export default Navbar

