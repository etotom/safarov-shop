'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Order {
  id: string
  status: string
  total: number
  currency: string
  createdAt: string
  items: Array<{
    product: { name: string }
    quantity: number
    price: number
  }>
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account')
      return
    }

    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-16">
      <h1 className="font-serif text-5xl mb-12 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
        My Account
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="space-y-6">
            <div>
              <p className="font-light mb-2 text-gray-900 dark:text-gray-100">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                {session?.user?.email}
              </p>
            </div>
            <nav className="space-y-1">
              <Link
                href="/account"
                className="block py-3 border-b border-gray-200 dark:border-gray-700 font-light text-gray-900 dark:text-gray-100"
              >
                Orders
              </Link>
              <Link
                href="/account/addresses"
                className="block py-3 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
              >
                Addresses
              </Link>
              <Link
                href="/account/settings"
                className="block py-3 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
              >
                Settings
              </Link>
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <h2 className="font-serif text-3xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            Order History
          </h2>
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 dark:border-gray-700 p-8 bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="font-light text-gray-900 dark:text-gray-100">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-light text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: order.currency || 'USD',
                        }).format(Number(order.total))}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize font-light mt-1">
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm font-light">
                        <span className="text-gray-700 dark:text-gray-300">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: order.currency || 'USD',
                          }).format(Number(item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
              <Link href="/products" className="btn-primary inline-block">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
