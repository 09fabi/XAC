import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/context/CartContext'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const isOutOfStock = product.stock !== undefined && product.stock === 0
  const isLowStock = product.stock !== undefined && product.stock > 0 && product.stock <= 5

  return (
    <Link href={`/product/${product.id}`}>
      <div className="h-full flex flex-col cursor-pointer group border-2 border-black bg-white transition-all duration-500 hover:shadow-[8px_8px_0_0_#000] hover:-translate-x-1 hover:-translate-y-1">
        {/* Contenedor de imagen con overlay elegante */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 bg-gray-50 overflow-hidden border-b-2 border-black">
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay sutil en hover */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          
          {/* Badge de estado - Stock bajo */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
              Últimas unidades
            </div>
          )}
          
          {/* Badge de estado - Agotado */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
              <div className="bg-black text-white px-6 py-2 text-sm font-semibold uppercase tracking-wider">
                Agotado
              </div>
            </div>
          )}
        </div>

        {/* Contenido premium con mejor jerarquía */}
        <div className="flex flex-col p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4 md:space-y-5 flex-grow">
          {/* Nombre del producto */}
          <h3 className="text-base sm:text-lg md:text-xl font-bold line-clamp-2 tracking-wide text-black uppercase leading-tight group-hover:opacity-90 transition-opacity duration-300">
            {product.name}
          </h3>
          
          {/* Precio con separador elegante */}
          <div className="pt-3 sm:pt-4 border-t border-black border-opacity-20">
            <span className="text-base sm:text-lg font-semibold text-black uppercase tracking-wider">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

