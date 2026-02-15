#!/usr/bin/env node

// Test script to verify database functionality
import { db as prisma } from './lib/db/index.js'

async function testDatabase() {
  console.log('Testing database functionality...\n')

  try {
    // Test 1: Find featured products with include
    console.log('Test 1: Finding featured products with include...')
    const featuredProducts = await prisma.product.findMany({
      where: { featured: true },
      take: 2,
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        category: true,
      },
    })

    console.log(`Found ${featuredProducts.length} featured products`)
    if (featuredProducts.length > 0) {
      const product = featuredProducts[0]
      console.log(`- Product: ${product.name}`)
      console.log(`  Images: ${product.images?.length || 0}`)
      if (product.images && product.images.length > 0) {
        console.log(`  First image: ${product.images[0].url}`)
      }
      console.log(`  Category: ${product.category?.name || 'N/A'}`)
    }
    console.log('✓ Test 1 passed\n')

    // Test 2: Find single product by slug with include
    console.log('Test 2: Finding single product with include...')
    const singleProduct = await prisma.product.findUnique({
      where: { slug: 'luxury-handbag-women' },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        category: true,
      },
    })

    if (singleProduct) {
      console.log(`Product: ${singleProduct.name}`)
      console.log(`Images: ${singleProduct.images?.length || 0}`)
      if (singleProduct.images && singleProduct.images.length > 0) {
        console.log(`First image: ${singleProduct.images[0].url}`)
      }
      console.log('✓ Test 2 passed\n')
    } else {
      console.log('Product not found (this is OK if data is empty)\n')
    }

    console.log('All tests completed successfully!')
  } catch (error) {
    console.error('Error during testing:', error)
    process.exit(1)
  }
}

testDatabase()
