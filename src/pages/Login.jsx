import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Monitor, Eye, EyeOff, LogIn, Mail, Lock, ShieldCheck, Zap, Globe } from 'lucide-react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { api } from '../lib/api'

export default function Login() {
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState(null)
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setLoading(true)

    try {
      // 1. Sign in with the Firebase Web SDK
      const { user } = await signInWithEmailAndPassword(auth, form.email, form.password)

      // 2. Exchange the fresh ID token for an httpOnly session cookie
      const { data } = await api.post('/auth/session', { idToken: await user.getIdToken() })

      // 3. Admins go to the dashboard, everyone else back to where they came from.
      // A full page load makes sure the new cookie is used by every request.
      const from = location.state?.from?.pathname
      window.location.href = from || (data?.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      const code = err?.code || ''
      setError(
        code.startsWith('auth/')
          ? 'Invalid email or password.'
          : err.message || 'Could not sign in. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError(null)
    setNotice(null)
    if (!form.email) {
      setError('Enter your email address first, then click "Forgot password?".')
      return
    }
    try {
      await api.post('/auth/password-reset', { email: form.email })
      setNotice('If an account exists for that email, a reset link has been sent.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[46%] bg-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-brand-700/30 rounded-full blur-[120px]" />
          <div className="absolute top-28 right-0 w-[400px] h-[380px] border-[60px] border-white/5 rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 h-full">

          <h1 className="text-4xl font-display font-bold leading-[1.2] mb-6">
            Your Premium<br /><span className="text-accent-cyan">Software Hub</span>
          </h1>
          <p className="text-neutral-400 leading-relaxed max-w-sm mb-8">
            Access thousands of software licenses, templates, and digital tools — all in one place.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Secure Payments</h3>
                <p className="text-neutral-500 text-sm">Bank-level encryption on every transaction</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Instant Delivery</h3>
                <p className="text-neutral-500 text-sm">Digital licenses delivered immediately after purchase</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">24/7 Support</h3>
                <p className="text-neutral-500 text-sm">Our team is always here to help you</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-16 text-neutral-500 text-sm">
            © 2024 Visionary IT Services. All rights reserved.
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

          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">Welcome back</h2>
          <p className="text-neutral-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
              {error}
            </div>
          )}
          {notice && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium mb-6 border border-green-100">
              {notice}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500" />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-sm text-brand-500 font-medium hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 active:scale-95 disabled:opacity-70"
            >
              <LogIn className="w-4 h-4" /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-neutral-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
