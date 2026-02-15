'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useTranslation } from '@/lib/translations'
import ProductCard from '@/components/products/ProductCard'

interface Product {
  id: string
  featured: boolean
  images: any[]
  category: any
}

export default function FeaturedSection({ products }: { products: Product[] }) {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <>
      <div className="text-center mb-16">
        <h2 className="font-serif text-5xl mb-6 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          {t('home.featuredCollection')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
          {t('home.featuredDescription')}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="text-center mt-12">
        <Link href="/products" className="btn-secondary inline-block">
          {t('home.viewAllProducts')}
        </Link>
      </div>
    </>
  )
}
