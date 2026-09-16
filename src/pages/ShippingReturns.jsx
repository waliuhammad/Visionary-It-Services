import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function ShippingReturns() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#021127] mb-4">Shipping & Returns</h1>
        <p className="text-slate-500 mb-12">Last updated: January 2024</p>
        
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">Instant Digital Delivery</h2>
            <p className="text-slate-600 leading-relaxed">
              All products on Visionary IT Services are digital. There is no physical shipping. Once your payment is confirmed, your license key and download link are delivered instantly to your registered email address — typically within 1-5 minutes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">Delivery Issues</h2>
            <p className="text-slate-600 leading-relaxed">
              If you do not receive your license key within 30 minutes of payment, please check your spam/junk folder first. If still missing, contact us at <a href="mailto:info@visionaryitservices.com" className="text-blue-600 hover:underline">info@visionaryitservices.com</a> with your order ID.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">Return Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              Because our products are digital (license keys and software), all sales are final once the license key has been delivered. We cannot accept returns on activated licenses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">Replacement & Refund Eligibility</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              You are eligible for a free replacement or full refund if:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed mb-4">
              <li>The license key is invalid or does not activate</li>
              <li>The product delivered does not match the description</li>
              <li>A technical error prevented delivery</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              Refund requests must be submitted within 7 days of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#021127] mb-4">How to Request a Refund</h2>
            <p className="text-slate-600 leading-relaxed">
              Email <a href="mailto:info@visionaryitservices.com" className="text-blue-600 hover:underline">info@visionaryitservices.com</a> with your order number, email address, and reason for the refund. We aim to resolve all requests within 48 business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
