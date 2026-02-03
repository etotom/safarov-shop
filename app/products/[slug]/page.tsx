import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import ProductGallery from '@/components/products/ProductGallery'
import AddToCartButton from '@/components/cart/AddToCartButton'
import ProductCard from '@/components/products/ProductCard'
import CurrencyConverter from '@/components/currency/CurrencyConverter'

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProduct(slug: string) {
  const product = await db.product.findUnique({ slug })
  if (!product) return null

  const [images, category, variants, inventory] = await Promise.all([
    db.productImage.findMany({ productId: product.id }, { orderBy: { position: 'asc' } }),
    db.category.findUnique({ id: product.categoryId }),
    db.variant.findMany({ productId: product.id, name: 'Color' }),
    db.inventory.findMany({ productId: product.id }),
  ])

  const inventoryWithVariants = await Promise.all(
    inventory.map(async (inv) => {
      const variant = inv.variantId ? await db.variant.findFirst({ id: inv.variantId }) : null
      return { ...inv, variant }
    })
  )

  return {
    ...product,
    images: images || [],
    category: category || { id: '', name: '', slug: '', createdAt: new Date(), updatedAt: new Date() },
    variants: variants || [],
    inventory: inventoryWithVariants,
  }
}

async function getRelatedProducts(categoryId: string, productId: string) {
  const products = await db.product.findMany({ categoryId }, { take: 4 })
  const filtered = products.filter((p) => p.id !== productId).slice(0, 4)

  return Promise.all(
    filtered.map(async (product) => {
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
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id)

  const sizeVariants = await db.variant.findMany({ productId: product.id, name: 'Size' })
  const sizes = sizeVariants.map((v) => v.value).sort()

  const colors = product.variants.filter((v) => v.name === 'Color')

  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: product.currency || 'USD',
  }).format(Number(product.price))

  return (
    <div className="container-custom py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Product Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-6">
            <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-[0.2em] font-light">
              {product.category.name}
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-8 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            {product.name}
          </h1>
          <div className="mb-10">
            <p className="text-3xl mb-4 text-gray-900 dark:text-gray-100 font-light">{price}</p>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-light">Convert to:</div>
            <CurrencyConverter amount={Number(product.price)} baseCurrency={product.currency || 'USD'} />
          </div>

          {product.description && (
            <div className="mb-10 text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-light">
              {product.description}
            </div>
          )}

          {product.material && (
            <div className="mb-10">
              <h3 className="text-xs font-light uppercase tracking-[0.2em] mb-3 text-gray-900 dark:text-gray-100">
                Material
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light">{product.material}</p>
            </div>
          )}

          {/* Variants */}
          {colors.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-light uppercase tracking-[0.2em] mb-4 text-gray-900 dark:text-gray-100">
                Color
              </h3>
              <div className="flex space-x-4">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    className="w-12 h-12 border-2 border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors rounded"
                    style={{ backgroundColor: color.value.toLowerCase() }}
                    aria-label={color.value}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xs font-light uppercase tracking-[0.2em] mb-4 text-gray-900 dark:text-gray-100">
                Size
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-colors text-sm font-light text-gray-900 dark:text-gray-100"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AddToCartButton productId={product.id} />
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="font-serif text-4xl mb-12 text-gray-900 dark:text-gray-100 tracking-[0.05em] font-light">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
