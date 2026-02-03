'use client'

'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  return (
    <div className="container-custom py-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="font-serif text-4xl mb-4 text-gray-900 dark:text-gray-100">Thank You!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your order has been placed successfully. {sessionId && `Order ID: ${sessionId}`}
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/orders"
            className="block w-full bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-md font-light hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            View Your Orders
          </Link>
          <Link
            href="/"
            className="block w-full border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 py-3 px-6 rounded-md font-light hover:border-black dark:hover:border-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? <a href="/contact" className="text-gray-900 dark:text-gray-100 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container-custom py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
