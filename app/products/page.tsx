import { db } from '@/lib/db'
import ProductCard from '@/components/products/ProductCard'
import ProductFiltersClient from '@/components/products/ProductFiltersClient'

interface ProductsPageProps {
  searchParams: {
    category?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
  }
}

export interface FilterState {
  category: string
  minPrice: string
  maxPrice: string
  sortBy: string
}

async function getProducts(filters: FilterState, page: number = 1) {
  const pageSize = 12
  const skip = (page - 1) * pageSize

  const where: any = {}

  if (filters.category) {
    where.categoryId = filters.category
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {}
    if (filters.minPrice) {
      where.price.gte = parseFloat(filters.minPrice)
    }
    if (filters.maxPrice) {
      where.price.lte = parseFloat(filters.maxPrice)
    }
  }

  const orderBy: any = {}
  switch (filters.sortBy) {
    case 'price-low':
      orderBy.price = 'asc'
      break
    case 'price-high':
      orderBy.price = 'desc'
      break
    case 'name':
      orderBy.name = 'asc'
      break
    default:
      orderBy.createdAt = 'desc'
  }

  const [products, allProducts] = await Promise.all([
    db.product.findMany(where, { orderBy, skip, take: pageSize }),
    db.product.findMany(where),
  ])

  const productsWithData = await Promise.all(
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

  const total = allProducts.length
  return { products: productsWithData, total, page, totalPages: Math.ceil(total / pageSize) }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const searchQuery = searchParams.search || ''
  const filters: FilterState = {
    category: searchParams.category || '',
    minPrice: searchParams.minPrice || '',
    maxPrice: searchParams.maxPrice || '',
    sortBy: searchParams.sortBy || 'newest',
  }

  const page = parseInt(searchParams.page || '1')
  
  // If search query exists, filter products
  let { products, total, totalPages } = await getProducts(filters, page)
  
  if (searchQuery) {
    const searchLower = searchQuery.toLowerCase()
    products = products.filter((product) => {
      const searchText = `${product.name} ${product.description || ''} ${product.material || ''}`.toLowerCase()
      return searchText.includes(searchLower)
    })
    total = products.length
    totalPages = Math.ceil(total / 12)
  }
  
  const categories = await db.category.findMany({ parentId: null })

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-gray-900 dark:text-gray-100">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{total} products found</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <ProductFiltersClient categories={categories} initialFilters={filters} />
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-3 mt-16">
                  {page > 1 && (
                    <a
                      href={`/products?page=${page - 1}`}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-gray-900 dark:text-gray-100 font-light"
                    >
                      Previous
                    </a>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/products?page=${p}`}
                      className={`px-4 py-2 border font-light transition-colors ${
                        p === page
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                          : 'border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                  {page < totalPages && (
                    <a
                      href={`/products?page=${page + 1}`}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-gray-900 dark:text-gray-100 font-light"
                    >
                      Next
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
