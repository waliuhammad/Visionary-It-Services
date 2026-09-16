import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Shield, Zap, Globe, Users, Monitor, Cloud,
  Code, Smartphone, Star, CheckCircle, ChevronRight, Mail,
  ShoppingCart, Eye
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import { EASE, fadeUp, fadeLeft, fadeRight, scaleIn, stagger } from '../lib/motion'

const categories = [
  { icon: Shield, label: 'Software Licenses', desc: 'We provide premium-grade software licenses tailored for high-growth businesses.', iconBg: 'bg-[#3b82f6]', hoverBg: 'hover:bg-[#061936]' },
  { icon: Globe, label: 'Web Templates', desc: 'We provide premium-grade web templates tailored for high-growth businesses.', iconBg: 'bg-[#10b981]', hoverBg: 'hover:bg-[#061936]' },
  { icon: Zap, label: 'Mobile Apps', desc: 'We provide premium-grade mobile apps tailored for high-growth businesses.', iconBg: 'bg-[#f97316]', hoverBg: 'hover:bg-[#061936]' },
  { icon: Cloud, label: 'SaaS Tools', desc: 'We provide premium-grade saas tools tailored for high-growth businesses.', iconBg: 'bg-[#a855f7]', hoverBg: 'hover:bg-[#061936]' },
]

const trendingProducts = [
  { id: 1, name: 'PhotoEditor X', category: 'Software', desc: 'Professional photo editing suite with layers, filters, and AI enhancements.', price: 2500, tag: 'Best Seller', image: '/assets/professional-copy-typing-services-for-business.png' },
  { id: 2, name: 'FitTrack', category: 'Mobile App', desc: 'Mobile workout tracker with personalized plans, diet logs, and...', price: 1000, tag: 'Best Seller', image: '/assets/Shopify-Store-Mobile-Preview-Banner-768x723.webp' },
  { id: 3, name: 'Antivirus Shield', category: 'Software', desc: 'Real-time malware protection, firewall, and secure VPN included.', price: 1500, tag: 'Best Seller', image: '/assets/shutterstock_ai_assistant-768x768-1.jpg' },
  { id: 4, name: 'Focus Keeper', category: 'Productivity', desc: 'Pomodoro timer with distraction blocker and productivity analytics.', price: 1000, tag: 'Best Seller', image: '/assets/wordpress-landing-pages-screenshot-768x464.jpg' },
]

const whyUs = [
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade encryption and security protocols protecting your assets 24/7.' },
  { icon: Zap, title: 'Lightning Performance', desc: 'Optimized infrastructure delivering sub-second response times globally.' },
  { icon: Users, title: 'Dedicated Support', desc: '24/7 expert team ready to assist you with any technical challenges.' },
  { icon: Globe, title: 'Global Reach', desc: 'Serving clients across 50+ countries with localized support and solutions.' },
]

const testimonials = [
  { name: 'Usman Ali', role: 'CEO, TechFlow Agency', text: 'Visionary IT has transformed how our agency sources licenses. The instant delivery and premium support are unmatched in the current market.' },
  { name: 'Ayesha Malik', role: 'CTO, Brightstack Solutions', text: 'The SaaS tools we purchased saved us weeks of development time. Exceptional quality and the onboarding support was incredibly thorough.' },
  { name: 'Ahmed Raza', role: 'Founder, Nexora Digital', text: 'From web templates to software licenses, everything works out of the box. Visionary IT is now our go-to partner for all digital assets.' },
]

