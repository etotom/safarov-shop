'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    categoryId: '',
    material: '',
    featured: false,
    currency: 'USD',
    images: [''],
    variants: [{ name: 'Color', value: '' }],
    sizes: [''],
  })

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoryId) {
      alert('Please select a category')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/products')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Group categories by parent
  const mainCategories = categories.filter((cat) => !cat.parentId)
  const subCategories = categories.filter((cat) => cat.parentId)
  
  const getCategoryPath = (category: Category): string => {
    if (!category.parentId) return category.name
    const parent = categories.find((c) => c.id === category.parentId)
    return parent ? `${parent.name} > ${category.name}` : category.name
  }

  return (
    <div>
      <div className="mb-12">
        <h2 className="font-serif text-5xl text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Add New Product
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 space-y-6">
        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Product Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: e.target.value,
                slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
              })
            }}
            className="input-field font-light"
          />
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="input-field font-light"
          />
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Description *
          </label>
          <textarea
            required
            rows={6}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field font-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="input-field font-light"
            />
          </div>

          <div>
            <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
              Category *
            </label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="input-field font-light"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {getCategoryPath(category)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
              Currency *
            </label>
            <select
              required
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="input-field font-light"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
              <option value="CHF">CHF</option>
              <option value="CNY">CNY</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Material
          </label>
          <input
            type="text"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            className="input-field font-light"
          />
        </div>

        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-900 dark:text-gray-100 font-light">Featured Product</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Image URLs (one per line)
          </label>
          <textarea
            rows={4}
            value={formData.images.join('\n')}
            onChange={(e) =>
              setFormData({ ...formData, images: e.target.value.split('\n').filter(Boolean) })
            }
            className="input-field font-light"
            placeholder="/images/product1.png&#10;/images/product2.png"
          />
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            value={formData.sizes.join(', ')}
            onChange={(e) =>
              setFormData({
                ...formData,
                sizes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            className="input-field font-light"
            placeholder="XS, S, M, L, XL"
          />
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
