import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'

async function getProducts() {
  const products = await db.product.findMany({}, { orderBy: { createdAt: 'desc' } })
  return Promise.all(
    products.map(async (product) => {
      const [images, category] = await Promise.all([
        db.productImage.findMany({ productId: product.id }, { orderBy: { position: 'asc' }, take: 1 }),
        db.category.findUnique({ id: product.categoryId }),
      ])
      return {
        ...product,
        images: images || [],
        category: category || { id: '', name: '', slug: '', createdAt: new Date(), updatedAt: new Date() },
      }
    })
  )
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-12">
        <h2 className="font-serif text-5xl text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Products
        </h2>
        <Link href="/admin/products/new" className="btn-primary">
          Add New Product
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-warm-gray dark:bg-gray-900">
            <tr>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Image
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Name
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Category
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Price
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Featured
              </th>
              <th className="px-6 py-5 text-left text-xs font-light uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => {
              const mainImage = product.images[0]
              const price = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: product.currency || 'USD',
              }).format(Number(product.price))

              return (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    {mainImage ? (
                      <div className="relative w-16 h-16 bg-warm-gray">
                        <Image
                          src={mainImage.url}
                          alt={mainImage.alt || product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-warm-gray flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-light text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-light">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-5 text-gray-900 dark:text-gray-100 font-light">{price}</td>
                  <td className="px-6 py-5">
                    {product.featured ? (
                      <span className="text-green-600 dark:text-green-400 font-light">Yes</span>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-600 font-light">No</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light"
                    >
                      Edit
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
