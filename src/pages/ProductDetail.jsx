import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChevronLeft, CheckCircle2, ShoppingCart, ShieldCheck, Zap, ArrowRight, MessageSquare, SearchX,
} from 'lucide-react'

import Reveal from '../components/Reveal'
import ProductImage from '../components/ProductImage'
import { fadeUp, fadeLeft, fadeRight, stagger } from '../lib/motion'
import { useCart } from '../context/CartContext'
import { useProducts, useProduct } from '../context/ProductsContext'

const TABS = [
  { key: 'description', label: 'Description' },
  { key: 'details', label: 'Details' },
]

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { products } = useProducts()
  const { product, loading } = useProduct(id)
  const [activeTab, setActiveTab] = useState('description')
  const [added, setAdded] = useState(false)

  if (loading) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[500px] rounded-[2.5rem] bg-neutral-100 animate-pulse" />
          <div className="space-y-4 pt-12">
            <div className="h-6 w-32 bg-neutral-100 rounded animate-pulse" />
            <div className="h-12 w-3/4 bg-neutral-100 rounded animate-pulse" />
            <div className="h-8 w-40 bg-neutral-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 min-h-[70vh] flex items-start justify-center px-6">
        <div className="text-center max-w-md">
          <SearchX className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-neutral-900 mb-2">Product not found</h1>
          <p className="text-neutral-500 mb-8">This product may have been removed or the link is incorrect.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-[#1877F2] text-white px-6 py-3 rounded-xl font-bold">
            Browse the marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  const inStock = product.inStock !== false
  const relatedProducts = [
    ...products.filter((p) => p.id !== product.id && p.category === product.category),
    ...products.filter((p) => p.id !== product.id && p.category !== product.category),
  ].slice(0, 4)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const highlights = (product.tags?.length ? product.tags : [
    `${product.category || 'Digital'} solution`,
    product.deliveryType === 'digital' || !product.deliveryType ? 'Digital delivery' : product.deliveryType,
    'Support from the Visionary IT team',
  ]).slice(0, 5)

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors mb-8">
          <ChevronLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        {/* Top Section */}
        <motion.div
          key={product.id}
          initial="hidden"
          animate="visible"
          variants={stagger(0.1, 0.2)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          {/* Image */}
          <motion.div variants={fadeLeft} className="bg-[#eaf4e2] rounded-[2.5rem] relative overflow-hidden h-[340px] sm:h-[500px]">
            <ProductImage product={product} fit="object-contain" className="w-full h-full object-cover p-6 sm:p-12 hover:scale-105 transition-transform duration-700" iconClassName="w-24 h-24" />
          </motion.div>

          {/* Details */}
          <motion.div variants={fadeRight} className="flex flex-col justify-center">
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="inline-block px-4 py-1.5 bg-[#eef8ff] text-[#0095ff] text-xs font-bold uppercase rounded-md tracking-wider">
                {product.category}
              </span>
              {product.tag && (
                <span className="inline-block px-4 py-1.5 bg-[#2f88ff] text-white text-xs font-bold uppercase rounded-md tracking-wider">
                  {product.tag}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-extrabold text-neutral-900">
                {product.priceLabel || `Rs. ${product.price.toLocaleString()}`}
              </span>
              <span className={`px-3 py-1 text-sm font-bold rounded-full ${inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-neutral-100 text-neutral-500'}`}>
                {inStock ? 'Available' : 'Currently unavailable'}
              </span>
            </div>

            <p className="text-neutral-500 text-lg leading-relaxed mb-8">
              {product.shortDescription || product.description}
            </p>

            <ul className="space-y-4 mb-10">
              {highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 text-neutral-700 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className="flex-1 bg-[#1877F2] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1564d0] transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {added ? 'Added to cart ✓' : inStock ? 'Add to Cart' : 'Unavailable'}
              </button>
              <Link
                to="/contact"
                state={{ subject: 'General Support', message: `Hi, I have a question about "${product.name}".` }}
                className="flex-1 bg-white border border-neutral-200 text-neutral-900 px-8 py-4 rounded-xl font-bold hover:border-neutral-300 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Ask a Question
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#1877F2]" />
                <div>
                  <p className="font-bold text-neutral-900 text-sm">Secure Checkout</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Prices verified</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#1877F2]" />
                <div>
                  <p className="font-bold text-neutral-900 text-sm">Fast Delivery</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Digital access</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs Section */}
        <Reveal className="mb-20">
          <div className="flex items-center gap-8 border-b border-neutral-100 mb-8">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all relative ${
                  activeTab === tab.key ? 'text-[#1877F2]' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900">About this {product.category?.toLowerCase() || 'product'}</h3>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900">Details</h3>
                <ul className="space-y-3">
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Category:</strong> {product.category}</li>
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Price:</strong> Rs. {product.price.toLocaleString()}</li>
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Delivery:</strong> <span className="capitalize">{product.deliveryType || 'digital'}</span></li>
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Availability:</strong> {inStock ? 'Available' : 'Currently unavailable'}</li>
                  {product.updatedAt && (
                    <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Last updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Reveal>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-neutral-100 pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-neutral-900">You May Also Like</h2>
              <Link to="/shop" className="text-[#1877F2] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Browse More <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <motion.div
              variants={stagger(0, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {relatedProducts.map((rel) => (
                <motion.div variants={fadeUp} key={rel.id}>
                  <Link to={`/product/${rel.id}`} className="bg-white border border-neutral-100 hover:border-neutral-200 rounded-[2.5rem] overflow-hidden group transition-all shadow-sm hover:shadow-md flex flex-col product-card-hover h-full">
                    <div className="relative h-48 bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
                      <ProductImage product={rel} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" iconClassName="w-10 h-10" />
                      <span className="absolute top-4 left-4 px-3 py-1 bg-[#2f88ff] text-white text-[10px] font-bold uppercase rounded-xl shadow-sm z-10">
                        {rel.tag}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <span className="inline-block px-3 py-1 bg-[#eef8ff] text-[#0095ff] text-[10px] font-bold uppercase rounded-md tracking-wider self-start mb-3">
                        {rel.category}
                      </span>
                      <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-1">{rel.name}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed mb-4 h-10 overflow-hidden text-ellipsis">
                        {rel.desc}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-neutral-900 font-extrabold text-xl tracking-tight">Rs. {rel.price.toLocaleString()}</span>
                        <div className="w-10 h-10 bg-[#111111] text-white rounded-xl flex items-center justify-center group-hover:bg-black transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
