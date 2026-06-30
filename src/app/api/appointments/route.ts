import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { sendAppointmentConfirmation } from '@/lib/email'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const clientId = searchParams.get('clientId')

  let where = {}
  if (session.role === 'CLIENT') {
    where = { clientId: session.userId }
  } else if (clientId) {
    where = { clientId }
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: { client: { select: { name: true, email: true } } },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  return NextResponse.json({ appointments })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session || session.role !== 'COACH') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { clientId, title, date, time, duration, notes, zoomLink } = body

  const client = await prisma.user.findUnique({ where: { id: clientId } })
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const appointment = await prisma.appointment.create({
    data: {
      clientId,
      coachId: session.userId,
      title,
      date,
      time,
      duration: duration || 60,
      notes,
      zoomLink,
      status: 'CONFIRMED',
    },
  })

  try {
    await sendAppointmentConfirmation({
      clientName: client.name,
      clientEmail: client.email,
      title,
      date,
      time,
      zoomLink,
    })
  } catch (e) {
    console.error('Email failed:', e)
  }

  return NextResponse.json({ appointment })
}
