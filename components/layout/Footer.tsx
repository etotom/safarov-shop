'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import { useLanguage } from '@/lib/language.tsx'
import { useTranslation } from '@/lib/translations.ts'

export default function Footer() {
  const { language } = useLanguage()
  const t = useTranslation(language)
  return (
    <footer className="bg-warm-gray dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto transition-colors">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-serif text-lg mb-4 text-gray-900 dark:text-gray-100">{t('footer.aboutTitle')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('footer.aboutDesc')}
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">{t('footer.shopTitle')}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/category/women" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('category.women')}
                </Link>
              </li>
              <li>
                <Link href="/category/men" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('category.men')}
                </Link>
              </li>
              <li>
                <Link href="/category/kids" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('category.kids')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('footer.allProducts')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">{t('footer.customerServiceTitle')}</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors">
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-medium mb-4 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to receive updates on new collections and exclusive offers.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="input-field text-sm"
              />
              <button type="submit" className="btn-primary text-sm">
                Subscribe
              </button>
            </form>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <p>{t('footer.copyrightPrefix')} Safarov shop. {t('footer.allRightsReserved')}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">
              {t('footer.privacyPolicy')}
            </Link>
            <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">
              {t('footer.termsOfService')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
