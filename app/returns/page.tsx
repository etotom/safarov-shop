'use client'

import { useLanguage } from '@/lib/language.tsx'
import { useTranslation } from '@/lib/translations.ts'

export default function ReturnsPage() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          {t('page.returns')}
        </h1>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            {t('returns.policy')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light mb-4">
            {t('returns.satisfaction')}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-light">
            {t('returns.condition')}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">
            {t('returns.howTo')}
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700 dark:text-gray-300 font-light">
            <li>{t('returns.step1')}</li>
            <li>{t('returns.step2')}</li>
            <li>{t('returns.step3')}</li>
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
