import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Monitor, Mail, Phone, MapPin } from 'lucide-react'
import { api, errorMessage } from '../lib/api'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState({ status: 'idle', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setState({ status: 'sending', message: '' })
    try {
      await api.post('/newsletter/subscribe', { email })
      setEmail('')
      setState({ status: 'done', message: 'Thanks! You are subscribed.' })
    } catch (err) {
      setState({ status: 'error', message: errorMessage(err) })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto">
      <div className="flex w-full md:w-auto gap-3">
        <input
          type="email"
          required
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full md:w-80 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-[#3b82f6] text-white placeholder:text-[#64748b] transition-all"
        />
        <button
          type="submit"
          disabled={state.status === 'sending'}
          className="px-6 py-3 bg-[#3b82f6] text-white font-bold rounded-xl text-sm hover:bg-[#2563eb] transition-colors whitespace-nowrap disabled:opacity-60"
        >
          {state.status === 'sending' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {state.message && (
        <p role="status" className={`text-xs mt-2 ${state.status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{state.message}</p>
      )}
    </form>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#021127] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="pr-4">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="bg-[#3b82f6] p-2.5 rounded-xl">
                <Monitor className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                VisionaryIT
              </span>
            </Link>
            <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
              Empowering organizations with cutting-edge IT solutions, premium software licenses, and bespoke digital transformation services.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-[#cbd5e1]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-[#cbd5e1]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-[#cbd5e1]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                <svg className="w-4 h-4 text-[#cbd5e1]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6">Solutions</h4>
            <ul className="space-y-4">
              {[
                { name: 'Marketplace Overview', path: '/shop' },
                { name: 'Enterprise Software', path: '/shop?category=Software' },
                { name: 'Cloud Applications', path: '/shop?category=SaaS' },
                { name: 'Web Templates', path: '/shop?category=Templates' },
                { name: 'Digital Transformation', path: '/about' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-[#94a3b8] hover:text-white transition-colors text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Client Support', to: '/contact' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Shipping & Returns', to: '/shipping' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Terms of Service', to: '/terms' },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-[#94a3b8] hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#3b82f6]" />
                </div>
                <span className="text-[#94a3b8] text-sm leading-relaxed mt-0.5">
                  Office No. 131, 1st Floor, Swiss Center, D-12 Markaz, Islamabad
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#3b82f6]" />
                </div>
                <span className="text-[#94a3b8] text-sm">+92 342 1932855</span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#3b82f6]" />
                </div>
                <span className="text-[#94a3b8] text-sm">info@visionaryitservices.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter / Stay in the Loop */}
        <div className="bg-[#051733] border border-white/5 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Stay in the Loop</h3>
            <p className="text-[#94a3b8] text-sm">Get the latest deals and product updates delivered to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[#64748b] text-[10px] uppercase font-bold tracking-widest text-center md:text-left">
            © 2026 VISIONARY IT SERVICES (SMC-PRIVATE LIMITED). ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            {[
              { name: 'Privacy Policy', path: '/privacy' },
              { name: 'Terms of Service', path: '/terms' },
              { name: 'FAQ', path: '/faq' },
              { name: 'Shipping & Returns', path: '/shipping' }
            ].map((item) => (
              <Link key={item.name} to={item.path} className="text-[#64748b] hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
