import Image from 'next/image'
import { CartItem as CartItemType } from '@/context/CartContext'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 bg-white p-4 sm:p-6 border-2 border-black">
      {/* Imagen y info del producto */}
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 w-full sm:w-auto">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gray-100 overflow-hidden flex-shrink-0">
          <Image
            src={item.image || '/placeholder-product.jpg'}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
          />
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-sm sm:text-base uppercase tracking-wide mb-1 truncate">{item.name}</h3>
          {item.selectedSize && (
            <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Talla: {item.selectedSize}</p>
          )}
          <p className="text-gray-600 text-xs uppercase tracking-wide">{formatPrice(item.price)} c/u</p>
        </div>
      </div>

      {/* Controles y precio - en móvil se apilan verticalmente */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 sm:space-x-4">
        {/* Controles de cantidad */}
        <div className="flex items-center border-2 border-black">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 hover:bg-black hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-bold border-x-2 border-black text-sm sm:text-base">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 hover:bg-black hover:text-white transition-all duration-300 font-medium text-sm sm:text-base"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        {/* Precio total */}
        <div className="text-right sm:min-w-[100px] md:min-w-[120px]">
          <p className="font-bold text-base sm:text-lg text-black">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={() => onRemove(item.id)}
          className="text-black hover:bg-black hover:text-white transition-all duration-300 p-1.5 sm:p-2 border-2 border-black flex-shrink-0"
          aria-label="Eliminar del carrito"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CartItem

