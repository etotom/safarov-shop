export default function TermsPage() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Terms of Service
        </h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-light">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Agreement to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              By accessing or using Safarov shop, you agree to be bound by these Terms of Service
              and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Products and Pricing
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              We reserve the right to change prices and product availability at any time. All
              prices are in USD unless otherwise stated.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Orders and Payment
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              When you place an order, you are offering to purchase products at the prices stated.
              We reserve the right to refuse or cancel any order for any reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Returns and Refunds
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              Please refer to our Returns Policy for information about returns and refunds. Items
              must be returned in their original condition within 30 days of purchase.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              Safarov shop shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of our services.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
