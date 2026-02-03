import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const addresses = await db.address.findMany({ userId: session.user.id })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { isDefault, ...addressData } = data

    // If this is set as default, unset all other defaults
    if (isDefault) {
      const existingAddresses = await db.address.findMany({ userId: session.user.id })
      for (const addr of existingAddresses) {
        if (addr.isDefault) {
          await db.address.update({ id: addr.id }, { isDefault: false })
        }
      }
    }

    const address = await db.address.create({
      ...addressData,
      userId: session.user.id,
      isDefault: isDefault || false,
    })

    return NextResponse.json(address)
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}
