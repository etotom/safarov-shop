'use client'

import { useLanguage } from './lib/language'
import { useTranslation } from './lib/translations'

export default function ShippingPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          {t('page.shipping')}
        </h1>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            {t('shipping.options')}
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 font-light">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">{t('shipping.standard')}</h3>
              <p>{t('shipping.standardDesc')}</p>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">{t('shipping.express')}</h3>
              <p>{t('shipping.expressDesc')}</p>
            </div>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">{t('shipping.overnight')}</h3>
              <p>{t('shipping.overnightDesc')}</p>
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
