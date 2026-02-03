#!/bin/bash

echo "Fixing the duplicate component issue..."

# 1. Remove the duplicate function from page.tsx
sed -i '/^\/\/ Create a separate client component that uses useSearchParams/,/^}$/d' app/products/page.tsx

# 2. Update page.tsx to use the imported wrapper correctly
cat > app/products/page.tsx << 'PAGEEOF'
import { Suspense } from 'react'
import { db } from '@/lib/db'
import ProductCard from '@/components/products/ProductCard'
import ProductFiltersWrapper from '@/components/products/ProductFiltersWrapper'

interface ProductsPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
    search?: string
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
    db.product.findMany({ where: where,  orderBy, skip, take: pageSize }),
    db.product.findMany(where),
  ])

  const productsWithData = await Promise.all(
    products.map(async (product) => {
      const [images, category] = await Promise.all([
        db.productImage.findMany({ where: { productId: product.id },  orderBy: { position: 'asc' }, take: 1 }),
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
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : ''
  const filters: FilterState = {
    category: typeof searchParams.category === 'string' ? searchParams.category : '',
    minPrice: typeof searchParams.minPrice === 'string' ? searchParams.minPrice : '',
    maxPrice: typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : '',
    sortBy: typeof searchParams.sortBy === 'string' ? searchParams.sortBy : 'newest',
  }

  const page = parseInt(typeof searchParams.page === 'string' ? searchParams.page : '1')
  
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
            <ProductFiltersWrapper 
              categories={categories} 
              initialFilters={filters} 
              searchQuery={searchQuery} 
            />
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
                      href={`/products?${new URLSearchParams({
                        ...(searchQuery && { search: searchQuery }),
                        ...(filters.category && { category: filters.category }),
                        ...(filters.minPrice && { minPrice: filters.minPrice }),
                        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                        ...(filters.sortBy && filters.sortBy !== 'newest' && { sortBy: filters.sortBy }),
                        page: (page - 1).toString()
                      }).toString()}`}
                      className="px-6 py-2 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-gray-900 dark:text-gray-100 font-light"
                    >
                      Previous
                    </a>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`/products?${new URLSearchParams({
                        ...(searchQuery && { search: searchQuery }),
                        ...(filters.category && { category: filters.category }),
                        ...(filters.minPrice && { minPrice: filters.minPrice }),
                        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                        ...(filters.sortBy && filters.sortBy !== 'newest' && { sortBy: filters.sortBy }),
                        page: p.toString()
                      }).toString()}`}
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
                      href={`/products?${new URLSearchParams({
                        ...(searchQuery && { search: searchQuery }),
                        ...(filters.category && { category: filters.category }),
                        ...(filters.minPrice && { minPrice: filters.minPrice }),
                        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
                        ...(filters.sortBy && filters.sortBy !== 'newest' && { sortBy: filters.sortBy }),
                        page: (page + 1).toString()
                      }).toString()}`}
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
PAGEEOF

# 3. Create the ProductFiltersWrapper component if it doesn't exist
mkdir -p app/components/products

cat > app/components/products/ProductFiltersWrapper.tsx << 'WRAPPEREOF'
'use client'

import { Suspense } from 'react'
import ProductFiltersClient from './ProductFiltersClient'

interface ProductFiltersWrapperProps {
  categories: any[]
  initialFilters: {
    category: string
    minPrice: string
    maxPrice: string
    sortBy: string
  }
  searchQuery: string
}

export default function ProductFiltersWrapper({ 
  categories, 
  initialFilters,
  searchQuery 
}: ProductFiltersWrapperProps) {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    }>
      <ProductFiltersClient 
        categories={categories} 
        initialFilters={initialFilters} 
        searchQuery={searchQuery} 
      />
    </Suspense>
  )
}
WRAPPEREOF

# 4. Create a proper ProductFiltersClient if it doesn't exist
cat > components/products/ProductFiltersClient.tsx << 'CLIENTEOF'
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ProductFiltersClientProps {
  categories: any[]
  initialFilters: {
    category: string
    minPrice: string
    maxPrice: string
    sortBy: string
  }
  searchQuery?: string
}

export default function ProductFiltersClient({ 
  categories, 
  initialFilters,
  searchQuery = ''
}: ProductFiltersClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [filters, setFilters] = useState(initialFilters)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFilters(initialFilters)
  }, [initialFilters])

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    
    const params = new URLSearchParams()
    
    if (searchQuery) params.set('search', searchQuery)
    if (updated.category) params.set('category', updated.category)
    if (updated.minPrice) params.set('minPrice', updated.minPrice)
    if (updated.maxPrice) params.set('maxPrice', updated.maxPrice)
    if (updated.sortBy && updated.sortBy !== 'newest') params.set('sortBy', updated.sortBy)
    
    setIsLoading(true)
    router.push(`${pathname}?${params.toString()}`)
    
    setTimeout(() => setIsLoading(false), 300)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
          disabled={isLoading}
        >
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilters({ category: '' })}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
              !filters.category 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilters({ category: cat.id })}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                filters.category === cat.id 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              disabled={isLoading}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent"
              disabled={isLoading}
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="text-lg font-medium mb-4">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => updateFilters({ sortBy: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent"
          disabled={isLoading}
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {isLoading && (
        <div className="text-center py-2 text-sm text-gray-500">
          Applying filters...
        </div>
      )}
    </div>
  )
}
CLIENTEOF

echo "✅ ALL FIXED! The duplicate component issue is resolved."
echo "Now run: npm run build"
