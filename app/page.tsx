import Link from 'next/link'
import Image from 'next/image'
import { db } from '@/lib/db'
import ProductCard from '@/components/products/ProductCard'

export default async function HomePage() {
  const featuredProducts = await db.product.findMany(
    { featured: true },
    { take: 8, orderBy: { createdAt: 'desc' } }
  )

  // Get images and categories for each product
  const productsWithData = await Promise.all(
    featuredProducts.map(async (product) => {
      const [images, category] = await Promise.all([
        db.productImage.findMany({ productId: product.id }, { orderBy: { position: 'asc' }, take: 1 }),
        db.category.findUnique({ id: product.categoryId }),
      ])
      return {
        ...product,
        images: images || [],
        category: category || { id: '', name: '', slug: '', createdAt: new Date(), updatedAt: new Date() },
      }
    })
  )

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[700px] flex items-center justify-center bg-warm-gray dark:bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 hero-bg-animate">
          <Image
            src="/images/background_main_page.png"
            alt="Luxury Fashion Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center container-custom">
          <h1 className="font-serif text-6xl md:text-8xl mb-8 text-white drop-shadow-lg tracking-[0.1em] font-light">
            Safarov shop
          </h1>
          <p className="text-xl md:text-3xl mb-12 text-white drop-shadow-md font-light tracking-wider">
            Timeless Elegance, Crafted to Perfection
          </p>
          <Link href="/products" className="btn-primary inline-block">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 container-custom">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl mb-6 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            Featured Collection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Discover our curated selection of luxury pieces, each crafted with exceptional
            attention to detail.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {productsWithData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/products" className="btn-secondary inline-block">
            View All Products
          </Link>
        </div>
      </section>

      {/* Promo Sections */}
      <section className="py-24 bg-warm-gray dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative h-[500px] overflow-hidden group">
              <Image
                src="/images/woman_coat_white1.png"
                alt="Women's Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 dark:bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 dark:group-hover:bg-opacity-50 transition-all duration-300">
                <Link href="/category/women" className="btn-primary">
                  Women's Collection
                </Link>
              </div>
            </div>
            <div className="relative h-[500px] overflow-hidden group">
              <Image
                src="/images/suit1.png"
                alt="Men's Collection"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 dark:bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-30 dark:group-hover:bg-opacity-50 transition-all duration-300">
                <Link href="/category/men" className="btn-primary">
                  Men's Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-5xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            Craftsmanship & Quality
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            At Safarov shop, we believe in creating pieces that transcend trends. Our collections
            are crafted from the finest materials, with meticulous attention to detail and
            timeless design. Each garment is a testament to luxury, quality, and enduring style.
          </p>
        </div>
      </section>
    </div>
  )
}
