import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/context/CartContext'

const SIZES = ['S', 'M', 'L', 'XL', '2XL']

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])

  useEffect(() => {
    // Cargar productos destacados desde API o usar mock data
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=4')
        if (response.ok) {
          const data = await response.json()
          setFeaturedProducts(data.products || [])
        } else {
          // Mock data si la API no está disponible
          setFeaturedProducts([
            {
              id: '1',
              name: 'Polera Básica Negra',
              price: 12990,
              image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
              description: 'Polera básica de algodón, perfecta para el día a día',
              category: 'POLERAS',
            },
            {
              id: '2',
              name: 'Polerón Oversize Gris',
              price: 34990,
              image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
              description: 'Polerón oversize cómodo y cálido, perfecto para el invierno',
              category: 'POLERONES',
            },
            {
              id: '3',
              name: 'Chaqueta Denim Clásica',
              price: 39990,
              image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
              description: 'Chaqueta denim versátil para cualquier ocasión',
              category: 'CHAQUETAS',
            },
            {
              id: '4',
              name: 'Jeans Clásicos',
              price: 29990,
              image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
              description: 'Jeans de corte clásico, cómodos y duraderos',
              category: 'PANTALONES',
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching featured products:', error)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <>
      <Head>
        <title>XAC</title>
        <meta name="description" content="Descubre las últimas tendencias en moda. Ropa de calidad para todos los estilos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">
          {/* Hero Banner - Minimalista con XAC */}
          <section className="bg-white border-b-2 border-black py-32 md:py-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="xac-logo text-black mb-8">
                  XAC
                </div>
                <p className="text-sm md:text-base uppercase tracking-[0.3em] text-gray-600 mb-12">
                  Xuleria Al Corte
                </p>
                <Link
                  href="/store"
                  className="btn-primary inline-block"
                >
                  Explorar Colección
                </Link>
              </div>
            </div>
          </section>

          {/* Sección NUEVO DROP - Estilo BANG GANG */}
          <section className="py-24 bg-white border-t-2 border-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl md:text-4xl font-black text-center mb-4 uppercase tracking-tight">NUEVO DROP</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link
                  href="/store"
                  className="btn-primary inline-block"
                >
                  Ver Catálogo Completo
                </Link>
              </div>
            </div>
          </section>

          {/* Sección "ES CALLE" - Estilo BANG GANG */}
          <section className="py-32 bg-black text-white border-t-2 border-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6">Esto no es retail</p>
              <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tight">ES CALLE</h2>
              <p className="text-base md:text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Hay marcas que venden ropa, nosotros vendemos arte y actitud. Si tienes algo que decir sin hablar, ya sabes cómo hacerlo.
              </p>
              <Link
                href="/store"
                className="btn-secondary inline-block"
              >
                Ver Productos
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

