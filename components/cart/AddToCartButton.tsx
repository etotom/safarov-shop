'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: string
  variantId?: string
  quantity?: number
}

export default function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
}: AddToCartButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/products')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          variantId,
          quantity,
        }),
      })

      if (response.ok) {
        router.push('/cart')
      } else {
        alert('Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
