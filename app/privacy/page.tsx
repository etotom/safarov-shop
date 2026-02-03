export default function PrivacyPage() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Privacy Policy
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-light">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              At Safarov shop, we are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit
              our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 font-light">
              <li>Name and contact information</li>
              <li>Payment and billing information</li>
              <li>Shipping address</li>
              <li>Account credentials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              We use the information we collect to process your orders, communicate with you,
              improve our services, and comply with legal obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              We implement appropriate security measures to protect your personal information against
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@safarovshop.com" className="underline">
                privacy@safarovshop.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
