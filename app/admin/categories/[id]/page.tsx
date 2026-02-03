'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useTranslation } from '@/lib/translations'

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
}

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const { language } = useLanguage()
  const t = useTranslation(language)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: '',
  })

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        // Filter out the current category and its children to prevent circular references
        const filtered = data.filter((cat: Category) => cat.id !== categoryId)
        setCategories(filtered)
      })
      .catch((err) => console.error('Error fetching categories:', err))
  }, [categoryId])

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`)
        if (response.ok) {
          const category = await response.json()
          setFormData({
            name: category.name || '',
            slug: category.slug || '',
            description: category.description || '',
            parentId: category.parentId || '',
          })
        }
      } catch (error) {
        console.error('Error fetching category:', error)
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null,
        }),
      })

      if (response.ok) {
        router.push('/admin/categories')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 font-light">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-12">
        <Link
          href="/admin/categories"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-light mb-4 inline-block"
        >
          ← {t('common.back')} to {t('categories.title')}
        </Link>
        <h2 className="font-serif text-5xl text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          {t('categories.edit')}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 space-y-6">
        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            {t('categories.name')} *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field font-light"
          />
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            {t('categories.slug')} *
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
            {t('categories.description')}
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field font-light"
          />
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            {t('categories.parent')}
          </label>
          <select
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            className="input-field font-light"
          >
            <option value="">{t('categories.none')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? t('common.saving') : t('categories.save')}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            {t('common.cancel')}
          </button>
        </div>
      </form>
    </div>
  )
}
