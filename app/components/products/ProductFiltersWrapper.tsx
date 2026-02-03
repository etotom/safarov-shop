'use client'

import { Suspense } from 'react'
// import ProductFiltersClient from './ProductFiltersClient'

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
      {/* <ProductFiltersClient 
        categories={categories} 
        initialFilters={initialFilters} 
        searchQuery={searchQuery} 
      /> */}
    </Suspense>
  )
}
