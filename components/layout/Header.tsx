'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { ShoppingBag, User, Menu, X, Moon, Sun } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import { useTheme } from '@/lib/theme'

export default function Header() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = [
    {
      name: 'Women',
      href: '/category/women',
      subcategories: [
        { name: 'Outerwear', slug: 'women-outerwear' },
        { name: 'Coats & Jackets', slug: 'women-coats-jackets' },
        { name: 'Blazers', slug: 'women-blazers' },
        { name: 'Bags', slug: 'women-bags' },
        { name: 'Handbags', slug: 'women-handbags' },
        { name: 'Accessories', slug: 'women-accessories' },
        { name: 'Scarves', slug: 'women-scarves' },
        { name: 'Gloves', slug: 'women-gloves' },
        { name: 'Shoes', slug: 'women-shoes' },
      ],
    },
    {
      name: 'Men',
      href: '/category/men',
      subcategories: [
        { name: 'Outerwear', slug: 'men-outerwear' },
        { name: 'Coats & Jackets', slug: 'men-coats-jackets' },
        { name: 'Blazers', slug: 'men-blazers' },
        { name: 'Suits', slug: 'men-suits' },
        { name: 'Accessories', slug: 'men-accessories' },
        { name: 'Scarves', slug: 'men-scarves' },
        { name: 'Gloves', slug: 'men-gloves' },
        { name: 'Shoes', slug: 'men-shoes' },
      ],
    },
    {
      name: 'Kids',
      href: '/category/kids',
      subcategories: [
        { name: 'Outerwear', slug: 'kids-outerwear' },
        { name: 'Coats', slug: 'kids-coats' },
        { name: 'Accessories', slug: 'kids-accessories' },
        { name: 'Scarves', slug: 'kids-scarves' },
        { name: 'Gloves', slug: 'kids-gloves' },
      ],
    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif tracking-wider text-gray-900 dark:text-gray-100" style={{ paddingLeft: '0px' }}>
            Safarov shop
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  href={category.href}
                  className="text-sm uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-light"
                >
                  {category.name}
                </Link>
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="py-6">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${sub.slug}`}
                        className="block px-6 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="hidden md:block w-64">
              <SearchBar />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {session ? (
              <>
                <Link
                  href="/account"
                  className="p-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Account"
                >
                  <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-sm uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 font-light"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 font-light"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 font-light"
              >
                Sign In
              </Link>
            )}

            <Link
              href="/cart"
              className="p-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 mt-4 pt-4">
          <SearchBar />
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <div key={category.name}>
                  <Link
                    href={category.href}
                    className="block text-sm uppercase tracking-[0.15em] py-2 text-gray-900 dark:text-gray-100 font-light"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  <div className="pl-4 space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/category/${sub.slug}`}
                        className="block text-sm text-gray-600 dark:text-gray-400 py-1"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
