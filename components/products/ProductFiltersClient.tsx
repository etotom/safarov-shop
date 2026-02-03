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
