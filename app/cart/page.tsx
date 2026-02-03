'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus } from 'lucide-react'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    currency: string
    images: Array<{ url: string; alt: string | null }>
  }
  variant: { name: string; value: string } | null
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/cart')
      return
    }

    if (status === 'authenticated') {
      fetchCart()
    }
  }, [status, router])

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart')
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      return
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error('Error updating cart:', error)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  )

  if (status === 'loading' || loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container-custom py-12">
        <div className="text-center py-20">
          <h1 className="font-serif text-4xl mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Start adding items to your cart</p>
          <Link href="/products" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-16">
      <h1 className="font-serif text-5xl mb-12 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const mainImage = item.product.images[0]
            const price = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: item.product.currency || 'USD',
            }).format(Number(item.product.price))

            return (
              <div key={item.id} className="flex gap-6 border-b border-gray-200 pb-6">
                {mainImage && (
                  <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                    <div className="relative w-32 h-32 bg-warm-gray">
                      <Image
                        src={mainImage.url}
                        alt={mainImage.alt || item.product.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  </Link>
                )}
                <div className="flex-1">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-serif text-lg mb-2 hover:text-gray-600">
                      {item.product.name}
                    </h3>
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-gray-600 mb-2">
                      {item.variant.name}: {item.variant.value}
                    </p>
                  )}
                  <p className="text-lg font-medium mb-4">{price}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-600 hover:text-black transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: item.product.currency || 'USD',
                    }).format(Number(item.product.price) * item.quantity)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-warm-gray dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="font-serif text-3xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400 font-light">Subtotal</span>
                <span className="text-gray-900 dark:text-gray-100 font-light">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(subtotal)}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600 dark:text-gray-400 font-light">Shipping</span>
                <span className="text-gray-600 dark:text-gray-400 font-light">Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-700 pt-6 mt-4 flex justify-between text-xl font-light">
                <span className="text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(subtotal)}
                </span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full block text-center">
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="btn-secondary w-full block text-center mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
