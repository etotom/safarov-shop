'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="font-serif text-3xl mb-6 text-gray-900 dark:text-gray-100 font-light">
              Get in Touch
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 font-light">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100 font-light">
                  Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  <a href="mailto:info@safarovshop.com" className="underline">
                    info@safarovshop.com
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100 font-light">
                  Phone
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100 font-light">
                  Address
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-light">
                  123 Luxury Avenue
                  <br />
                  New York, NY 10001
                  <br />
                  United States
                </p>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitted && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded font-light">
                  Thank you! Your message has been sent.
                </div>
              )}

              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field font-light"
                />
              </div>

              <button type="submit" className="btn-primary w-full">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
