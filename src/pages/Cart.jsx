import { Link } from 'react-router-dom'
import { ShoppingCart, ShoppingBag, ArrowRight, Package, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 min-h-[85vh] bg-[#f8f9fa] flex items-start justify-center px-6">
        <div className="bg-white rounded-[3rem] p-12 md:p-16 max-w-[500px] w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#f4f4f5] flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-neutral-400 stroke-[1.5]" />
          </div>
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-4">Your cart is empty</h2>
          <p className="text-neutral-500 mb-10 leading-relaxed max-w-sm mx-auto text-[15px]">
            It looks like you haven't added any premium software to your cart yet. Start exploring our marketplace.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#0066FF] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all text-sm tracking-wide"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 border border-brand-100 rounded-full text-brand-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Shopping Cart
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-4">
                  <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand-100">
                        <Package className="w-6 h-6 text-brand-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-neutral-500 mb-2">{item.category}</p>
                    <div className="font-bold text-brand-500 text-lg">Rs. {item.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-neutral-50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded text-neutral-500 hover:text-neutral-900 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded text-neutral-500 hover:text-neutral-900 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#f8f9fa] p-6 rounded-3xl h-fit border-none">
              <h3 className="font-bold text-xl text-neutral-900 mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-neutral-500">
                  <span>Items ({getCartCount()})</span>
                  <span>Rs. {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start gap-4 text-neutral-500">
                  <span>Taxes</span>
                  <span className="text-right max-w-[150px] leading-tight">Calculated at checkout</span>
                </div>
                <div className="border-t border-neutral-100 pt-4 flex justify-between items-end">
                  <span className="font-bold text-neutral-900">Total</span>
                  <span className="text-2xl font-extrabold text-brand-500">Rs. {getCartTotal().toLocaleString()}</span>
                </div>
              </div>
              <button className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2">
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}
