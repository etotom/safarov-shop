'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage, useTranslation } from '@/lib'

export default function PromoSection() {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <div className="container-custom">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative h-[500px] overflow-hidden group">
          <Image
            src="/images/woman_coat_white1.png"
            alt="Women's Collection"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 dark:bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 dark:group-hover:bg-opacity-50 transition-all duration-300">
            <Link href="/category/women" className="btn-primary">
              {t('nav.women')}
            </Link>
          </div>
        </div>
        <div className="relative h-[500px] overflow-hidden group">
          <Image
            src="/images/suit1.png"
            alt="Men's Collection"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 dark:bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 dark:group-hover:bg-opacity-50 transition-all duration-300">
            <Link href="/category/men" className="btn-primary">
              {t('nav.men')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
