'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/app/lib/language'
import { useTranslation } from '@/app/lib/translations'

const faqs = [
  {
    question: 'faq.q1',
    answer: 'faq.a1',
  },
  {
    question: 'faq.q2',
    answer: 'faq.a2',
  },
  {
    question: 'faq.q3',
    answer: 'faq.a3',
  },
  {
    question: 'faq.q4',
    answer: 'faq.a4',
  },
  {
    question: 'faq.q5',
    answer: 'faq.a5',
  },
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
  const { language } = useLanguage()
  const t = useTranslation(language)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-12 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          {t('page.faq')}
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
                  {t(faq.question as any)}
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
                    {t(faq.answer as any)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-warm-gray dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="font-serif text-2xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            {t('faq.stillQuestions')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 font-light">
            {t('faq.cantFind')}
          </p>
          <a href="/contact" className="btn-primary inline-block">
            {t('footer.contactUs')}
          </a>
        </div>
      </div>
    </div>
  )
}
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
