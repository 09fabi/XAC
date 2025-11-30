import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-black mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 uppercase tracking-tight text-white">XAC</h3>
            <p className="text-xs text-gray-300 uppercase tracking-wide leading-relaxed">
              Hay marcas que venden ropa, nosotros vendemos arte y actitud.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/store" className="text-xs text-gray-300 hover:text-white uppercase tracking-wide transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-xs text-gray-300 hover:text-white uppercase tracking-wide transition-colors">
                  Recomendaciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-white">Síguenos</h4>
            <a
              href="https://www.instagram.com/xulerialcorte/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-gray-300 hover:text-white transition-colors"
              aria-label="Instagram de XulerialCorte"
            >
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-white">Contacto</h4>
            <p className="text-xs text-gray-300 uppercase tracking-wide mb-2">contacto@xac.com</p>
            <p className="text-xs text-gray-300 uppercase tracking-wide">+56 9 1234 5678</p>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 text-center">
          <p className="text-xs text-gray-300 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} XAC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

