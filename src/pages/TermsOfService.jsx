import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#021127] mb-4">Terms of Service</h1>
        <p className="text-slate-500 mb-12">Last updated: January 2024</p>
        
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using Visionary IT Services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">2. Digital Products & Licenses</h2>
            <p className="text-slate-600 leading-relaxed">
              All software licenses and digital products sold on our platform are subject to the original manufacturer's end-user license agreement (EULA). Resale or redistribution of purchased licenses is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">3. Payment & Billing</h2>
            <p className="text-slate-600 leading-relaxed">
              All prices are listed in Pakistani Rupees (PKR). Payments are processed securely. Visionary IT Services reserves the right to update pricing at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">4. Prohibited Use</h2>
            <p className="text-slate-600 leading-relaxed">
              You may not use our platform for any unlawful purpose, to distribute malware, engage in fraud, or violate any applicable local or international laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">5. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Islamabad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">6. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              Questions? Email us at <a href="mailto:info@visionaryitservices.com" className="text-blue-600 hover:underline">info@visionaryitservices.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
