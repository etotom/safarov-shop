'use client'

import { useLanguage } from '@/lib/language.tsx'
import { useTranslation } from '@/lib/translations.ts'

export default function AboutSection() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
        {t('home.craftsmanship')}
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
        {t('home.aboutDescription')}
      </p>
    </div>
  )
}
