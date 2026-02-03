import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const address = await db.address.findUnique({ id: params.id })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const data = await request.json()
    const { isDefault, ...updateData } = data

    // If this is set as default, unset all other defaults
    if (isDefault) {
      const existingAddresses = await db.address.findMany({ userId: session.user.id })
      for (const addr of existingAddresses) {
        if (addr.id !== params.id && addr.isDefault) {
          await db.address.update({ id: addr.id }, { isDefault: false })
        }
      }
    }

    const updatedAddress = await db.address.update(
      { id: params.id },
      { ...updateData, isDefault: isDefault || false }
    )

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const address = await db.address.findUnique({ id: params.id })

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    if (address.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await db.address.delete({ id: params.id })

    return NextResponse.json({ message: 'Address deleted successfully' })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}
