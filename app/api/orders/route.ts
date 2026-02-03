import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await db.order.findMany({ userId: session.user.id }, { orderBy: { createdAt: 'desc' } })
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await db.orderItem.findMany({ orderId: order.id })
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            const product = await db.product.findUnique({ id: item.productId })
            return {
              ...item,
              product: product ? { name: product.name } : { name: 'Unknown' },
            }
          })
        )
        return {
          ...order,
          items: itemsWithProducts,
        }
      })
    )

    return NextResponse.json({ orders: ordersWithItems })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
