import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronDown, ChevronUp, Clock, CheckCircle, Truck, PackageCheck, XCircle } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import StatusDot from '../../components/admin/StatusDot'
import { api, errorMessage } from '../../lib/api'
import { useLiveRefresh } from '../../context/RealtimeContext'

const statusColors = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  processing: { bg: 'bg-sky-100', text: 'text-sky-700', icon: Clock },
  paid: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
  shipped: { bg: 'bg-violet-100', text: 'text-violet-700', icon: Truck },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: PackageCheck },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: PackageCheck },
  cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = useCallback(async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data || [])
    } catch (err) {
      console.error('Failed to load orders', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useLiveRefresh(["orders"], load)

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...res.data } : o))
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <PageHeader
        firstWord="Manage" secondWord="Orders" accentColor="text-violet-500"
        subtitle="Process and track customer shipments"
      />

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
        {['all', 'pending', 'processing', 'paid', 'shipped', 'delivered', 'completed', 'cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              filter === f
                ? 'bg-neutral-800 text-white'
                : 'bg-white text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {f} ({f === 'all' ? orders.length : orders.filter(o => o.status === f).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          [1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-neutral-500">No orders found.</div>
        ) : (
          filtered.map(order => {
            const isExpanded = expandedId === order.id
            const StatusIcon = statusColors[order.status || 'pending']?.icon || Clock
            const statusConfig = statusColors[order.status || 'pending'] || statusColors.pending

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden transition-all">
                {/* Header (Clickable) */}
                <div
                  className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs font-mono text-neutral-400 mb-1">{order.orderNumber || `#${order.id.slice(-6).toUpperCase()}`}</p>
                      <p className="font-semibold text-neutral-900">{order.customer?.fullName || 'Guest'}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-neutral-400 mb-1">Date</p>
                      <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-neutral-400 mb-1">Total</p>
                      <p className="text-sm font-bold text-emerald-600">Rs. {order.total?.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.text}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{order.status || 'pending'}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-neutral-100 bg-neutral-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

                      {/* Customer Details */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Customer Details</h4>
                        <div className="bg-white p-4 rounded-xl border border-neutral-100 text-sm space-y-2">
                          <p><span className="text-neutral-500 w-20 inline-block">Email:</span> {order.customer?.email}</p>
                          <p><span className="text-neutral-500 w-20 inline-block">Payment:</span> <span className="uppercase text-xs font-bold">{order.paymentMethod} · {order.paymentStatus}</span></p>
                          <p><span className="text-neutral-500 w-20 inline-block">Phone:</span>
                            {order.customer?.phone || '—'}
                            {order.customer?.phone && (
                              <a href={`https://wa.me/${order.customer.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="ml-2 text-emerald-500 hover:underline text-xs">
                                WhatsApp ↗
                              </a>
                            )}
                          </p>
                          {order.customer?.company && <p><span className="text-neutral-500 w-20 inline-block">Company:</span> {order.customer.company}</p>}
                          {order.customer?.notes && (
                            <p><span className="text-neutral-500 w-20 inline-block align-top">Notes:</span>
                              <span className="inline-block w-[calc(100%-5rem)] whitespace-pre-wrap">{order.customer.notes}</span>
                            </p>
                          )}
                        </div>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 mt-6">Update Status</h4>
                        <div className="flex flex-wrap gap-2">
                          {['pending', 'processing', 'paid', 'shipped', 'delivered', 'completed', 'cancelled'].map(s => (
                            <button
                              key={s}
                              onClick={() => handleUpdateStatus(order.id, s)}
                              disabled={order.status === s}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                                order.status === s
                                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                  : 'bg-white border border-neutral-200 hover:border-violet-500 text-neutral-600 hover:text-violet-600'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Order Items</h4>
                        <div className="bg-white rounded-xl border border-neutral-100 divide-y divide-neutral-100">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="p-3 flex items-center justify-between text-sm">
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                                  {item.quantity}x
                                </span>
                                <span className="font-medium text-neutral-700">{item.name}</span>
                              </div>
                              <span className="text-neutral-500">Rs. {(item.lineTotal ?? item.unitPrice * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="p-3 flex justify-between bg-neutral-50 text-sm">
                            <span className="text-neutral-500">Subtotal</span>
                            <span>Rs. {(order.subtotal ?? order.total - (order.shippingFee || 0)).toLocaleString()}</span>
                          </div>
                          <div className="p-3 flex justify-between bg-neutral-50 text-sm">
                            <span className="text-neutral-500">Tax</span>
                            <span>Rs. {(order.tax || 0).toLocaleString()}</span>
                          </div>
                          <div className="p-4 flex justify-between rounded-b-xl bg-violet-50">
                            <span className="font-bold text-violet-900">Total</span>
                            <span className="font-bold text-violet-700 text-lg">Rs. {order.total?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
