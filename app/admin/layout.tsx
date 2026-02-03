import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-warm-white dark:bg-gray-900 transition-colors">
      <div className="container-custom py-10">
        <div className="mb-12">
          <h1 className="font-serif text-5xl mb-6 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            Admin Panel
          </h1>
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            <Link
              href="/admin"
              className="pb-4 px-2 border-b-2 border-black dark:border-white font-light text-gray-900 dark:text-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="pb-4 px-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
            >
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="pb-4 px-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
            >
              Categories
            </Link>
            <Link
              href="/admin/orders"
              className="pb-4 px-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
            >
              Orders
            </Link>
            <Link
              href="/admin/users"
              className="pb-4 px-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
            >
              Users
            </Link>
            <Link
              href="/admin/settings"
              className="pb-4 px-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
            >
              Settings
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </div>
  )
}
