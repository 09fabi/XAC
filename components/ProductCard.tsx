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
    }).format(price)
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="card h-full flex flex-col cursor-pointer group">
        <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
          <Image
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow border-t-2 border-black">
          <h3 className="text-base font-semibold mb-2 line-clamp-2 uppercase tracking-wide">{product.name}</h3>
          {product.description && (
            <p className="text-gray-600 text-xs mb-4 line-clamp-2 uppercase tracking-wide">{product.description}</p>
          )}
          <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-lg font-bold text-black">
              {formatPrice(product.price)}
            </span>
            {product.category && (
              <span className="text-xs text-gray-600 uppercase tracking-wider border border-black px-2 py-1">
                {product.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

