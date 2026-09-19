import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'

/**
 * Cart lines merged with the live catalogue: current name, price and image,
 * plus whether each item can still be ordered.
 */
export function useLiveCart() {
  const { cart } = useCart()
  const { getProduct, status } = useProducts()

  const items = cart.map((item) => {
    const live = getProduct(item.id)
    // Only call a product "removed" once the live catalogue has loaded
    const removed = !live && status === 'live'
    const unavailable = removed || live?.inStock === false
    return {
      ...item,
      ...(live && { name: live.name, price: live.price, image: live.image, category: live.category }),
      unavailable,
      reason: removed ? 'No longer available' : live?.inStock === false ? 'Out of stock' : null,
    }
  })

  const orderable = items.filter((i) => !i.unavailable)
  return {
    items,
    orderable,
    hasUnavailable: items.some((i) => i.unavailable),
    count: items.reduce((n, i) => n + i.quantity, 0),
    total: orderable.reduce((sum, i) => sum + i.price * i.quantity, 0),
  }
}
