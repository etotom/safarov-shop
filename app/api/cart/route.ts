import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const cartItems = await db.cartItem.findMany({ userId: session.user.id })
    const itemsWithData = await Promise.all(
      cartItems.map(async (item) => {
        const [product, variant] = await Promise.all([
          db.product.findUnique({ id: item.productId }),
          item.variantId ? db.variant.findFirst({ id: item.variantId }) : null,
        ])
        const images = product
          ? await db.productImage.findMany({ productId: product.id }, { orderBy: { position: 'asc' }, take: 1 })
          : []
        return {
          ...item,
          product: product
            ? {
                ...product,
                images,
              }
            : null,
          variant,
        }
      })
    )

    return NextResponse.json({ items: itemsWithData })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { productId, variantId, quantity = 1 } = body

    const existingItem = await db.cartItem.findUnique({
      userId_productId_variantId: {
        userId: session.user.id,
        productId,
        variantId: variantId || null,
      },
    })

    if (existingItem) {
      const updated = await db.cartItem.update(
        { id: existingItem.id },
        { quantity: existingItem.quantity + quantity }
      )
      return NextResponse.json(updated)
    }

    const newItem = await db.cartItem.create({
      userId: session.user.id,
      productId,
      variantId: variantId || null,
      quantity,
    })

    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { itemId, quantity } = body

    const allItems = await db.cartItem.findMany({ userId: session.user.id })
    const item = allItems.find((i) => i.id === itemId)

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const updated = await db.cartItem.update({ id: itemId }, { quantity })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { itemId } = body

    const allItems = await db.cartItem.findMany({ userId: session.user.id })
    const item = allItems.find((i) => i.id === itemId)

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await db.cartItem.delete({ id: itemId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
