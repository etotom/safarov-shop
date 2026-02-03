'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useTranslation } from '@/lib/translations'

interface Category {
  id: string
  name: string
  slug: string
  parentId?: string | null
}

export default function NewCategoryPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = useTranslation(language)
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
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error fetching categories:', err))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
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
        alert(error.error || 'Failed to create category')
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
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
          {t('categories.addNew')}
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
