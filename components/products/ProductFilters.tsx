'use client'

import { useState, useEffect } from 'react'
import type { Category } from '@/lib/db/types'

export interface FilterState {
  category: string
  minPrice: string
  maxPrice: string
  sortBy: string
}

interface ProductFiltersProps {
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export default function ProductFilters({
  categories,
  onFilterChange,
  initialFilters,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    }
  )

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="input-field text-sm font-light"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="input-field text-sm font-light"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="input-field text-sm font-light"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="input-field text-sm font-light"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      <button
        onClick={() => {
          const resetFilters = { category: '', minPrice: '', maxPrice: '', sortBy: 'newest' }
          setFilters(resetFilters)
          onFilterChange(resetFilters)
        }}
        className="btn-secondary w-full text-sm"
      >
        Reset Filters
      </button>
    </div>
  )
}
