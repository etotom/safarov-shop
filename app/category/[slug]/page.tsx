import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ProductCard from '@/components/products/ProductCard'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

async function getCategory(slug: string) {
  const category = await db.category.findUnique({ slug })
  if (!category) return null

  const [children, parent] = await Promise.all([
    db.category.findMany({ parentId: category.id }),
    category.parentId ? db.category.findUnique({ id: category.parentId }) : null,
  ])

  return {
    ...category,
    children: children || [],
    parent: parent || null,
  }
}

async function getCategoryProducts(categoryId: string) {
  const products = await db.product.findMany({ categoryId }, { orderBy: { createdAt: 'desc' } })

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const products = await getCategoryProducts(category.id)

  return (
    <div className="container-custom py-16">
      <div className="mb-12">
        <h1 className="font-serif text-5xl mb-4 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-600 dark:text-gray-400 text-lg font-light">{category.description}</p>
        )}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
