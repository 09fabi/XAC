import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useCart } from '@/context/CartContext'

export default function Home() {
  const router = useRouter()
  const { getTotalItems } = useCart()

  const handleProfileClick = () => {
    // TODO: Implementar lógica de autenticación
    router.push('/auth/login')
  }

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content="Descubre las últimas tendencias en moda. Ropa de calidad para todos los estilos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        {/* Sección NUEVO DROP - Video con texto superpuesto */}
        <section className="relative h-screen w-full overflow-hidden">
            {/* Video de fondo */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center top', clipPath: 'inset(0 0 10% 0)' }}
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="https://res.cloudinary.com/dzp4pdgyp/video/upload/v1763512004/Pablo_Chill-E_-_Freestyle_Chilean_Remix_1_xdt4ls.mp4" type="video/mp4" />
            </video>
            
            {/* Overlay oscuro para oscurecer el video */}
            <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
            
            {/* Fondo negro en la parte inferior recortada */}
            <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-black z-0"></div>
            
            {/* Título XAC con botones de búsqueda, usuario y carrito - superpuesto sobre el video */}
            <div className="absolute top-0 left-0 right-0 z-20 pt-4 pb-0">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center">
                  {/* Título XAC centrado */}
                  <div className="flex-1 text-center">
                    <div className="text-white font-black tracking-tight uppercase" style={{ fontSize: 'clamp(3rem, 6vw, 3.5rem)' }}>
                      XAC
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botón de búsqueda a la izquierda - posicionado respecto a la sección */}
              <button className="absolute left-12 sm:left-16 lg:left-24 top-1/2 -translate-y-1/2 p-2 text-white hover:opacity-70 transition-opacity duration-150">
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>

              {/* Botones de usuario y carrito a la derecha - posicionados respecto a la sección */}
              <div className="absolute right-12 sm:right-16 lg:right-24 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <button
                  onClick={handleProfileClick}
                  className="p-2 text-white hover:opacity-70 transition-opacity duration-150 relative"
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
                <Link
                  href="/cart"
                  className="relative p-2 text-white hover:opacity-70 transition-opacity duration-150"
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
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-medium w-4 h-4 flex items-center justify-center rounded-full">
                      {getTotalItems()}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            
            {/* Navbar superpuesto sobre el video - posicionado justo después del título */}
            <div className="absolute top-0 left-0 right-0 z-20" style={{ marginTop: 'calc(clamp(3rem, 6vw, 3.5rem) + 3rem)' }}>
              <Navbar />
            </div>
            
            {/* Contenido superpuesto centrado */}
            <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 z-10">
              {/* Texto pequeño arriba */}
              <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white mb-3 text-center">
                ESTO NO ES RETAIL
              </p>
              
              {/* Texto principal en el centro */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-6 tracking-tight text-center">
                No vendemos ropa, vendemos actitud
              </h2>
              
              {/* Botón para ir a la tienda */}
              <Link
                href="/store"
                className="group relative bg-transparent border-2 border-white text-white px-12 py-4 rounded-none font-semibold tracking-wider uppercase text-sm transition-all duration-500 inline-block mt-4 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">Tienda</span>
              </Link>
            </div>
          </section>

          {/* Sección de Categorías - Fondo negro con cards minimalistas */}
          <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {/* Card Conjuntos */}
                <Link
                  href="/store?category=CONJUNTOS"
                  className="group relative bg-transparent border-2 border-white text-white transition-all duration-300 flex flex-col items-center justify-center overflow-hidden min-h-[450px] transform hover:scale-105"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src="https://res.cloudinary.com/dzp4pdgyp/image/upload/v1763516283/conjuntos_cards_pi4xxq.gif"
                      alt="Conjuntos"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-center">
                      Conjuntos
                    </h3>
                    <div className="w-12 h-0.5 bg-white transition-colors duration-300"></div>
                  </div>
                </Link>

                {/* Card Chaquetas */}
                <Link
                  href="/store?category=CHAQUETAS"
                  className="group relative bg-transparent border-2 border-white text-white transition-all duration-300 flex flex-col items-center justify-center overflow-hidden min-h-[450px] transform hover:scale-105"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src="https://res.cloudinary.com/dzp4pdgyp/image/upload/v1763516188/chaquetas_cards_le24ka.gif"
                      alt="Chaquetas"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-center">
                      Chaquetas
                    </h3>
                    <div className="w-12 h-0.5 bg-white transition-colors duration-300"></div>
                  </div>
                </Link>

                {/* Card Poleras */}
                <Link
                  href="/store?category=POLERAS"
                  className="group relative bg-transparent border-2 border-white text-white transition-all duration-300 flex flex-col items-center justify-center overflow-hidden min-h-[450px] transform hover:scale-105"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src="https://res.cloudinary.com/dzp4pdgyp/image/upload/v1763516187/poleras_cards_gcms2x.gif"
                      alt="Poleras"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-center">
                      Poleras
                    </h3>
                    <div className="w-12 h-0.5 bg-white transition-colors duration-300"></div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* Sección Imagen y Texto - Fondo negro */}
          <section className="bg-black py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Texto a la izquierda */}
                <div className="text-white space-y-6 order-2 lg:order-1">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight">
                    LUJO ACCESIBLE
                  </h2>
                  <p className="text-base md:text-lg leading-relaxed opacity-90">
                    Ellos venden el nombre. Nosotros, tu estilo.
                  </p>
                </div>

                {/* Imagen a la derecha */}
                <div className="order-1 lg:order-2">
                  <div className="relative w-full h-[400px] lg:h-[500px] bg-gray-900 border-2 border-white">
                    <img
                      src="https://res.cloudinary.com/dzp4pdgyp/image/upload/v1763517598/17161D504C43426D17120F55514944721F131A18504A43771215-1200x800-1-768x512_pzmz4n.webp"
                      alt="Imagen descriptiva"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Footer />
      </div>
    </>
  )
}

