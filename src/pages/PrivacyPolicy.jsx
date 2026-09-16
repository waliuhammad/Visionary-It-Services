import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#021127] mb-4">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last updated: January 2024</p>
        
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">1. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed">
              We collect information you provide directly, such as name, email address, and payment details when you create an account or make a purchase. We also collect usage data including IP addresses, browser type, and pages visited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed">
              Your data is used to process orders, send invoices, provide customer support, and improve our services. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">3. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement industry-standard security measures including SSL encryption and secure payment processing. Your payment card details are never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">4. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We use cookies to maintain your session and preferences. You may disable cookies in your browser settings, but some features may not function correctly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">5. Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              For any privacy-related queries, contact us at <a href="mailto:info@visionaryitservices.com" className="text-blue-600 hover:underline">info@visionaryitservices.com</a> or call <a href="tel:+923421932855" className="text-blue-600 hover:underline">+92 342 1932855</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
