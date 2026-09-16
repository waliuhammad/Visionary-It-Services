import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield, Globe, Zap, Users,
  Heart, Target,
  Lightbulb, Users2, Play, Award, Code, Landmark, ShieldCheck, TrendingUp, Check, ArrowRight
} from 'lucide-react'
import Reveal from '../components/Reveal'
import CountUp from '../components/CountUp'
import { EASE, fadeUp, fadeLeft, fadeRight, scaleIn, stagger } from '../lib/motion'

const milestones = [
  { year: '2018', title: 'Founded', desc: 'Visionary IT Services incorporated as SMC-Private Limited in Karachi.' },
  { year: '2019', title: 'First 500 Clients', desc: 'Reached our first major milestone with enterprise clients across Pakistan.' },
  { year: '2021', title: 'Global Expansion', desc: 'Extended operations to 50+ countries with a fully digital delivery system.' },
  { year: '2023', title: '10k+ Licenses', desc: 'Surpassed 10,000 software licenses sold with 99% client satisfaction.' },
  { year: '2024', title: 'Platform Launch', desc: 'Launched our modern e-commerce platform for seamless digital product delivery.' },
]

const values = [
  { icon: Globe, title: 'Global Reach', desc: 'Serving clients in 120+ countries with instant digital delivery.', color: 'bg-blue-500' },
  { icon: Landmark, title: 'Corporate Integrity', desc: 'As an SMC-Private Limited entity, we uphold the highest business ethics.', color: 'bg-emerald-500' },
  { icon: Zap, title: 'Technical Superiority', desc: 'Constant innovation in how we deliver and manage digital assets.', color: 'bg-orange-500' },
  { icon: ShieldCheck, title: 'Verified Licenses', desc: '100% authentic, verified software licenses — zero grey-market products.', color: 'bg-purple-500' },
  { icon: Award, title: 'Award-Winning Service', desc: 'Recognized by tech communities for excellence in digital commerce.', color: 'bg-rose-500' },
  { icon: TrendingUp, title: 'Growth Partner', desc: 'We grow with our clients, offering scalable solutions at every stage.', color: 'bg-cyan-500' },
]

