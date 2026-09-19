import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, ArrowRight, Zap, Headphones, Users, ChevronDown } from 'lucide-react'

import Reveal from '../components/Reveal'
import { fadeUp, stagger } from '../lib/motion'
import { api, errorMessage } from '../lib/api'

const SUBJECTS = ['General Support', 'Enterprise License', 'Technical Support', 'Partnership', 'Custom Development']
const EMPTY = { name: '', email: '', subject: 'General Support', message: '', website: '' }

export default function Contact() {
  // Other pages can pre-fill the form, e.g. "Ask a question" on a product page
  const { state } = useLocation()
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(SUBJECTS.includes(state?.subject) && { subject: state.subject }),
    ...(state?.message && { message: state.message }),
  }))
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSending(true)
    try {
      await api.post('/contact', form)
      setSubmitted(true)
      setForm(EMPTY)
      setTimeout(() => setSubmitted(false), 8000)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-[#061936] text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0a2347]/50 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                Support &amp; Sales
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                Let's Build Something<br /><span className="text-blue-400">Remarkable.</span>
              </h1>
              <p className="text-lg text-neutral-400 max-w-xl leading-relaxed">
                Talk to our specialists for enterprise quotes, technical support, or custom software consultations.
              </p>
            </div>
          </Reveal>

          {/* Contact Info Cards */}
          <motion.div
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              { icon: Mail, label: 'Email Us', value: 'info@visionaryitservice.com', color: 'bg-blue-500' },
              { icon: Phone, label: 'Call Us', value: '+92 312 1823855', color: 'bg-emerald-500' },
              { icon: MapPin, label: 'Visit Us', value: 'D-12 Markaz, Islamabad', color: 'bg-orange-500' },
              { icon: Clock, label: 'Working Hours', value: '9:00 AM – 6:00 PM', color: 'bg-rose-500' },
            ].map((item) => (
              <motion.div variants={fadeUp} key={item.label} className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-all">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-0.5">{item.label}</p>
                  <p className="text-white font-medium text-sm">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Image & Info */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2560"
                alt="Reach Out"
                className="w-full h-[300px] object-cover rounded-[2rem] shadow-xl mb-10"
              />

              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-8">Why Reach Out?</h3>

              <div className="space-y-6 mb-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Instant Reply</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      You will be answered with in 2 hours on business days.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Dedicated Support</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Personalized guidance from our team of experts for every project milestone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 mb-1">Enterprise Assistance</h4>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      Contact us if you need help on bulk or enterprise tier plans.
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/923121823855"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-emerald-500 rounded-2xl text-white hover:bg-emerald-600 transition-all group shadow-lg shadow-emerald-500/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  {/* WhatsApp SVG */}
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Chat on WhatsApp</p>
                  <p className="text-xs text-emerald-100">For quick assistance</p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Right Side - Form */}
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/50 overflow-hidden">
              {/* Form Header */}
              <div className="bg-blue-600 p-8">
                <h2 className="text-2xl font-display font-bold text-white">Send Us a Message</h2>
                <p className="text-blue-100 text-sm mt-1">Fill in the form below and we'll get back to you shortly.</p>
              </div>

              <div className="p-8">
                {error && (
                  <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium whitespace-pre-line">
                    {error}
                  </div>
                )}
                {submitted && (
                  <div role="status" className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
                    ✓ Message sent successfully! We'll get back to you within 24 hours.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot: hidden from people, filled in by spam bots */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="hidden"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Subject</label>
                    <div className="relative">
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none bg-white pr-10 cursor-pointer text-neutral-700"
                      >
                        {SUBJECTS.map((subject) => <option key={subject}>{subject}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 mb-2 block">Your Message</label>
                    <textarea
                      required
                      minLength={10}
                      maxLength={5000}
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your project or inquiry in detail..."
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none placeholder-neutral-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="disabled:opacity-60 w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" /> {sending ? 'Sending…' : 'Send Message'}
                  </button>

                  <p className="text-center text-neutral-400 text-xs mt-2">
                    We never share your data. See our{' '}
                    <a href="/privacy" className="text-blue-500 hover:underline">privacy policy</a>.
                  </p>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Location Banner */}
      <section className="relative py-20 bg-[#061936]">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2944"
            alt="City"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Visionary IT Services</h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Office 121, Sheraz Gate, D-12 Markaz · Islamabad, Pakistan
          </p>
        </div>
      </section>
    </div>
  )
}
