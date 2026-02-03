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
    const { parentId, ...categoryData } = data

    // Validate parent category if provided
    if (parentId) {
      const parent = await db.category.findUnique({ id: parentId })
      if (!parent) {
        return NextResponse.json({ error: 'Parent category not found' }, { status: 400 })
      }
    }

    const category = await db.category.create({
      ...categoryData,
      parentId: parentId || null,
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
