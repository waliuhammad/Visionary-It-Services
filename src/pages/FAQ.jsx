import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const faqs = [
  {
    question: "How do I receive my software license after purchase?",
    answer: "After successful payment, your license key and download instructions are emailed to your registered email address within minutes."
  },
  {
    question: "Are the software licenses genuine?",
    answer: "Yes — 100%. We only sell authentic, verified licenses sourced directly from authorized distributors. Every license is guaranteed to activate successfully."
  },
  {
    question: "Can I get a refund?",
    answer: "Digital products are non-refundable once a license key has been delivered. If the key is invalid or fails to activate, we will replace it or issue a full refund."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us via email at info@visionaryitservices.com, call/WhatsApp at +92 342 1932855, or fill out the Contact form on our website."
  },
  {
    question: "Do you offer bulk/enterprise pricing?",
    answer: "Yes. For bulk orders of 5+ licenses or enterprise packages, please contact our sales team for a custom quote."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept bank transfer, EasyPaisa, JazzCash, and major debit/credit cards."
  },
  {
    question: "Is my personal information safe?",
    answer: "Absolutely. We use SSL encryption for all transactions and never store your payment card details. See our Privacy Policy for full details."
  }
]

export default function FAQ() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-8 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-[#021127] mb-4">Frequently Asked Questions</h1>
        <p className="text-slate-500 mb-12">Everything you need to know about our products and services.</p>
        
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-100 rounded-2xl p-6 md:p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-bold text-lg text-[#021127] mb-3">{faq.question}</h3>
              <p className="text-slate-500 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#eef8ff] rounded-3xl p-10 text-center">
          <h3 className="text-xl text-[#021127] mb-6">Still have questions?</h3>
          <Link to="/contact" className="inline-block bg-[#0066ff] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