export default function Home() {
  const { addToCart } = useCart()

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-24 bg-brand-900 text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-800/30 to-transparent" />
          {/* Animated glow blobs */}
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-500/20 blur-[120px] pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-20 -left-10 w-[500px] h-[500px] rounded-full bg-accent-cyan/10 blur-[120px] pointer-events-none"
          />
          <div
            style={{ opacity: 0.1 }}
            className="absolute -bottom-20 -right-20 w-[600px] h-[600px] border-[60px] border-white/20 rounded-full pointer-events-none"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-full text-accent-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              Future-Proofing Your Business
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-8"
            >
              Transforming <span className="text-accent-cyan">Ideas</span> into Digital Reality.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
              className="text-lg text-neutral-400 mb-10 max-w-lg leading-relaxed font-medium"
            >
              Empowering organizations with world-class IT consultancy, bespoke software development, and premium digital licenses.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.4 }}
              className="flex flex-wrap gap-5"
            >
              <Link
                to="/shop"
                className="bg-brand-500 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-600 transition-all shadow-xl shadow-brand-500/20 active:scale-95"
              >
                Explore Products <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white/20 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/5 transition-all text-sm uppercase tracking-widest"
              >
                Get a Quote
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="aspect-[4/5] rounded-3xl border border-white/10 overflow-hidden">
                  <img src="/assets/1.jpg" alt="Visionary IT Landscape" className="w-full h-full object-cover" />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
                  className="aspect-square bg-[#00AEEF] rounded-3xl p-8 flex flex-col justify-end text-white"
                >
                  <h4 className="text-2xl font-bold leading-tight">24/7 Expert<br />Support</h4>
                </motion.div>
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
                  className="aspect-square bg-white border border-neutral-100 rounded-3xl p-8 flex flex-col justify-end text-neutral-900"
                >
                  <h4 className="text-2xl font-bold leading-tight">Agile<br />Workflow</h4>
                </motion.div>
                <div className="aspect-[4/5] rounded-3xl border border-white/10 overflow-hidden">
                  <img src="/assets/2.jpg" alt="Agile Workflow Fields" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Ecosystem */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end mb-16">
              <div>
                <div className="text-blue-500 text-[11px] font-extrabold uppercase tracking-widest mb-4">
                  STRATEGIC SERVICES
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 leading-tight">
                  Our Comprehensive <br />Technology Ecosystem
                </h2>
              </div>
              <div>
                <p className="text-neutral-500 max-w-md text-lg md:ml-auto leading-relaxed">
                  From enterprise software licensing to bespoke development, we provide the tools required for modern digital excellence.
                </p>
              </div>
            </div>
          </Reveal>
          <motion.div
            variants={stagger(0.1, 0.12)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {categories.map((cat) => (
              <motion.div key={cat.label} variants={fadeUp}>
                <Link
                  to="/shop"
                  className={`group p-8 rounded-[2rem] bg-[#f8f9fb] ${cat.hoverBg} transition-all duration-300 flex flex-col text-left product-card-hover block h-full`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-8 group-hover:bg-white transition-colors duration-300`}>
                    <cat.icon className="w-6 h-6 text-white group-hover:text-neutral-900 transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 group-hover:text-white mb-4 transition-colors duration-300">{cat.label}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300 mb-8">
                    {cat.desc}
                  </p>
                  <div className="mt-auto pt-6 border-t border-neutral-200 group-hover:border-white/20 transition-colors duration-300">
                    <span className="text-blue-500 font-bold text-sm flex items-center gap-2 group-hover:text-white transition-colors duration-300 group/btn">
                      View Products <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Solutions */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <div className="text-blue-500 text-[11px] font-extrabold uppercase tracking-widest mb-2">
                  CURATED SELECTION
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900">Trending Solutions</h2>
              </div>
              <Link
                to="/shop"
                className="mt-4 md:mt-0 text-neutral-600 font-bold text-sm flex items-center gap-2 hover:text-blue-500 transition-colors group/btn"
              >
                View All Collection <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>
          <motion.div
            variants={stagger(0.1, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trendingProducts.map((product) => (
              <motion.div
                key={product.name}
                variants={fadeUp}
                className="bg-white rounded-[2rem] overflow-hidden group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100 flex flex-col product-card-hover"
              >
                <div className="relative h-56 bg-neutral-100 overflow-hidden m-2 rounded-[1.5rem] img-zoom-container">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
                      <Monitor className="w-8 h-8 text-neutral-400" />
                    </div>
                  )}
                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-brand-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link 
                      to={`/product/${product.id}`}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-neutral-900 hover:bg-brand-500 hover:text-white transition-all active:scale-95"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-neutral-900 hover:bg-brand-500 hover:text-white transition-all active:scale-95"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#3b82f6] text-white text-[10px] font-bold uppercase rounded-md tracking-wider">
                    {product.tag}
                  </span>
                </div>
                <div className="p-6 pt-4 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="px-3 py-1.5 bg-[#e0f2fe] text-[#0ea5e9] text-[10px] font-extrabold uppercase rounded-md tracking-widest">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl text-neutral-900 mb-2">{product.name}</h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6 flex-1">
                    {product.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-neutral-900 font-bold text-2xl">Rs. {product.price.toLocaleString()}</span>
                    <Link 
                      to={`/product/${product.id}`}
                      className="w-12 h-12 bg-[#171717] rounded-xl flex items-center justify-center text-white hover:bg-blue-500 transition-colors active:scale-95"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enterprise Cloud Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[3rem] overflow-hidden h-[450px] flex items-center">
            {/* Background Image */}
            <img src="/assets/cityscape-winter.jpg" alt="Enterprise Software" className="absolute inset-0 w-full h-full object-cover scale-110" />
            <div className="absolute inset-0 bg-neutral-900/40" />
            <Reveal variants={fadeLeft} className="relative z-10 p-8 md:p-20 max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 m-6 md:m-20 rounded-[2rem]">
              <div className="text-blue-400 text-[11px] font-extrabold uppercase tracking-widest mb-6">
                LIMITED TIME EXCLUSIVE
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-[1.1] mb-6">
                Save 35% on <br />
                <span className="text-[#3b82f6]">Enterprise</span> Cloud <br />
                Suites
              </h2>
              <p className="text-neutral-200 text-lg mb-10 leading-relaxed max-w-md">
                Upgrade your workflow today with our premium enterprise solutions. Valid until the end of this month.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center bg-white text-neutral-900 px-8 py-4 rounded-xl font-bold hover:bg-neutral-100 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                Claim Discount
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="py-24 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-16">
                Why Global Leaders <br />Trust Visionary IT
              </h2>
            </Reveal>
            <motion.div
              variants={stagger(0.2, 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-2 gap-y-12 gap-x-8"
            >
              <motion.div variants={scaleIn}>
                <div className="text-4xl md:text-5xl font-bold text-[#3b82f6] mb-3"><CountUp value="15k+" /></div>
                <div className="text-[#a3a3a3] text-[10px] uppercase tracking-widest font-bold">ACTIVE CLIENTS</div>
              </motion.div>
              <motion.div variants={scaleIn}>
                <div className="text-4xl md:text-5xl font-bold text-[#3b82f6] mb-3"><CountUp value="2.5k+" /></div>
                <div className="text-[#a3a3a3] text-[10px] uppercase tracking-widest font-bold">SUCCESS SOLUTIONS</div>
              </motion.div>
              <motion.div variants={scaleIn}>
                <div className="text-4xl md:text-5xl font-bold text-[#3b82f6] mb-3"><CountUp value="450+" /></div>
                <div className="text-[#a3a3a3] text-[10px] uppercase tracking-widest font-bold">CLOUD SERVICES</div>
              </motion.div>
              <motion.div variants={scaleIn}>
                <div className="text-4xl md:text-5xl font-bold text-[#3b82f6] mb-3"><CountUp value="100%" /></div>
                <div className="text-[#a3a3a3] text-[10px] uppercase tracking-widest font-bold">24/7 SUPPORT</div>
              </motion.div>
            </motion.div>
          </div>
          <div className="space-y-6">
            <Reveal>
              <div className="bg-[#171717] rounded-3xl p-8 md:p-10 border border-white/5 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#3b82f6]" />
                  <h3 className="text-xl font-bold">Secured Infrastructure</h3>
                </div>
                <p className="text-[#a3a3a3] text-sm leading-relaxed max-w-sm">
                  We implement bank-level encryption and security protocols for all our digital transactions and software deliveries.
                </p>
                {/* Decorative line */}
                <svg className="absolute right-0 top-6 w-32 h-12 text-white/5 hidden sm:block" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M0 20 Q 25 5, 50 20 T 100 20" strokeLinecap="round" />
                  <circle cx="0" cy="20" r="3" fill="currentColor" />
                  <circle cx="100" cy="20" r="3" fill="currentColor" />
                </svg>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-[#171717] rounded-3xl p-8 md:p-10 border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-[#3b82f6]" />
                  <h3 className="text-xl font-bold">Instant Activation</h3>
                </div>
                <p className="text-[#a3a3a3] text-sm leading-relaxed max-w-sm">
                  Receive your digital licenses and access credentials immediately upon successful payment verification.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-neutral-900">Client Voices</h2>
              <p className="text-neutral-500 mt-4 text-lg">
                Trusted by thousands of developers and businesses worldwide.
              </p>
            </div>
          </Reveal>
          <motion.div
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-lg transition-all product-card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-500 fill-brand-500" />
                  ))}
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900 text-sm">{t.name}</p>
                    <p className="text-neutral-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal variants={scaleIn}>
            <div className="bg-brand-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-brand-700/40 rounded-full blur-[120px]"
              />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-accent-cyan text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                  Newsletter
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Stay Ahead of the Curve</h2>
                <p className="text-neutral-400 max-w-xl mx-auto mb-10 text-lg">
                  Subscribe to get exclusive offers, product launches, and expert insights delivered to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-accent-cyan focus:ring-4 focus:ring-brand-500/10 focus:bg-white/30 transition-all"
                    />
                  </div>
                  <button className="bg-brand-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95 hover:scale-105">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
