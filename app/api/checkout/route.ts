import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress } = body

    // Get cart items with product details
    const cartItemsRaw = await db.cartItem.findMany({ userId: session.user.id })
    const cartItems = await Promise.all(
      cartItemsRaw.map(async (item) => {
        const [product, variant] = await Promise.all([
          db.product.findUnique({ id: item.productId }),
          item.variantId ? db.variant.findFirst({ id: item.variantId }) : null,
        ])
        return {
          ...item,
          product: product || { id: '', name: '', slug: '', price: 0, currency: 'USD', categoryId: '', featured: false, createdAt: new Date(), updatedAt: new Date() },
          variant,
        }
      })
    )

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Create or get shipping address
    let addressId: string | undefined
    if (shippingAddress) {
      const address = await db.address.create({
        userId: session.user.id,
        ...shippingAddress,
      })
      addressId = address.id
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    )

    // Get product images
    const productIds = cartItems.map((item) => item.productId)
    const productsWithImages = await Promise.all(
      productIds.map(async (id) => {
        const images = await db.productImage.findMany({ productId: id }, { orderBy: { position: 'asc' }, take: 1 })
        return { id, images }
      })
    )

    const imageMap = new Map(productsWithImages.map((p) => [p.id, p.images[0]?.url || '']))

    // Create Stripe checkout session
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: item.product.currency.toLowerCase() || 'usd',
        product_data: {
          name: item.product.name,
          images: imageMap.get(item.productId) ? [imageMap.get(item.productId)!] : [],
        },
        unit_amount: Math.round(Number(item.product.price) * 100),
      },
      quantity: item.quantity,
    }))

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        addressId: addressId || '',
      },
    })

    // Create order (pending status)
    const order = await db.order.create({
      userId: session.user.id,
      status: 'PENDING',
      total,
      stripePaymentId: stripeSession.id,
      shippingAddressId: addressId,
    })

    // Create order items
    await Promise.all(
      cartItems.map((item) =>
        db.orderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
          variantId: item.variantId || null,
        })
      )
    )

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
