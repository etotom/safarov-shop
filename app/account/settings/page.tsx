'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/account/settings')
      return
    }

    if (status === 'authenticated') {
      setLoading(false)
    }
  }, [status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container-custom py-12">
      <h1 className="font-serif text-4xl mb-8">Settings</h1>

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
                Orders
              </Link>
              <Link
                href="/account/addresses"
                className="block py-2 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                Addresses
              </Link>
              <Link
                href="/account/settings"
                className="block py-2 border-b border-gray-200 dark:border-gray-700 font-medium text-black dark:text-white"
              >
                Settings
              </Link>
            </nav>
          </div>
        </aside>

        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
            <h2 className="font-serif text-2xl mb-6">Preferences</h2>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-medium mb-1 text-gray-900 dark:text-gray-100">Theme</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="flex items-center space-x-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Dark</span>
                    </>
                  )}
                </button>
              </div>

              {/* Current Theme Display */}
              <div className="py-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current theme: <span className="font-medium capitalize">{theme}</span>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
