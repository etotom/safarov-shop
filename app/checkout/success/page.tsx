'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // You can verify the session here if needed
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-20">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-20 h-20 text-green-600 dark:text-green-400 mx-auto mb-8" />
        <h1 className="font-serif text-5xl mb-6 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg font-light">
          Your order has been received and is being processed. You will receive a confirmation
          email shortly.
        </p>
        {sessionId && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-10 font-light">
            Order ID: {sessionId}
          </p>
        )}
        <div className="flex gap-6 justify-center">
          <Link href="/account" className="btn-primary">
            View Orders
          </Link>
          <Link href="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
