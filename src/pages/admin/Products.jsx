import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import PillButton from '../../components/admin/PillButton'
import StatusDot from '../../components/admin/StatusDot'
import { api } from '../../lib/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=999'),
          api.get('/categories'),
        ])
        setProducts(prodRes.data || [])
        setCategories(catRes.data || [])
      } catch (err) {
        console.error('Failed to load products', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.del(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter ? p.category === categoryFilter : true
    return matchSearch && matchCat
  })

  return (
    <div>
      <PageHeader
        firstWord="Manage" secondWord="Products" accentColor="text-emerald-500"
        subtitle="View and edit your store inventory"
      >
        <PillButton label="New Product" icon={Plus} variant="success" onClick={() => alert('TODO: Implement product creation modal')} />
      </PageHeader>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id || c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400">
                <th className="py-3 font-medium">Product</th>
                <th className="py-3 font-medium">Category</th>
                <th className="py-3 font-medium">Price</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">Loading products...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-400">No products found.</td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-neutral-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-neutral-300" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-neutral-900">{p.name}</p>
                          <p className="text-xs text-neutral-400 truncate max-w-[200px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-600">{p.category}</td>
                    <td className="py-3 font-medium">Rs. {p.price?.toLocaleString()}</td>
                    <td className="py-3">
                      {p.inStock !== false ? (
                        <StatusDot color="bg-emerald-400" label="In Stock" />
                      ) : (
                        <StatusDot color="bg-red-400" label="Out of Stock" />
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => alert('TODO: Implement edit modal')} className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
