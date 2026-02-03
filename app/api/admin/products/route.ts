import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { images, sizes, variants, ...productData } = data

    // Validate category
    if (!productData.categoryId) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const category = await db.category.findUnique({ id: productData.categoryId })
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 })
    }

    // Create product
    const product = await db.product.create({
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      price: parseFloat(productData.price),
      categoryId: productData.categoryId,
      material: productData.material || null,
      featured: productData.featured || false,
      currency: productData.currency || 'USD',
    })

    // Create images
    if (images && images.length > 0) {
      await db.productImage.createMany(
        images.map((url: string, index: number) => ({
          productId: product.id,
          url: url.trim(),
          alt: `${productData.name} - Image ${index + 1}`,
          position: index,
        }))
      )
    }

    // Create size variants and inventory
    if (sizes && sizes.length > 0) {
      for (const size of sizes) {
        const sizeVariant = await db.variant.create({
          productId: product.id,
          name: 'Size',
          value: size,
        })

        await db.inventory.create({
          productId: product.id,
          variantId: sizeVariant.id,
          quantity: 10, // Default quantity
        })
      }
    }

    // Create color variants
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        if (variant.value) {
          await db.variant.create({
            productId: product.id,
            name: variant.name || 'Color',
            value: variant.value,
          })
        }
      }
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
