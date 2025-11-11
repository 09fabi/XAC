import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-white border-t-2 border-black mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">XAC</h3>
            <p className="text-xs text-gray-600 uppercase tracking-wide leading-relaxed">
              A simple vista es fuego. De cerca, es arte. Los detalles son parte del mensaje.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-6 uppercase tracking-wider">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/store" className="text-xs text-gray-600 hover:text-black uppercase tracking-wide transition-colors">
                  Tienda
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-xs text-gray-600 hover:text-black uppercase tracking-wide transition-colors">
                  Recomendaciones
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-xs text-gray-600 hover:text-black uppercase tracking-wide transition-colors">
                  Perfil
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-6 uppercase tracking-wider">Información</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-black uppercase tracking-wide transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-black uppercase tracking-wide transition-colors">
                  Política de devoluciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-black uppercase tracking-wide transition-colors">
                  Política de envíos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold mb-6 uppercase tracking-wider">Contacto</h4>
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">contacto@xac.com</p>
            <p className="text-xs text-gray-600 uppercase tracking-wide">+56 9 1234 5678</p>
          </div>
        </div>

        <div className="border-t-2 border-black pt-8 text-center">
          <p className="text-xs text-gray-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} XAC. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

