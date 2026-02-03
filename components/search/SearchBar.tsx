'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import type { Product } from '@/lib/db/types'
import Link from 'next/link'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setLoading(true)
      setIsOpen(true)

      try {
        // Simple client-side search - in production, use API
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.products || [])
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchProducts, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-black dark:focus:border-gray-500 transition-colors"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-96 overflow-y-auto z-50">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200 dark:border-gray-700">
                Products ({results.length})
              </div>
              {results.slice(0, 8).map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery('')
                  }}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency || 'USD',
                    }).format(product.price)}
                  </div>
                </Link>
              ))}
              {results.length > 8 && (
                <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href={`/products?search=${encodeURIComponent(query)}`}
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    View all {results.length} results →
                  </Link>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}
