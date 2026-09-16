import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, CheckCircle2, ShoppingCart, PlayCircle, 
  ShieldCheck, Zap, ArrowRight, Monitor, Star 
} from 'lucide-react'

import Reveal from '../components/Reveal'
import { EASE, fadeUp, fadeLeft, fadeRight, stagger } from '../lib/motion'

import allProductsData from '../data/products.json'
import { useCart } from '../context/CartContext'

const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-orange-500', 'bg-cyan-500', 'bg-rose-500', 'bg-violet-500', 'bg-green-500']

const allProducts = allProductsData.map((p, index) => ({
  ...p,
  tag: p.badge || 'New',
  desc: p.description || '',
  color: colors[index % colors.length]
}))

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState('description')

  // Find product or default to the first one for demonstration
  const product = allProducts.find(p => p.id === id) || allProducts[0]

  // Get some recommendations
  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 4)

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
          initial="hidden"
          animate="visible"
          variants={stagger(0.1, 0.2)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          
          {/* Image */}
          <motion.div variants={fadeLeft} className="bg-[#eaf4e2] rounded-[2.5rem] p-12 flex items-center justify-center relative overflow-hidden h-[500px]">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" />
            ) : (
              <div className={`w-full h-full ${product.color} rounded-2xl flex items-center justify-center shadow-2xl hover:scale-105 transition-transform duration-700`}>
                <Monitor className="w-24 h-24 text-white" />
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div variants={fadeRight} className="flex flex-col justify-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 bg-[#eef8ff] text-[#0095ff] text-xs font-bold uppercase rounded-md tracking-wider">
                {product.category || 'MOBILE APP'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-extrabold text-neutral-900">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className="text-lg text-neutral-400 line-through font-bold">
                Rs. {Math.round(product.price * 1.25).toLocaleString()}
              </span>
              <span className="px-3 py-1 bg-[#eef8ff] text-[#0095ff] text-sm font-bold rounded-full">
                Save 20%
              </span>
            </div>

            <p className="text-neutral-500 text-lg leading-relaxed mb-8">
              {product.desc || 'Weekly meal planning, grocery lists, and recipe suggestions based on diet.'}
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-neutral-700 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Dietary filters
              </li>
              <li className="flex items-center gap-3 text-neutral-700 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Nutrition info
              </li>
              <li className="flex items-center gap-3 text-neutral-700 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Shopping list generator
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-[#1877F2] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#1564d0] transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="flex-1 bg-white border border-neutral-200 text-neutral-900 px-8 py-4 rounded-xl font-bold hover:border-neutral-300 transition-colors flex items-center justify-center gap-2">
                Instant Demo
              </button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#1877F2]" />
                <div>
                  <p className="font-bold text-neutral-900 text-sm">Authenticity Guard</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">100% Original</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-[#1877F2]" />
                <div>
                  <p className="font-bold text-neutral-900 text-sm">Fast Delivery</p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Instant Access</p>
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* Tabs Section */}
        <Reveal className="mb-20">
          <div className="flex items-center gap-8 border-b border-neutral-100 mb-8">
            <button 
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all relative ${
                activeTab === 'description' ? 'text-[#1877F2]' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Description
              {activeTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-t-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all relative ${
                activeTab === 'specs' ? 'text-[#1877F2]' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Tech Specs
              {activeTab === 'specs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-t-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-2 pb-4 font-bold text-sm transition-all relative ${
                activeTab === 'reviews' ? 'text-[#1877F2]' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Reviews
              {activeTab === 'reviews' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1877F2] rounded-t-full" />
              )}
            </button>
          </div>

          <div className="max-w-3xl">
            {activeTab === 'description' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-neutral-900">Experience Tomorrow's Software Today</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {product.desc} Our {product.category || 'Mobile App'} solution is meticulously engineered to provide the highest level of performance, reliability, and security for your business environment.
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  Built with scalability in mind, it integrates seamlessly with existing enterprise systems and modern cloud architectures. Whether you're a startup or a global corporation, Visionary IT provides the foundation for your next digital breakthrough.
                </p>
              </div>
            )}
            
            {activeTab === 'specs' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-bold text-neutral-900">Technical Specifications</h3>
                <ul className="space-y-3">
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Platform:</strong> iOS & Android</li>
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Tech Stack:</strong> React Native, Node.js</li>
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Version:</strong> 2.4.1</li>
                  <li className="flex text-neutral-600"><strong className="w-40 text-neutral-900">Last Updated:</strong> Oct 2026</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex text-[#FFB800]">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <span className="font-bold text-neutral-900">5.0 (24 reviews)</span>
                </div>
                <div className="space-y-8">
                  <div className="border-b border-neutral-100 pb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-neutral-900">Incredible solution for our team</h4>
                      <span className="text-sm text-neutral-400">2 days ago</span>
                    </div>
                    <p className="text-neutral-600">This software completely transformed how we handle our daily operations. The interface is intuitive and the customer support is top-notch.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* You May Also Like */}
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
            {relatedProducts.map(rel => (
              <motion.div variants={fadeUp} key={rel.id}>
                <Link to={`/product/${rel.id}`} className="bg-white border border-neutral-100 hover:border-neutral-200 rounded-[2.5rem] overflow-hidden group transition-all shadow-sm hover:shadow-md flex flex-col product-card-hover block h-full">
                <div className="relative h-48 bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
                  {rel.image ? (
                    <img src={rel.image} alt={rel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${rel.color} group-hover:scale-110 transition-transform`}>
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#2f88ff] text-white text-[10px] font-bold uppercase rounded-xl shadow-sm z-10">
                    {rel.tag || 'Best Seller'}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block px-3 py-1 bg-[#eef8ff] text-[#0095ff] text-[10px] font-bold uppercase rounded-md tracking-wider self-start mb-3">
                    {rel.category || 'MOBILE APP'}
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

      </div>
    </div>
  )
}
