import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Lock, Loader2, ChevronLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLiveCart } from '../hooks/useLiveCart'
import { useProducts } from '../context/ProductsContext'
import { api, errorMessage } from '../lib/api'

const PAYMENT_METHODS = [
  { value: 'bank_transfer', label: 'Bank transfer', hint: 'We email you our bank details with your order confirmation.' },
  { value: 'jazzcash_easypaisa', label: 'JazzCash / Easypaisa', hint: 'Pay from your mobile wallet; we share the account number after ordering.' },
  { value: 'pay_on_delivery', label: 'Pay on delivery', hint: 'Pay once your product or service has been delivered.' },
]

const inputCls = 'w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder-neutral-400'
const labelCls = 'text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block'

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const { orderable, hasUnavailable, total } = useLiveCart()
  const { refresh } = useProducts()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', company: '', notes: '' })
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].value)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [order, setOrder] = useState(null)

  // Signed-in customers get their details pre-filled (and the order is linked to their account)
  useEffect(() => {
    let cancelled = false
    api.get('/auth/me')
      .then(({ data }) => {
        if (cancelled || !data) return
        setForm((f) => ({
          ...f,
          fullName: f.fullName || data.fullName || '',
          email: f.email || data.email || '',
          phone: f.phone || data.phone || '',
          company: f.company || data.company || '',
        }))
      })
      .catch(() => { /* guest checkout */ })
    return () => { cancelled = true }
  }, [])

  if (order) return <Confirmation order={order} />
  if (cart.length === 0) return <Navigate to="/cart" replace />
  if (hasUnavailable) return <Navigate to="/cart" replace />

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const customer = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v.trim()]).filter(([, v]) => v)
      )
      const res = await api.post('/orders', {
        customer,
        paymentMethod,
        items: orderable.map((i) => ({ productId: i.id, quantity: i.quantity })),
      })
      setOrder(res.data)
      clearCart()
      window.scrollTo(0, 0)
    } catch (err) {
      setError(errorMessage(err))
      // Prices or availability may have changed; reload the catalogue
      refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#f8f9fa]">
      <div className="max-w-5xl mx-auto px-6">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" /> Back to cart
        </Link>
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-neutral-900 mb-6">Your details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label>
                  <span className={labelCls}>Full name</span>
                  <input required minLength={2} autoComplete="name" value={form.fullName} onChange={set('fullName')} placeholder="John Doe" className={inputCls} />
                </label>
                <label>
                  <span className={labelCls}>Email</span>
                  <input required type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="john@company.com" className={inputCls} />
                </label>
                <label>
                  <span className={labelCls}>Phone / WhatsApp</span>
                  <input required type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="+92 300 1234567" className={inputCls} />
                </label>
                <label>
                  <span className={labelCls}>Company (optional)</span>
                  <input autoComplete="organization" value={form.company} onChange={set('company')} className={inputCls} />
                </label>
              </div>
              <label className="block mt-4">
                <span className={labelCls}>Order notes (optional)</span>
                <textarea rows={3} value={form.notes} onChange={set('notes')} placeholder="Project details, preferred delivery time, etc." className={`${inputCls} resize-none`} />
              </label>
            </section>

            <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="font-bold text-lg text-neutral-900 mb-6">Payment method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                      paymentMethod === m.value ? 'border-brand-500 bg-brand-50' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="mt-1 accent-brand-500"
                    />
                    <span>
                      <span className="block font-bold text-neutral-900 text-sm">{m.label}</span>
                      <span className="block text-xs text-neutral-500 mt-0.5">{m.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm h-fit lg:sticky lg:top-28">
            <h2 className="font-bold text-lg text-neutral-900 mb-6">Order summary</h2>
            <ul className="divide-y divide-neutral-100 mb-6">
              {orderable.map((item) => (
                <li key={item.id} className="py-3 flex justify-between gap-4 text-sm">
                  <span className="text-neutral-700">
                    <span className="font-bold">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="font-bold text-neutral-900 whitespace-nowrap">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-end border-t border-neutral-100 pt-4 mb-6">
              <span className="font-bold text-neutral-900">Total</span>
              <span className="text-2xl font-extrabold text-brand-500">Rs. {total.toLocaleString()}</span>
            </div>

            {error && (
              <p className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm whitespace-pre-line">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing order…</> : <>Place order <ArrowRight className="w-4 h-4" /></>}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-400 mt-3">
              <Lock className="w-3 h-3" /> Final prices are confirmed by our server
            </p>
          </aside>
        </form>
      </div>
    </div>
  )
}

function Confirmation({ order }) {
  const method = PAYMENT_METHODS.find((m) => m.value === order.paymentMethod)
  return (
    <div className="pt-32 pb-20 min-h-[85vh] bg-[#f8f9fa] flex items-start justify-center px-6">
      <div className="bg-white rounded-[3rem] p-10 md:p-14 max-w-[560px] w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">Thank you for your order!</h1>
        <p className="text-neutral-500 mb-8">
          Your order <strong className="text-neutral-900">{order.orderNumber}</strong> has been received.
          We&apos;ll contact you at <strong className="text-neutral-900">{order.customer.email}</strong> shortly.
        </p>
        <div className="bg-neutral-50 rounded-2xl p-5 text-left text-sm space-y-2 mb-8">
          {order.items.map((i) => (
            <div key={i.productId} className="flex justify-between gap-4">
              <span className="text-neutral-600">{i.quantity}× {i.name}</span>
              <span className="font-bold whitespace-nowrap">Rs. {i.lineTotal.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-neutral-200 pt-2 mt-2">
            <span className="font-bold">Total</span>
            <span className="font-extrabold text-brand-500">Rs. {order.total.toLocaleString()}</span>
          </div>
          {method && <p className="text-neutral-500 pt-2">Payment: {method.label}. {method.hint}</p>}
        </div>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-[#0066FF] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-600 transition-all text-sm">
          Continue shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
