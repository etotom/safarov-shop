import { db } from '@/lib/db'
import Link from 'next/link'

async function getStats() {
  const [products, orders, users, categories] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.users.findMany().then((u) => u.length),
    db.category.findMany().then((c) => c.length),
  ])

  const totalRevenue = await db.order.aggregate({
    _sum: { total: true },
    where: {
      status: { not: 'CANCELLED' },
    },
  })

  return {
    products,
    orders,
    users,
    categories,
    revenue: totalRevenue._sum.total || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h2 className="font-serif text-5xl mb-12 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-4">
            Total Products
          </h3>
          <p className="text-4xl font-serif font-light text-gray-900 dark:text-gray-100">
            {stats.products}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-4">
            Total Orders
          </h3>
          <p className="text-4xl font-serif font-light text-gray-900 dark:text-gray-100">
            {stats.orders}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-4">
            Total Users
          </h3>
          <p className="text-4xl font-serif font-light text-gray-900 dark:text-gray-100">
            {stats.users}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-xs font-light uppercase tracking-[0.2em] text-gray-600 dark:text-gray-400 mb-4">
            Total Revenue
          </h3>
          <p className="text-4xl font-serif font-light text-gray-900 dark:text-gray-100">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(Number(stats.revenue))}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="font-serif text-3xl mb-6 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <Link href="/admin/products/new" className="btn-primary block text-center">
              Add New Product
            </Link>
            <Link href="/admin/categories/new" className="btn-secondary block text-center">
              Add New Category
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-serif text-3xl mb-6 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            Recent Orders
          </h3>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
            <p className="text-gray-600 dark:text-gray-400 font-light">
              View all orders in the Orders section.
            </p>
            <Link
              href="/admin/orders"
              className="text-sm underline mt-6 inline-block text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors font-light"
            >
              View All Orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
