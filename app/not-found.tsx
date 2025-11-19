import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Página no encontrada</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-white text-black px-8 py-3 font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors duration-200"
          >
            Ir al inicio
          </Link>
          <Link
            href="/store"
            className="border-2 border-white text-white px-8 py-3 font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-200"
          >
            Ver tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

