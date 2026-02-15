'use client'

import Link from 'next/link'
import { useLanguage } from '@/app/lib/language.tsx'
import { useTranslation } from '@/app/lib/translations.ts'

export default function HeroContent() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <>
      <p className="text-xl md:text-3xl mb-12 text-white drop-shadow-md font-light tracking-wider">
        {t('home.heroSubtitle')}
      </p>
      <Link href="/products" className="btn-primary inline-block">
        {t('home.shopNow')}
      </Link>
    </>
  )
}
