import { db } from '@/lib/db'
import Link from 'next/link'

async function getOrders() {
  const orders = await db.order.findMany({}, { orderBy: { createdAt: 'desc' }, take: 50 })
  return Promise.all(
    orders.map(async (order) => {
      const [user, items] = await Promise.all([
        db.users.findUnique({ id: order.userId }),
        db.orderItem.findMany({ orderId: order.id }),
      ])
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await db.product.findUnique({ id: item.productId })
          return {
            ...item,
            product: product ? { name: product.name } : { name: 'Unknown' },
          }
        })
      )
      return {
        ...order,
        user: user ? { name: user.name, email: user.email } : { name: null, email: '' },
        items: itemsWithProducts,
      }
    })
  )
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div>
      <h2 className="font-serif text-5xl mb-12 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
        Orders
      </h2>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-warm-gray dark:bg-gray-900">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Order ID
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Customer
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Items
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Total
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Status
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Date
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => {
              const total = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: order.currency || 'USD',
              }).format(Number(order.total))

              return (
                <tr key={order.id}>
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-light text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                    >
                      #{order.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-light text-gray-900 dark:text-gray-100">
                        {order.user.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                        {order.user.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light">
                    {order.items.length} items
                  </td>
                  <td className="px-6 py-5 font-light text-gray-900 dark:text-gray-100">{total}</td>
                  <td className="px-6 py-5">
                    <span className="capitalize font-light text-gray-700 dark:text-gray-300">
                      {order.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
