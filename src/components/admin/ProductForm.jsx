import { useEffect, useState } from 'react'
import { X, Save } from 'lucide-react'
import ImageUploader from './ImageUploader'
import PillButton from './PillButton'
import { api, errorMessage } from '../../lib/api'
import { slugify } from '../../lib/format'

const EMPTY = {
  name: '', slug: '', category: '', price: '', badge: '',
  shortDescription: '', description: '', bestSeller: false, inStock: true, images: [],
}

const inputCls = 'w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10'
const labelCls = 'block text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-500 mb-1.5'

/** Create / edit product modal. `product` is null for a new product. */
export default function ProductForm({ product, categories, onClose, onSaved }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState(EMPTY)
  const [slugTouched, setSlugTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (product) {
      setForm({
        ...EMPTY,
        ...product,
        price: product.price ?? '',
        badge: product.badge || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        images: [product.image, ...(product.images || [])].filter(Boolean),
      })
      setSlugTouched(true)
    }
  }, [product])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({
      ...f,
      [field]: value,
      ...(field === 'name' && !slugTouched && { slug: slugify(value) }),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.images.length) {
      setError('Please upload at least one image.')
      return
    }

    const [image, ...images] = form.images
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      shortDescription: form.shortDescription.trim() || undefined,
      badge: form.badge.trim() || undefined,
      bestSeller: form.bestSeller,
      inStock: form.inStock,
      image,
      images,
    }

    setSaving(true)
    try {
      const res = isEdit
        ? await api.patch(`/products/${product.id}`, payload)
        : await api.post('/products', payload)
      onSaved(res.data)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4 sm:p-8" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-neutral-100">
          <h2 id="product-form-title" className="text-xl font-display font-bold">{isEdit ? 'Edit product' : 'New product'}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-neutral-400 hover:bg-neutral-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-5">
          <div>
            <span className={labelCls}>Images</span>
            <ImageUploader value={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <span className={labelCls}>Name</span>
              <input required minLength={2} value={form.name} onChange={set('name')} className={inputCls} />
            </label>
            <label>
              <span className={labelCls}>Slug (URL)</span>
              <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" title="lowercase letters, numbers and hyphens" value={form.slug}
                onChange={(e) => { setSlugTouched(true); set('slug')(e) }} className={inputCls} />
            </label>
            <label>
              <span className={labelCls}>Category</span>
              <input required list="product-categories" value={form.category} onChange={set('category')} className={inputCls} />
              <datalist id="product-categories">
                {categories.map((c) => <option key={c.id || c.name} value={c.name} />)}
              </datalist>
            </label>
            <label>
              <span className={labelCls}>Price (Rs.)</span>
              <input required type="number" min="0" step="any" value={form.price} onChange={set('price')} className={inputCls} />
            </label>
            <label>
              <span className={labelCls}>Badge (optional)</span>
              <input value={form.badge} onChange={set('badge')} placeholder="e.g. Best Seller" className={inputCls} />
            </label>
            <div className="flex items-end gap-6 pb-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.inStock} onChange={set('inStock')} className="w-4 h-4 accent-brand-500" /> In stock
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.bestSeller} onChange={set('bestSeller')} className="w-4 h-4 accent-brand-500" /> Best seller
              </label>
            </div>
          </div>

          <label className="block">
            <span className={labelCls}>Short description (optional)</span>
            <input value={form.shortDescription} onChange={set('shortDescription')} maxLength={200} className={inputCls} />
          </label>
          <label className="block">
            <span className={labelCls}>Description</span>
            <textarea required minLength={10} rows={4} value={form.description} onChange={set('description')} className={inputCls} />
          </label>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 whitespace-pre-line">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 px-6 sm:px-8 pb-6">
          <PillButton label="Cancel" variant="secondary" onClick={onClose} />
          <PillButton type="submit" label={saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'} icon={Save} variant="success" disabled={saving} />
        </div>
      </form>
    </div>
  )
}
