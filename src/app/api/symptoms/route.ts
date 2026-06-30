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

  const entries = await prisma.symptomEntry.findMany({
    where: { clientId },
    orderBy: { weekDate: 'asc' },
  })

  return NextResponse.json({ entries })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const clientId = session.role === 'CLIENT' ? session.userId : body.clientId

  const existing = await prisma.symptomEntry.findFirst({
    where: { clientId, weekDate: body.weekDate },
  })

  let entry
  if (existing) {
    entry = await prisma.symptomEntry.update({
      where: { id: existing.id },
      data: { ...body, clientId },
    })
  } else {
    entry = await prisma.symptomEntry.create({
      data: { ...body, clientId },
    })
  }

  return NextResponse.json({ entry })
}
