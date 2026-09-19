import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Monitor, Search, ShoppingCart, LogIn, Menu, X, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { EASE } from '../lib/motion'

import { useProducts } from '../context/ProductsContext'
import ProductImage from './ProductImage'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { getCartCount } = useCart()
  const { products } = useProducts()
  const cartCount = getCartCount()
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  const isActive = (path) => location.pathname === path

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchOpen])

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false)
    setSearchQuery('')
  }, [location.pathname])

  // Navbar scroll shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Filter products based on search query
  const searchResults = searchQuery.trim()
    ? products
        .filter(p => (p.name || '').toLowerCase().includes(searchQuery.trim().toLowerCase()))
        .slice(0, 4)
    : []

  const handleViewAll = () => {
    const q = searchQuery.trim()
    setSearchOpen(false)
    setSearchQuery('')
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 glass ${
      scrolled ? 'py-2 shadow-sm' : 'py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-brand-500 p-2.5 rounded-xl group-hover:rotate-12 transition-all shadow-lg shadow-brand-500/20">
            <Monitor className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">
            <span className="text-neutral-900">Visionary</span>
            <span className="text-white bg-brand-500 px-1.5 py-0.5 rounded-md mx-0.5">IT</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all hover:text-accent-cyan ${
                  isActive(link.to)
                    ? 'text-brand-500 underline underline-offset-8 decoration-2'
                    : 'text-neutral-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>

          <div className="flex items-center gap-4 ml-4">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {!searchOpen ? (
                /* Just the icon */
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full transition-colors text-neutral-500 hover:bg-neutral-100"
                >
                  <Search className="w-5 h-5" />
                </button>
              ) : (
                /* Expanded search input + dropdown */
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleViewAll() }}
                      placeholder="Search for software..."
                      className="w-56 xl:w-72 px-5 py-2.5 bg-white border-2 border-brand-100 rounded-full text-sm focus:outline-none focus:border-brand-300 transition-all placeholder:text-neutral-400 shadow-sm"
                    />
                    <button
                      onClick={handleViewAll}
                      className="p-2 text-brand-500 hover:text-brand-600 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Results Dropdown */}
                  {searchQuery.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-5 pt-4 pb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                          Quick Results
                        </span>
                      </div>

                      {searchResults.length > 0 ? (
                        <div className="px-2 pb-2">
                          {searchResults.map((product) => (
                            <Link
                              key={product.id}
                              to={`/product/${product.id}`}
                              onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-neutral-50 transition-colors"
                            >
                              <div className="w-12 h-12 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                                <ProductImage product={product} iconClassName="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-neutral-900 text-sm">{product.name}</p>
                                <p className="text-[11px] font-bold text-brand-500 uppercase tracking-wider">{product.category}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="px-5 py-4 text-sm text-neutral-400">
                          No results found
                        </div>
                      )}

                      <button
                        onClick={handleViewAll}
                        className="w-full py-3 text-center text-sm font-bold text-neutral-600 hover:bg-neutral-50 border-t border-neutral-100 transition-colors"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1"
                >
                  {cartCount}
                </motion.span>
              )}
            </Link>

            {/* Auth */}
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-neutral-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-neutral-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-bold uppercase tracking-[0.15em] py-2 ${
                isActive(link.to) ? 'text-brand-500' : 'text-neutral-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-neutral-100 pt-4 flex flex-col gap-3">
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-neutral-600"
            >
              <ShoppingCart className="w-4 h-4" /> Cart
            </Link>
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 text-sm font-bold text-neutral-600"
            >
              <LogIn className="w-4 h-4" /> Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="bg-brand-500 text-white text-sm font-bold rounded-xl py-3 text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
