import { db } from '@/lib/db'
import Link from 'next/link'

async function getUsers() {
  const users = await db.users.findMany({})
  const sortedUsers = users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
  return Promise.all(
    sortedUsers.map(async (user) => {
      const [orders, addresses] = await Promise.all([
        db.order.findMany({ userId: user.id }),
        db.address.findMany({ userId: user.id }),
      ])
      
      const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
      
      return {
        ...user,
        ordersCount: orders.length,
        totalSpent,
        addressesCount: addresses.length,
        lastOrderDate: orders.length > 0 
          ? orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
          : null,
      }
    })
  )
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <div>
      <div className="mb-12">
        <h2 className="font-serif text-5xl text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Users Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 font-light">
          Manage user accounts, view statistics, and access important user data
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-warm-gray dark:bg-gray-900">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Name
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Email
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Role
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Orders
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Total Spent
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Last Order
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-5 font-light text-gray-900 dark:text-gray-100">
                  {user.name || 'N/A'}
                </td>
                <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light">
                  {user.email}
                </td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1 text-xs font-light rounded ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-gray-900 dark:text-gray-100 font-light">
                  {user.ordersCount}
                </td>
                <td className="px-6 py-5 text-gray-900 dark:text-gray-100 font-light">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(user.totalSpent)}
                </td>
                <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light text-sm">
                  {user.lastOrderDate
                    ? new Date(user.lastOrderDate).toLocaleDateString()
                    : 'No orders'}
                </td>
                <td className="px-6 py-5">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-serif font-light text-gray-900 dark:text-gray-100">
            {users.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-serif font-light text-gray-900 dark:text-gray-100">
            {users.reduce((sum, user) => sum + user.ordersCount, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-serif font-light text-gray-900 dark:text-gray-100">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(users.reduce((sum, user) => sum + user.totalSpent, 0))}
          </p>
        </div>
      </div>
    </div>
  )
}
