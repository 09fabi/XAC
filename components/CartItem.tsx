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
    <div className="flex items-center space-x-6 bg-white p-6 border-2 border-black">
      <div className="relative w-28 h-28 bg-gray-100 overflow-hidden flex-shrink-0">
        <Image
          src={item.image || '/placeholder-product.jpg'}
          alt={item.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>

      <div className="flex-grow">
        <h3 className="font-semibold text-base uppercase tracking-wide mb-1">{item.name}</h3>
        {item.selectedSize && (
          <p className="text-gray-600 text-xs uppercase tracking-wide mb-1">Talla: {item.selectedSize}</p>
        )}
        <p className="text-gray-600 text-xs uppercase tracking-wide">{formatPrice(item.price)} c/u</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center border-2 border-black">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="px-4 py-2 hover:bg-black hover:text-white transition-all duration-300 font-medium"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="px-6 py-2 font-bold border-x-2 border-black">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-4 py-2 hover:bg-black hover:text-white transition-all duration-300 font-medium"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <div className="text-right min-w-[120px]">
          <p className="font-bold text-lg text-black">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-black hover:bg-black hover:text-white transition-all duration-300 p-2 border-2 border-black"
          aria-label="Eliminar del carrito"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CartItem

