import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../lib/api'
import bundledProducts from '../data/products.json'

/**
 * Live product catalogue for the storefront.
 * Loads from the API (so admin changes show up immediately) and falls back to the
 * catalogue bundled with the site when the API cannot be reached.
 */
const ProductsContext = createContext(null)

const REFRESH_AFTER_MS = 60_000

const normalize = (p) => ({
  ...p,
  tag: p.badge || (p.bestSeller ? 'Best Seller' : 'New'),
  desc: p.shortDescription || p.description || '',
})

const FALLBACK = bundledProducts.map(normalize)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(FALLBACK)
  const [status, setStatus] = useState('loading') // loading | live | offline
  const lastLoaded = useRef(0)
  const inFlight = useRef(null)

  const refresh = useCallback(() => {
    if (inFlight.current) return inFlight.current
    inFlight.current = api.get('/products?limit=1000&sort=featured')
      .then((res) => {
        setProducts((res.data || []).map(normalize))
        setStatus('live')
        lastLoaded.current = Date.now()
      })
      .catch(() => {
        setStatus((s) => (s === 'live' ? s : 'offline'))
      })
      .finally(() => {
        inFlight.current = null
      })
    return inFlight.current
  }, [])

  useEffect(() => {
    refresh()
    // Pick up admin changes when the visitor comes back to the tab
    const onFocus = () => {
      if (Date.now() - lastLoaded.current > REFRESH_AFTER_MS) refresh()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [refresh])

  const value = useMemo(() => {
    const byId = new Map(products.map((p) => [p.id, p]))
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort()
    return {
      products,
      categories,
      status,
      refresh,
      getProduct: (id) => byId.get(id),
    }
  }, [products, status, refresh])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used inside <ProductsProvider>')
  return ctx
}

/**
 * A single product: from the catalogue if present, otherwise fetched from the API
 * (e.g. a product added moments ago). `product` is null when it does not exist.
 */
export function useProduct(id) {
  const { getProduct, status } = useProducts()
  const cached = getProduct(id)
  const [fetched, setFetched] = useState({ id: null, product: undefined })

  useEffect(() => {
    if (cached || status === 'loading') return
    let cancelled = false
    api.get(`/products/${encodeURIComponent(id)}`)
      .then((res) => !cancelled && setFetched({ id, product: normalize(res.data) }))
      .catch(() => !cancelled && setFetched({ id, product: null }))
    return () => { cancelled = true }
  }, [id, cached, status])

  if (cached) return { product: cached, loading: false }
  if (fetched.id === id) return { product: fetched.product, loading: false }
  return { product: undefined, loading: true }
}
