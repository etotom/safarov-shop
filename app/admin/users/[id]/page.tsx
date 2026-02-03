import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteUserButton from './DeleteUserButton'

async function getUserData(userId: string) {
  const user = await db.users.findUnique({ id: userId })
  
  if (!user) return null

  const [ordersRaw, addresses] = await Promise.all([
    db.order.findMany({ userId: user.id }),
    db.address.findMany({ userId: user.id }),
  ])
  
  const orders = ordersRaw.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await db.orderItem.findMany({ orderId: order.id })
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await db.product.findUnique({ id: item.productId })
          return { ...item, product }
        })
      )
      return { ...order, items: itemsWithProducts }
    })
  )

  return {
    user,
    orders: ordersWithItems,
    addresses,
    totalSpent: orders.reduce((sum, order) => sum + Number(order.total), 0),
  }
}

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  const data = await getUserData(params.id)

  if (!data) {
    notFound()
  }

  const { user, orders, addresses, totalSpent } = data

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/users"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light mb-4 inline-block"
        >
          ← Back to Users
        </Link>
        <h2 className="font-serif text-5xl text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          User Details
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* User Information */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="font-serif text-3xl mb-6 text-gray-900 dark:text-gray-100 font-light">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
                  Name
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-light mt-1">{user.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-light mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
                  Role
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-light mt-1">
                  <span
                    className={`px-3 py-1 text-xs font-light rounded ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400">
                  Member Since
                </label>
                <p className="text-gray-900 dark:text-gray-100 font-light mt-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="font-serif text-3xl mb-6 text-gray-900 dark:text-gray-100 font-light">
              Order History ({orders.length})
            </h3>
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-light text-gray-900 dark:text-gray-100">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
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
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-400 font-light">
                          {item.product?.name || 'Unknown Product'} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 font-light">No orders yet</p>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-4">
              Statistics
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-light text-gray-600 dark:text-gray-400 mb-1">
                  Total Orders
                </p>
                <p className="text-2xl font-serif font-light text-gray-900 dark:text-gray-100">
                  {orders.length}
                </p>
              </div>
              <div>
                <p className="text-xs font-light text-gray-600 dark:text-gray-400 mb-1">
                  Total Spent
                </p>
                <p className="text-2xl font-serif font-light text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(totalSpent)}
                </p>
              </div>
              <div>
                <p className="text-xs font-light text-gray-600 dark:text-gray-400 mb-1">
                  Addresses
                </p>
                <p className="text-2xl font-serif font-light text-gray-900 dark:text-gray-100">
                  {addresses.length}
                </p>
              </div>
              <DeleteUserButton userId={user.id} />
            </div>
          </div>

          {/* Addresses */}
          {addresses.length > 0 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-4">
                Addresses
              </h3>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="text-sm text-gray-700 dark:text-gray-300 font-light">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {address.firstName} {address.lastName}
                    </p>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p className="mt-1">Phone: {address.phone}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
