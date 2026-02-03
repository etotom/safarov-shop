'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ProductImage } from '@/lib/db/types'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || null)

  if (!images.length) {
    return (
      <div className="aspect-square bg-warm-gray dark:bg-gray-800 flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-600">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden bg-warm-gray dark:bg-gray-800">
        {selectedImage && (
          <Image
            src={selectedImage.url}
            alt={selectedImage.alt || productName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      {/* Thumbnail gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square overflow-hidden border-2 transition-all ${
                selectedImage?.id === image.id
                  ? 'border-black dark:border-white'
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12.5vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