const leaders = [
  { name: 'Sarmad Khan', role: 'CEO & FOUNDER', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2000' },
  { name: 'Ayesha Tariq', role: 'HEAD OF OPERATIONS', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070' },
  { name: 'Bilal Raza', role: 'LEAD DEVELOPER', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2070' },
  { name: 'Sara Malik', role: 'SALES DIRECTOR', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2064' },
]

export default function About() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#061936] text-white min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0a2347]/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00b4f8]/10 border border-[#00b4f8]/20 rounded-full text-[#00b4f8] text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                <span className="w-2 h-2 rounded-full bg-[#00b4f8]" />
                EST. 2018 · KARACHI, PAKISTAN
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-6">
                Architecting the<br /><span className="text-[#00b4f8]">Digital</span> Future.
              </h1>
              <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                Visionary IT Services is Pakistan's premier digital marketplace for enterprise software licenses, SaaS tools, and custom IT solutions trusted by 15,000+ clients worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="px-8 py-4 bg-[#2a9cf5] hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                  Browse Products <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white rounded-xl font-bold uppercase text-sm tracking-wider transition-all flex items-center justify-center">
                  GET A QUOTE
                </Link>
              </div>
            </motion.div>

            {/* Right Images Layout */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="hidden lg:grid grid-cols-2 gap-6 relative"
            >
              {/* Left Column */}
              <div className="flex flex-col gap-6 mt-16">
                <img
                  src="https://picsum.photos/seed/softwareoffice/400/500"
                  alt="Nature"
                  className="w-full h-[450px] object-cover rounded-[2rem] shadow-2xl"
                />
                <div className="bg-[#00b4f8] rounded-[2rem] p-8 flex items-center gap-5 text-white shadow-xl">
                  <Code className="w-10 h-10" />
                  <div>
                    <p className="font-bold text-xl leading-tight">10k+ Licenses</p>
                    <p className="text-sm text-blue-900 font-medium mt-1">Delivered digitally</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex items-center gap-5 text-white shadow-xl">
                  <Award className="w-10 h-10 text-[#00b4f8]" />
                  <div>
                    <p className="font-bold text-xl leading-tight">99% Satisfaction</p>
                    <p className="text-sm text-neutral-400 mt-1">Client rating 2024</p>
                  </div>
                </div>
                <img
                  src="https://picsum.photos/seed/devteam2024/400/500"
                  alt="Snowy Mountains"
                  className="w-full h-[450px] object-cover rounded-[2rem] shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-blue-600 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={stagger(0, 0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20 text-center"
          >
            <motion.div variants={scaleIn}>
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2"><CountUp value="15k+" /></p>
              <p className="text-blue-100 text-sm font-medium">Global Clients</p>
            </motion.div>
            <motion.div variants={scaleIn}>
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2"><CountUp value="2.5k+" /></p>
              <p className="text-blue-100 text-sm font-medium">Projects Delivered</p>
            </motion.div>
            <motion.div variants={scaleIn}>
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2"><CountUp value="120+" /></p>
              <p className="text-blue-100 text-sm font-medium">Expert Consultants</p>
            </motion.div>
            <motion.div variants={scaleIn}>
              <p className="text-4xl md:text-5xl font-display font-bold text-white mb-2"><CountUp value="98%" /></p>
              <p className="text-blue-100 text-sm font-medium">Client Satisfaction</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Legacy & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Image Side */}
            <Reveal variants={fadeLeft} className="relative w-full max-w-md mx-auto lg:max-w-none">
              <img
                src="https://picsum.photos/seed/softwaresales/800/1000"
                alt="Coffee"
                className="w-full h-[600px] object-cover rounded-[2.5rem] shadow-2xl"
              />
              <img
                src="https://picsum.photos/seed/itteam/400/400"
                alt="Bamboo"
                className="absolute top-12 -right-8 lg:-right-12 w-48 h-48 object-cover rounded-3xl border-8 border-white shadow-xl hidden sm:block"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#0066FF] text-white p-6 rounded-2xl shadow-xl">
                <p className="text-3xl font-display font-bold mb-1">6+ Years</p>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.1em]">Of Excellence</p>
              </div>
            </Reveal>

            {/* Right Content Side */}
            <Reveal variants={fadeRight} className="lg:pl-8 mt-12 lg:mt-0">
              <div className="text-[#0066FF] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                Our Story
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-8 leading-[1.2]">
                Legacy &amp; Mission
              </h2>
              <div className="text-neutral-500 leading-relaxed mb-12 text-base space-y-6">
                <p>
                  Founded in 2018 with a vision to democratize access to world-class software, Visionary IT has grown from a small Karachi startup to a global digital commodities leader.
                </p>
                <p>
                  We believe every developer and entrepreneur deserves tools that are not just functional, but inspiring. Our mission is to bridge the gap between complex software architecture and real-world implementation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F2FF] flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">Precision Driven</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed pr-4">Every license verified for 100% authenticity.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F2FF] flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">Client Centric</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed pr-4">Rapid response and expert resolution, always.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F2FF] flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">Secure &amp; Trusted</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed pr-4">Bank-level security for all transactions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8F2FF] flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-[#0066FF]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">Instant Delivery</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed pr-4">Digital products delivered within minutes.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-[#0066FF] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                Our Journey
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-neutral-900">Milestones That Define Us</h2>
            </div>
          </Reveal>
          <motion.div
            variants={stagger(0, 0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {milestones.map((m, i) => (
              <div key={m.year} className="p-8 bg-white rounded-[2rem] shadow-sm border border-neutral-100 hover:shadow-xl transition-all duration-300 product-card-hover">
                <div className="flex items-center justify-between mb-8 relative">
                  {/* Connecting Line */}
                  <div className="absolute left-10 right-4 top-1/2 -translate-y-1/2 h-[1px] bg-neutral-200 z-0"></div>

                  {/* Year Badge */}
                  <div className="relative z-10 px-5 py-2 bg-[#0066FF] text-white rounded-full text-sm font-bold">
                    {m.year}
                  </div>

                  {/* Step Number */}
                  <div className="relative z-10 w-8 h-8 rounded-full bg-[#E8F2FF] text-[#0066FF] flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{m.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm pr-4">{m.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#0a1229] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-[#00A3FF] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
              What Drives Us
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold">
              Values That Define<br />Our Excellence
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-8 rounded-[2rem] bg-[#121b33] border border-white/5 hover:border-blue-500/50 hover:bg-[#162140] transition-all duration-300 group">
                <div className={`w-14 h-14 rounded-2xl ${v.color} flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                  <v.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-3">{v.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-20">
              <div className="text-[#0066FF] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                The People
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-neutral-900 mb-4">Meet Our Leadership</h2>
              <p className="text-neutral-500 max-w-xl mx-auto text-lg">
                A passionate team of technologists, entrepreneurs, and digital commerce experts.
              </p>
            </div>
          </Reveal>
          <motion.div
            variants={stagger(0.1, 0.15)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {leaders.map((leader) => (
              <motion.div key={leader.name} variants={fadeUp} className="text-center group">
                <div className="relative w-36 h-36 mx-auto mb-6">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover rounded-[1.5rem] shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#0066FF] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{leader.name}</h3>
                <p className="text-[#0066FF] text-xs font-bold mt-1 tracking-widest">{leader.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white pb-32">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal variants={scaleIn}>
            <div className="bg-[#0066FF] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-[1.2]">
                  Ready to Build Something<br />Extraordinary?
                </h2>
                <p className="text-blue-50 max-w-xl mx-auto mb-10 text-lg">
                  Join the Visionary IT network and experience the next generation of software commerce.
                </p>
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  <Link
                    to="/shop"
                    className="bg-white text-[#0066FF] px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-50 transition-all shadow-lg"
                  >
                    Browse Marketplace
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/contact"
                    className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
