export default function ReturnsPage() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Returns & Exchanges
        </h1>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            Return Policy
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-4">
            We want you to be completely satisfied with your purchase. If you're not happy with
            your order, you may return it within 30 days of delivery for a full refund or exchange.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            Items must be returned in their original condition, unworn, unwashed, with all tags
            attached and in the original packaging.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            How to Return
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300 font-light">
            <li>Log into your account and go to your order history</li>
            <li>Select the item you wish to return</li>
            <li>Print the return label provided</li>
            <li>Package the item securely with the return label</li>
            <li>Drop off at any authorized carrier location</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            Refund Processing
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            Once we receive and inspect your return, we will process your refund within 5-7
            business days. Refunds will be issued to the original payment method. Shipping costs
            are non-refundable unless the item was defective or incorrect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            Exchanges
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            We currently offer exchanges for different sizes. To exchange an item, please follow
            the return process and place a new order for the desired size. If the new item is a
            different price, we will process the difference accordingly.
          </p>
        </section>
      </div>
    </div>
  )
}
