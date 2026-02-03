'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/lib/language'
import { useTranslation } from '@/lib/translations'

interface Address {
  id: string
  firstName: string
  lastName: string
  street: string
  city: string
  state?: string | null
  zipCode: string
  country: string
  phone?: string | null
  isDefault: boolean
}

export default function AddressesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { language } = useLanguage()
  const t = useTranslation(language)
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    isDefault: false,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/addresses')
      return
    }

    if (status === 'authenticated') {
      fetchAddresses()
    }
  }, [status, router])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingAddress
        ? `/api/addresses/${editingAddress.id}`
        : '/api/addresses'
      const method = editingAddress ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchAddresses()
        setShowForm(false)
        setEditingAddress(null)
        setFormData({
          firstName: '',
          lastName: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phone: '',
          isDefault: false,
        })
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      city: address.city,
      state: address.state || '',
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAddresses()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('An error occurred. Please try again.')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <h1 className="font-serif text-4xl mb-8">{t('addresses.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-1">{session?.user?.name || 'User'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
            </div>
            <nav className="space-y-2">
              <Link
                href="/account"
                className="block py-2 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                {t('nav.orders')}
              </Link>
              <Link
                href="/account/addresses"
                className="block py-2 border-b border-gray-200 dark:border-gray-700 font-medium text-black dark:text-white"
              >
                {t('nav.addresses')}
              </Link>
              <Link
                href="/account/settings"
                className="block py-2 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                {t('nav.settings')}
              </Link>
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {!showForm ? (
            <>
              <div className="mb-6">
                <button
                  onClick={() => {
                    setShowForm(true)
                    setEditingAddress(null)
                    setFormData({
                      firstName: '',
                      lastName: '',
                      street: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: '',
                      phone: '',
                      isDefault: false,
                    })
                  }}
                  className="btn-primary"
                >
                  {t('addresses.addNew')}
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">{t('addresses.noAddresses')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          {address.isDefault && (
                            <span className="inline-block px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded mb-2">
                              {t('addresses.default')}
                            </span>
                          )}
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                            {address.firstName} {address.lastName}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {address.street}
                            <br />
                            {address.city}, {address.state} {address.zipCode}
                            <br />
                            {address.country}
                            {address.phone && (
                              <>
                                <br />
                                {t('addresses.phone')}: {address.phone}
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(address)}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                          >
                            {t('common.edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                          >
                            {t('common.delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="font-serif text-2xl mb-6">
                {editingAddress ? t('addresses.edit') : t('addresses.addNew')}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                      {t('addresses.firstName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="input-field font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                      {t('addresses.lastName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="input-field font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                    {t('addresses.street')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="input-field font-light"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                      {t('addresses.city')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input-field font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                      {t('addresses.state')}
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="input-field font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                      {t('addresses.zipCode')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="input-field font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                      {t('addresses.country')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="input-field font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
                      {t('addresses.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-light">
                      {t('addresses.isDefault')}
                    </span>
                  </label>
                </div>

                <div className="flex space-x-4">
                  <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? t('common.saving') : t('addresses.save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingAddress(null)
                    }}
                    className="btn-secondary"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
