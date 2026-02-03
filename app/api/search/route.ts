import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')?.toLowerCase() || ''

    if (query.length < 2) {
      return NextResponse.json({ products: [] })
    }

    const allProducts = await db.product.findMany({})

    const filtered = allProducts.filter((product) => {
      const searchText = `${product.name} ${product.description || ''} ${product.material || ''}`.toLowerCase()
      return searchText.includes(query)
    })

    return NextResponse.json({ products: filtered.slice(0, 20) })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ products: [] })
  }
}
