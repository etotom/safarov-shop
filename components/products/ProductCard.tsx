'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { Product, ProductImage } from '@/lib/db/types'
import CurrencyConverter from '@/components/currency/CurrencyConverter'

interface ProductCardProps {
  product: Product & {
    images: ProductImage[]
    category: { name: string; slug: string }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.position === 0) || product.images[0]
  const [showConverter, setShowConverter] = useState(false)

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-warm-gray dark:bg-gray-800 mb-6">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-lg group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors font-light">
          {product.name}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-light">
          {product.category.name}
        </p>
        <div className="flex items-center space-x-2">
          <p className="text-lg font-light text-gray-900 dark:text-gray-100">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: product.currency || 'USD',
            }).format(Number(product.price))}
          </p>
          <button
            onClick={(e) => {
              e.preventDefault()
              setShowConverter(!showConverter)
            }}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            title="Convert currency"
          >
            {showConverter ? '−' : '≡'}
          </button>
        </div>
        {showConverter && (
          <div className="mt-2">
            <CurrencyConverter amount={Number(product.price)} baseCurrency={product.currency || 'USD'} />
          </div>
        )}
      </div>
    </Link>
  )
}
