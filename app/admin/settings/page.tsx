'use client'

import { useState } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Safarov shop',
    siteDescription: 'Luxury Fashion Store',
    currency: 'USD',
    taxRate: '8.5',
    shippingCost: '10.00',
    freeShippingThreshold: '500.00',
  })
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save settings to your backend
    console.log('Settings saved:', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="mb-12">
        <h2 className="font-serif text-5xl text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
          Settings
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 space-y-6">
        {saved && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded font-light">
            Settings saved successfully!
          </div>
        )}

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Site Name
          </label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="input-field font-light"
          />
        </div>

        <div>
          <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
            Site Description
          </label>
          <textarea
            rows={3}
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            className="input-field font-light"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="input-field font-light"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
              className="input-field font-light"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
              Standard Shipping Cost
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.shippingCost}
              onChange={(e) => setSettings({ ...settings, shippingCost: e.target.value })}
              className="input-field font-light"
            />
          </div>

          <div>
            <label className="block text-xs font-light mb-3 uppercase tracking-[0.2em] text-gray-900 dark:text-gray-100">
              Free Shipping Threshold
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
              className="input-field font-light"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Save Settings
        </button>
      </form>
    </div>
  )
}
