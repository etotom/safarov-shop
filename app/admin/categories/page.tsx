import { db } from '@/lib/db'
import Link from 'next/link'

async function getCategories() {
  const categories = await db.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      parent: true,
      children: true
    }
  })
  return categories
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h2 className="font-serif text-5xl text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Categories
        </h2>
        <Link href="/admin/categories/new" className="btn-primary">
          Add New Category
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-warm-gray dark:bg-gray-900">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Name
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Slug
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Parent
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Products
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-5 font-light text-gray-900 dark:text-gray-100">
                  {category.name}
                </td>
                <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light">
                  {category.slug}
                </td>
                <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light">
                  {category.parentId || '-'}
                </td>
                <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light">
                  {category.children ? category.children.length : 0}
                </td>
                <td className="px-6 py-5">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
