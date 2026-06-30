import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const clientId = searchParams.get('clientId') || session.userId

  if (session.role === 'CLIENT' && clientId !== session.userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const records = await prisma.record.findMany({
    where: { clientId },
    include: { appointment: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ records })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'COACH') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { clientId, appointmentId, notes, recommendations } = body

  const record = await prisma.record.create({
    data: {
      clientId,
      coachId: session.userId,
      appointmentId: appointmentId || null,
      notes,
      recommendations,
    },
  })

  return NextResponse.json({ record })
}
