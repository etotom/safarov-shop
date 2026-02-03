'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All transactions are processed securely through Stripe.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 5-7 business days. Express shipping (2-3 days) and overnight shipping are also available. Processing time is typically 1-2 business days.',
  },
  {
    question: 'Can I track my order?',
    answer:
      'Yes! Once your order ships, you will receive a tracking number via email. You can use this to track your package on the carrier\'s website.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'You can return items within 30 days of delivery. Items must be in original condition with tags attached. Please see our Returns page for complete details.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please contact us for specific information about your country.',
  },
  {
    question: 'How do I care for my items?',
    answer:
      'Care instructions are included with each product. Most items require dry cleaning or gentle hand washing. Please refer to the care label on your specific item.',
  },
  {
    question: 'Can I modify or cancel my order?',
    answer:
      'Orders can be modified or cancelled within 24 hours of placement, provided they haven\'t been shipped. Please contact customer service immediately if you need to make changes.',
  },
  {
    question: 'Do you offer gift wrapping?',
    answer:
      'Yes! We offer complimentary gift wrapping for all orders. You can add this option during checkout. Gift messages can also be included.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-12 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100 font-light pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-warm-gray dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="font-serif text-2xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            Still have questions?
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 font-light">
            If you can't find the answer you're looking for, please don't hesitate to contact us.
          </p>
          <a href="/contact" className="btn-primary inline-block">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
