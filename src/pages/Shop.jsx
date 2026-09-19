import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search, ShoppingCart, Eye, ChevronDown, X, ArrowRight
} from 'lucide-react'

import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductsContext'
import ProductImage from '../components/ProductImage'
import { fadeUp } from '../lib/motion'

const PAGE_SIZE = 24

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'All')
  const [sortBy, setSortBy] = useState('popular')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const { addToCart } = useCart()
  const { products, categories: productCategories, status } = useProducts()
  const categories = ['All', ...productCategories]

  // Keep the URL shareable (/shop?q=seo&category=SaaS)
  useEffect(() => {
    const next = {}
    if (search) next.q = search
    if (selectedCat !== 'All') next.category = selectedCat
    setSearchParams(next, { replace: true })
    setVisible(PAGE_SIZE)
  }, [search, selectedCat, setSearchParams])

  const term = search.trim().toLowerCase()
  const filtered = products
    .filter((p) => selectedCat === 'All' || p.category === selectedCat)
    .filter((p) => !term || `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(term))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '')
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0 // "Featured": the API already returns best sellers first
    })

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-3">The Marketplace</h1>
          <p className="text-neutral-500 text-lg">
            Explore our premium selection of IT software and digital assets.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 md:p-4 rounded-[2rem] flex flex-col xl:flex-row items-center gap-4 shadow-sm border border-neutral-100">

          {/* Search */}
          <div className="relative w-full xl:w-64 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:border-brand-500 transition-all bg-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex-1 w-full overflow-hidden relative flex items-center">
            {/* Scrollable container */}
            <div className="flex gap-2 overflow-x-auto w-full pb-2 scroll-smooth items-center px-1" style={{ scrollbarWidth: 'thin' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${selectedCat === cat
                    ? 'bg-[#1877F2] text-white border-[#1877F2]'
                    : 'bg-white text-neutral-600 border-neutral-100 hover:border-neutral-300'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full xl:w-48 shrink-0 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-100 rounded-2xl text-sm font-bold text-neutral-700 focus:outline-none focus:border-brand-500 appearance-none bg-white pr-10 cursor-pointer"
            >
              <option value="popular">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="name">Name: A to Z</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-neutral-500 text-sm mb-6">
          {status === 'loading' ? 'Loading products…' : `${filtered.length} products found`}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.slice(0, visible).map((product, index) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp}
              transition={{ delay: Math.min((index % PAGE_SIZE) * 0.03, 0.3) }}
              className="bg-white border border-neutral-100 hover:border-neutral-200 rounded-[2.5rem] overflow-hidden group transition-all shadow-sm hover:shadow-md flex flex-col product-card-hover"
            >
              <div className="relative h-55 bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
                <ProductImage product={product} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" iconClassName="w-10 h-10" />

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Badge */}
                {product.inStock === false && (
                  <span className="absolute top-5 right-5 px-3 py-1.5 bg-neutral-900 text-white text-[11px] font-bold uppercase rounded-xl z-10">Sold out</span>
                )}
                <span className="absolute top-5 left-5 px-4 py-1.5 bg-[#2f88ff] text-white text-[11px] font-bold uppercase rounded-xl tracking-wide shadow-sm z-10">
                  {product.tag}
                </span>

                {/* Center Hover Buttons */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 z-20">
                  <Link
                    to={`/product/${product.id}`}
                    className="w-14 h-14 bg-white rounded-[1.25rem] shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Eye className="w-5 h-5 text-neutral-800" />
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.inStock === false}
                    aria-label={`Add ${product.name} to cart`}
                    className="disabled:opacity-40 w-14 h-14 bg-white rounded-[1.25rem] shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <ShoppingCart className="w-5 h-5 text-neutral-800" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-[#eef8ff] text-[#0095ff] text-[10px] font-bold uppercase rounded-md tracking-wider">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-1">{product.name}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6 h-10 overflow-hidden text-ellipsis">
                  {product.desc}
                </p>
                <div className="flex items-end justify-between mt-auto">
                  <span className="text-neutral-900 font-extrabold text-xl tracking-tight">Rs. {product.price.toLocaleString()}</span>
                  <Link
                    to={`/product/${product.id}`}
                    className="w-10 h-10 bg-[#111111] text-white rounded-xl flex items-center justify-center hover:bg-black hover:scale-105 transition-all shadow-md shrink-0"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length > visible && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="px-8 py-3.5 rounded-xl border border-neutral-200 font-bold text-sm text-neutral-700 hover:border-neutral-400 transition-colors"
            >
              Load more ({filtered.length - visible} more)
            </button>
          </div>
        )}

        {filtered.length === 0 && status !== 'loading' && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-bold text-neutral-900 mb-2">No products found</h3>
            <p className="text-neutral-500 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

    </div>
  )
}
