import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import {
  sendMessageNotificationToCoach,
  sendReplyNotificationToClient,
} from '@/lib/email'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const withUserId = searchParams.get('with')

  let messages
  if (session.role === 'CLIENT') {
    const coachId = await getCoachId()
    messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId, recipientId: coachId },
          { senderId: coachId, recipientId: session.userId },
        ],
      },
      include: {
        sender: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
    await prisma.message.updateMany({
      where: { recipientId: session.userId, read: false },
      data: { read: true },
    })
  } else {
    if (!withUserId) {
      const latestMessages = await prisma.message.findMany({
        where: {
          OR: [{ senderId: session.userId }, { recipientId: session.userId }],
        },
        include: { sender: { select: { name: true, role: true } }, recipient: { select: { name: true, role: true } } },
        orderBy: { createdAt: 'desc' },
      })
      const seen = new Set<string>()
      const threads: typeof latestMessages = []
      for (const m of latestMessages) {
        const otherId = m.senderId === session.userId ? m.recipientId : m.senderId
        if (!seen.has(otherId)) { seen.add(otherId); threads.push(m) }
      }
      return NextResponse.json({ threads })
    }

    messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.userId, recipientId: withUserId },
          { senderId: withUserId, recipientId: session.userId },
        ],
      },
      include: { sender: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    })
    await prisma.message.updateMany({
      where: { senderId: withUserId, recipientId: session.userId, read: false },
      data: { read: true },
    })
  }

  return NextResponse.json({ messages })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content, recipientId } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 })

  let finalRecipientId = recipientId
  if (session.role === 'CLIENT') {
    finalRecipientId = await getCoachId()
  }

  const message = await prisma.message.create({
    data: { senderId: session.userId, recipientId: finalRecipientId, content },
    include: { sender: { select: { name: true, role: true } } },
  })

  if (session.role === 'CLIENT') {
    try {
      await sendMessageNotificationToCoach({
        clientName: session.name,
        clientEmail: session.email,
        message: content,
      })
    } catch (e) { console.error('Email error:', e) }
  } else {
    try {
      const client = await prisma.user.findUnique({ where: { id: finalRecipientId } })
      if (client) {
        await sendReplyNotificationToClient({
          clientName: client.name,
          clientEmail: client.email,
          message: content,
        })
      }
    } catch (e) { console.error('Email error:', e) }
  }

  return NextResponse.json({ message })
}

async function getCoachId(): Promise<string> {
  const coach = await prisma.user.findFirst({ where: { role: 'COACH' } })
  return coach?.id || ''
}
