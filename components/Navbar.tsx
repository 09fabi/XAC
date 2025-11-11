import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCart } from '@/context/CartContext'

const Navbar = () => {
  const router = useRouter()
  const { getTotalItems } = useCart()

  const navItems = [
    { href: '/', label: 'Inicio' },
    { href: '/store', label: 'Tienda' },
    { href: '/recommendations', label: 'Recomendaciones' },
  ]

  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black tracking-tight text-black uppercase">XAC</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  router.pathname === item.href
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-black hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/profile"
              className="text-xs uppercase tracking-wide text-black hover:bg-black hover:text-white px-3 py-2 transition-all duration-300"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center space-x-2 px-4 py-2 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all duration-300"
            >
              <svg
                className="w-5 h-5"
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
              <span className="font-medium text-xs uppercase tracking-wide hidden sm:inline">Carrito</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black border-2 border-black text-xs font-bold w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

