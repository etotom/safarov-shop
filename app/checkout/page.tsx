'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    currency: string
  }
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/checkout')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          shippingAddress: formData,
        }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setProcessing(false)
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
        Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="font-serif text-3xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  State / Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  ZIP / Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div>
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input-field font-light"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field font-light"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-warm-gray dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="font-serif text-3xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
              Order Summary
            </h2>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm font-light py-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: item.product.currency || 'USD',
                    }).format(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-300 dark:border-gray-700 pt-6 mt-6 flex justify-between text-xl font-light">
                <span className="text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(subtotal)}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={processing}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : 'Complete Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
