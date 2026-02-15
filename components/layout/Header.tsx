'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { ShoppingBag, User, Menu, X, Moon, Sun } from 'lucide-react'
import SearchBar from '@/components/search/SearchBar'
import { useTheme, useLanguage, useTranslation } from '../../lib'

export default function Header() {
  const { data: session } = useSession()
  const { theme, toggleTheme } = useTheme()
  const { language } = useLanguage()
  const t = useTranslation(language)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const categories = [
    {
      name: t('category.women'),
      href: '/category/women',
      subcategories: [
        { name: t('subcategory.outerwear'), slug: 'women-outerwear' },
        { name: t('subcategory.coatsJackets'), slug: 'women-coats-jackets' },
        { name: t('subcategory.blazers'), slug: 'women-blazers' },
        { name: t('subcategory.bags'), slug: 'women-bags' },
        { name: t('subcategory.handbags'), slug: 'women-handbags' },
        { name: t('subcategory.accessories'), slug: 'women-accessories' },
        { name: t('subcategory.scarves'), slug: 'women-scarves' },
        { name: t('subcategory.gloves'), slug: 'women-gloves' },
        { name: t('subcategory.shoes'), slug: 'women-shoes' },
      ],
    },
    {
      name: t('category.men'),
      href: '/category/men',
      subcategories: [
        { name: t('subcategory.outerwear'), slug: 'men-outerwear' },
        { name: t('subcategory.coatsJackets'), slug: 'men-coats-jackets' },
        { name: t('subcategory.blazers'), slug: 'men-blazers' },
        { name: t('subcategory.suits'), slug: 'men-suits' },
        { name: t('subcategory.accessories'), slug: 'men-accessories' },
        { name: t('subcategory.scarves'), slug: 'men-scarves' },
        { name: t('subcategory.gloves'), slug: 'men-gloves' },
        { name: t('subcategory.shoes'), slug: 'men-shoes' },
      ],
    },
    {
      name: t('category.kids'),
      href: '/category/kids',
      subcategories: [
        { name: t('subcategory.outerwear'), slug: 'kids-outerwear' },
        { name: t('subcategory.coatsJackets'), slug: 'kids-coats' },
        { name: t('subcategory.accessories'), slug: 'kids-accessories' },
        { name: t('subcategory.scarves'), slug: 'kids-scarves' },
        { name: t('subcategory.gloves'), slug: 'kids-gloves' },
      ],
    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-serif tracking-wider text-gray-900 dark:text-gray-100">
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
                    {t('nav.admin')}
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-sm uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 font-light"
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm uppercase tracking-[0.15em] hover:text-gray-600 dark:hover:text-gray-300 font-light"
              >
                {t('nav.signIn')}
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
