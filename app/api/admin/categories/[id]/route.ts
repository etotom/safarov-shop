import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const category = await db.category.findUnique({ id: params.id })

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const { parentId, ...updateData } = data

    // Validate parent category if provided (and not setting to null)
    if (parentId) {
      const parent = await db.category.findUnique({ id: parentId })
      if (!parent) {
        return NextResponse.json({ error: 'Parent category not found' }, { status: 400 })
      }
      // Prevent circular references
      if (parentId === params.id) {
        return NextResponse.json({ error: 'Category cannot be its own parent' }, { status: 400 })
      }
    }

    const category = await db.category.update({
      where: { id: params.id },
      data: {
        ...updateData,
        parentId: parentId || null,
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}
