import { useState, useEffect } from 'react'
import { Download, CreditCard, Banknote } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import PillButton from '../../components/admin/PillButton'
import { api } from '../../lib/api'

export default function Transactions() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/orders')
        // Filter out cancelled orders for transaction view usually
        const validOrders = (res.data || []).filter(o => o.status !== 'cancelled')
        // Sort newest first
        setOrders(validOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      } catch (err) {
        console.error('Failed to load transactions', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleExport = () => {
    if (orders.length === 0) return
    
    const headers = ['Order ID', 'Date', 'Customer', 'Amount', 'Payment Method', 'Payment Status']
    const csvContent = [
      headers.join(','),
      ...orders.map(o => [
        o.id,
        new Date(o.createdAt).toISOString(),
        `"${o.customerInfo?.name || ''}"`,
        o.total,
        o.paymentMethod || 'COD',
        o.paymentStatus || 'pending'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate summary stats
  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + (o.total || 0), 0)
  const pendingRevenue = orders.filter(o => o.paymentStatus !== 'paid').reduce((sum, o) => sum + (o.total || 0), 0)

  return (
    <div>
      <PageHeader
        firstWord="Financial" secondWord="Transactions" accentColor="text-cyan-500"
        subtitle="Track revenue and payments"
      >
        <PillButton label="Export CSV" icon={Download} variant="secondary" onClick={handleExport} disabled={loading || orders.length === 0} />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#001a3d] to-[#021127] rounded-3xl p-6 text-white shadow-lg">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">Realized Revenue (Paid)</p>
          <p className="text-4xl font-display font-bold">Rs. {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2">Pending Collections (COD/Unpaid)</p>
          <p className="text-4xl font-display font-bold text-neutral-900">Rs. {pendingRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 border-b border-neutral-100">
                <th className="px-6 py-4 font-semibold">Ref / Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Method</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">Loading transactions...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">No transactions found.</td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs text-neutral-900 mb-1">#{o.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[11px] text-neutral-400">{new Date(o.createdAt).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">{o.customerInfo?.name || 'Guest'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {o.paymentMethod === 'card' ? <CreditCard className="w-4 h-4 text-neutral-400" /> : <Banknote className="w-4 h-4 text-emerald-500" />}
                        <span className="uppercase text-xs font-bold tracking-wider text-neutral-600">{o.paymentMethod || 'COD'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {o.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-neutral-900">
                      Rs. {o.total?.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
