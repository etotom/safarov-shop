export default function ShippingPage() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Shipping Information
        </h1>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            Shipping Options
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 font-light">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Standard Shipping</h3>
              <p>5-7 business days - $10.00</p>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Express Shipping</h3>
              <p>2-3 business days - $25.00</p>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Overnight Shipping</h3>
              <p>Next business day - $50.00</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            Processing Time
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            Orders are typically processed within 1-2 business days. You will receive a shipping
            confirmation email with tracking information once your order has been shipped.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            International Shipping
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            We currently ship to select international destinations. Shipping costs and delivery
            times vary by location. Please contact us for more information about international
            shipping options.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            Tracking Your Order
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            Once your order has shipped, you will receive a tracking number via email. You can use
            this number to track your package on the carrier's website.
          </p>
        </section>
      </div>
    </div>
  )
}
