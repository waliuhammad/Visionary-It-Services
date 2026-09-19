import { useState, useEffect, useCallback } from 'react'
import { FolderPlus, Trash2 } from 'lucide-react'
import PageHeader from '../../components/admin/PageHeader'
import PillButton from '../../components/admin/PillButton'
import { api, errorMessage } from '../../lib/api'
import { useLiveRefresh } from '../../context/RealtimeContext'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?limit=1000'),
      ])
      setCategories(catRes.data || [])
      setProducts(prodRes.data || [])
    } catch (err) {
      console.error('Failed to load categories', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useLiveRefresh(["categories","products"], load)

  const getProductCount = (catName) => {
    return products.filter(p => p.category === catName).length
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return
    try {
      await api.del(`/categories/${id}`)
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  const handleCreate = async () => {
    const name = window.prompt('Enter new category name:')
    if (!name) return
    try {
      const res = await api.post('/categories', { name })
      setCategories(prev => [...prev, res.data])
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  return (
    <div>
      <PageHeader
        firstWord="Store" secondWord="Categories" accentColor="text-orange-500"
        subtitle="Organize your product catalog"
      >
        <PillButton label="New Category" icon={FolderPlus} onClick={handleCreate} className="bg-orange-500 hover:bg-orange-600 shadow-orange-500/20" />
      </PageHeader>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-3xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
          <p className="text-neutral-500">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <div key={c.id || i} className="bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display font-bold text-lg text-neutral-900">{c.name}</h3>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {c.description && <p className="text-sm text-neutral-500 mb-4">{c.description}</p>}
                {c.imageUrl && <img src={c.imageUrl} alt={c.name} className="w-full h-32 object-cover rounded-xl mb-4" />}

                <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Products</span>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                    {getProductCount(c.name)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
