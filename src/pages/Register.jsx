import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Monitor, Eye, EyeOff, UserPlus, Mail, Lock, User } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { api } from '../lib/api'

export default function Register() {
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // 1. Create the account (Firebase Auth user + Firestore profile) on the API
      await api.post('/auth/register', { fullName: form.name, email: form.email, password: form.password })

      // 2. Sign in with the Firebase Web SDK and exchange the ID token for a session cookie
      const { user } = await signInWithEmailAndPassword(auth, form.email, form.password)
      await api.post('/auth/session', { idToken: await user.getIdToken() })

      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Could not create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[46%] bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-brand-700/30 rounded-full blur-[120px]" />
          <div className="absolute top-32 right-0 w-[400px] h-[400px] border-[60px] border-white/5 rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">

          <h1 className="text-4xl font-display font-bold leading-[1.2] mb-6">
            Join Thousands of<br /><span className="text-accent-cyan">Happy Clients</span>
          </h1>
          <p className="text-neutral-400 leading-relaxed max-w-sm">
            Create your account and get instant access to our complete library of enterprise-grade digital solutions, premium support, and exclusive deals.
          </p>
          <div className="mt-12 space-y-4">
            {['Access 10,000+ premium products', 'Exclusive member discounts', 'Priority 24/7 support', 'Free updates & upgrades'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                </div>
                <span className="text-neutral-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-24 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="bg-brand-500 p-2.5 rounded-xl">
              <Monitor className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-neutral-900">
              Visionary<span className="text-white bg-brand-500 px-1.5 py-0.5 rounded-md mx-0.5">IT</span>
            </span>
          </div>

          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">Create account</h2>
          <p className="text-neutral-500 mb-8">Get started with your free account today</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder-neutral-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder-neutral-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-11 pr-12 py-3.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat your password"
                  className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition-all placeholder-neutral-500"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="w-4 h-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500 mt-0.5" />
              <span className="text-sm text-neutral-600">
                I agree to the <a href="#" className="text-brand-500 font-medium hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-brand-500 font-medium hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95 disabled:opacity-70"
            >
              <UserPlus className="w-4 h-4" /> {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
