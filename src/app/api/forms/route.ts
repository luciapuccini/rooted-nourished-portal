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

  const forms = await prisma.form.findMany({
    where: { clientId },
    orderBy: { submittedAt: 'desc' },
  })

  return NextResponse.json({ forms })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const clientId = session.role === 'CLIENT' ? session.userId : body.clientId

  const form = await prisma.form.create({
    data: {
      clientId,
      type: body.type || 'INTAKE',
      data: JSON.stringify(body.data),
    },
  })

  return NextResponse.json({ form })
}
