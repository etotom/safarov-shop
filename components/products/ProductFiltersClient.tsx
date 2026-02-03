'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/db/types'
import ProductFilters, { FilterState } from './ProductFilters'

interface ProductFiltersClientProps {
  categories: Category[]
  initialFilters: FilterState
}

export default function ProductFiltersClient({
  categories,
  initialFilters,
}: ProductFiltersClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filters: FilterState) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (filters.category) {
      params.set('category', filters.category)
    } else {
      params.delete('category')
    }

    if (filters.minPrice) {
      params.set('minPrice', filters.minPrice)
    } else {
      params.delete('minPrice')
    }

    if (filters.maxPrice) {
      params.set('maxPrice', filters.maxPrice)
    } else {
      params.delete('maxPrice')
    }

    if (filters.sortBy && filters.sortBy !== 'newest') {
      params.set('sortBy', filters.sortBy)
    } else {
      params.delete('sortBy')
    }

    params.delete('page') // Reset to first page when filters change

    router.push(`/products?${params.toString()}`)
  }

  return <ProductFilters categories={categories} onFilterChange={handleFilterChange} />
}
