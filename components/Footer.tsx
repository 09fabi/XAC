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
            <h4 className="text-xs font-semibold mb-4 sm:mb-6 uppercase tracking-wider text-white">Información</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="#" className="text-xs text-gray-300 hover:text-white uppercase tracking-wide transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-300 hover:text-white uppercase tracking-wide transition-colors">
                  Política de devoluciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-300 hover:text-white uppercase tracking-wide transition-colors">
                  Política de envíos
                </Link>
              </li>
            </ul>
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

