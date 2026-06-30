import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format, isAfter, parseISO, startOfToday } from 'date-fns'
import Link from 'next/link'
import { Calendar, FileText, Activity, MessageSquare, Clock, ChevronRight, Leaf } from 'lucide-react'

export default async function ClientDashboard() {
  const session = await getSession()
  if (!session) return null

  const today = startOfToday()

  const [upcomingAppts, messages, symptoms, forms] = await Promise.all([
    prisma.appointment.findMany({
      where: { clientId: session.userId, status: { in: ['CONFIRMED', 'PENDING'] } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 3,
    }),
    prisma.message.count({ where: { recipientId: session.userId, read: false } }),
    prisma.symptomEntry.count({ where: { clientId: session.userId } }),
    prisma.form.count({ where: { clientId: session.userId } }),
  ])

  const upcoming = upcomingAppts.filter((a) => {
    try { return isAfter(parseISO(a.date), today) || a.date === format(today, 'yyyy-MM-dd') }
    catch { return false }
  })

  const intakeSubmitted = await prisma.form.count({ where: { clientId: session.userId, type: 'INTAKE' } })

  const cards = [
    { label: 'Upcoming Appointments', value: upcoming.length, icon: <Calendar size={20} />, color: '#3d6b4f', href: '/appointments' },
    { label: 'Unread Messages', value: messages, icon: <MessageSquare size={20} />, color: '#c17a4a', href: '/chat' },
    { label: 'Symptom Entries', value: symptoms, icon: <Activity size={20} />, color: '#6b7a3d', href: '/symptoms' },
    { label: 'Forms Submitted', value: forms, icon: <FileText size={20} />, color: '#7a3d6b', href: '/forms' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={18} color="#3d6b4f" />
          <p className="text-sm font-medium" style={{ color: '#3d6b4f' }}>Welcome back</p>
        </div>
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>
          {session.name.split(' ')[0]}&apos;s Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {!intakeSubmitted && (
        <div
          className="mb-6 rounded-xl p-4 flex items-center justify-between"
          style={{ background: '#f5ebe0', border: '1px solid #e0d8cc' }}
        >
          <div>
            <p className="font-medium text-sm" style={{ color: '#c17a4a' }}>Complete your intake form</p>
            <p className="text-sm" style={{ color: '#8a8a7a' }}>Help Sophia understand your health history and goals.</p>
          </div>
          <Link
            href="/forms"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#c17a4a' }}
          >
            Start Form
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            className="rounded-xl p-5 transition-shadow hover:shadow-md"
            style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: c.color + '18', color: c.color }}>
                {c.icon}
              </div>
              <ChevronRight size={16} color="#8a8a7a" />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#2c2c2c' }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ color: '#8a8a7a' }}>{c.label}</p>
          </Link>
        ))}
      </div>

      {upcoming.length > 0 && (
        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: '#2c2c2c' }}>Upcoming Appointments</h2>
            <Link href="/appointments" className="text-sm" style={{ color: '#3d6b4f' }}>View all</Link>
          </div>
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: '#e8f0eb' }}>
                <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center"
                  style={{ background: '#3d6b4f', color: '#fff' }}>
                  <span className="text-xs font-bold leading-none">
                    {apt.date ? format(parseISO(apt.date), 'MMM') : '--'}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    {apt.date ? format(parseISO(apt.date), 'd') : '--'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#2c2c2c' }}>{apt.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={12} color="#8a8a7a" />
                    <p className="text-xs" style={{ color: '#8a8a7a' }}>{apt.time} · {apt.duration} min</p>
                  </div>
                </div>
                {apt.zoomLink && (
                  <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                    style={{ background: '#3d6b4f' }}>
                    Join
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
