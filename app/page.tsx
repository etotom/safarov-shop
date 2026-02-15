import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import HeroContent from '@/components/home/HeroContent'
import FeaturedSection from '@/components/home/FeaturedSection'
import PromoSection from '@/components/home/PromoSection'
import AboutSection from '@/components/home/AboutSection'

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
    include: {
      images: {
        orderBy: { position: 'asc' },
      },
      category: true,
    },
  })

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
          <HeroContent />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 container-custom">
        <FeaturedSection products={featuredProducts} />
      </section>

      {/* Promo Sections */}
      <section className="py-24 bg-warm-gray dark:bg-gray-900">
        <PromoSection />
      </section>

      {/* About Section */}
      <section className="py-24 container-custom">
        <AboutSection />
      </section>
    </div>
  )
}

