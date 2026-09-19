import { useCallback, useEffect, useState } from 'react'
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import PillButton from '../../components/admin/PillButton'
import StatusDot from '../../components/admin/StatusDot'
import ProductForm from '../../components/admin/ProductForm'
import { useLiveRefresh } from '../../context/RealtimeContext'
import { api, errorMessage } from '../../lib/api'

const PAGE_SIZE = 50

function Thumb({ src, alt }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0" title={src ? 'Image not found' : 'No image'}>
        <Package className="w-5 h-5 text-neutral-300" />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0" />
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [editing, setEditing] = useState(undefined) // undefined = closed, null = new, object = edit
  const [visible, setVisible] = useState(PAGE_SIZE)

  const load = useCallback(async () => {
    const [prodRes, catRes] = await Promise.all([
      api.get('/products?limit=1000'),
      api.get('/categories'),
    ])
    setProducts(prodRes.data || [])
    setCategories(catRes.data || [])
  }, [])

  useEffect(() => {
    load().catch((err) => console.error('Failed to load products', err)).finally(() => setLoading(false))
  }, [load])

  useLiveRefresh(['products', 'categories'], load)

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? Its images will also be removed from Cloudinary.`)) return
    try {
      await api.del(`/products/${product.id}`)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  const handleSaved = (saved) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === saved.id)
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
    })
    setEditing(undefined)
  }

  const term = searchTerm.trim().toLowerCase()
  const filtered = products.filter((p) => {
    const matchSearch = !term || p.name.toLowerCase().includes(term) || p.slug?.includes(term)
    const matchCat = categoryFilter ? p.category === categoryFilter : true
    return matchSearch && matchCat
  })

  return (
    <div>
      <PageHeader
        firstWord="Manage" secondWord="Products" accentColor="text-emerald-500"
        subtitle={`View and edit your store inventory · ${products.length} products`}
      >
        <PillButton label="New Product" icon={Plus} variant="success" onClick={() => setEditing(null)} />
      </PageHeader>

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setVisible(PAGE_SIZE) }}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setVisible(PAGE_SIZE) }}
            className="px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
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
                filtered.slice(0, visible).map((p) => (
                  <tr key={p.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Thumb src={p.image} alt={p.name} />
                        <div>
                          <p className="font-semibold text-neutral-900">{p.name}</p>
                          <p className="text-xs text-neutral-400 truncate max-w-[260px]">{p.shortDescription || p.description}</p>
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
                        <button onClick={() => setEditing(p)} title="Edit" className="p-1.5 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p)} title="Delete" className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

        {filtered.length > visible && (
          <div className="pt-5 text-center">
            <PillButton label={`Show more (${filtered.length - visible} remaining)`} variant="secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)} />
          </div>
        )}
      </div>

      {editing !== undefined && (
        <ProductForm
          product={editing}
          categories={categories}
          onClose={() => setEditing(undefined)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
