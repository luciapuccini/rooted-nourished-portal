import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { Users, Calendar, MessageSquare, TrendingUp, Clock, ChevronRight } from 'lucide-react'

export default async function CoachDashboard() {
  const session = await getSession()
  if (!session) return null

  const [clients, appointments, unreadMessages] = await Promise.all([
    prisma.user.count({ where: { role: 'CLIENT' } }),
    prisma.appointment.findMany({
      where: { coachId: session.userId, status: { in: ['CONFIRMED', 'PENDING'] } },
      include: { client: { select: { name: true } } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
      take: 5,
    }),
    prisma.message.count({ where: { recipientId: session.userId, read: false } }),
  ])

  const recentClients = await prisma.user.findMany({
    where: { role: 'CLIENT' },
    select: {
      id: true, name: true, email: true, createdAt: true,
      _count: { select: { clientAppointments: true, symptoms: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = [
    { label: 'Total Clients', value: clients, icon: <Users size={20} />, color: '#3d6b4f', href: '/coach/clients' },
    { label: 'Upcoming Sessions', value: appointments.length, icon: <Calendar size={20} />, color: '#6b7a3d', href: '/coach/appointments' },
    { label: 'Unread Messages', value: unreadMessages, icon: <MessageSquare size={20} />, color: '#c17a4a', href: '/coach/chat' },
  ]

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>
          Good morning, Sophia 🌿
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="rounded-xl p-6 flex items-center gap-4 transition-shadow hover:shadow-md"
            style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: s.color + '18', color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: '#2c2c2c' }}>{s.value}</p>
              <p className="text-sm" style={{ color: '#8a8a7a' }}>{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: '#2c2c2c' }}>Upcoming Appointments</h2>
            <Link href="/coach/appointments" className="text-sm" style={{ color: '#3d6b4f' }}>View all</Link>
          </div>
          {appointments.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#8a8a7a' }}>No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: '#e8f0eb' }}>
                  <div className="w-9 h-9 rounded-lg flex flex-col items-center justify-center text-white text-xs"
                    style={{ background: '#3d6b4f' }}>
                    <span className="font-bold leading-none">{apt.date.slice(8, 10)}</span>
                    <span className="leading-none opacity-80">{apt.date.slice(5, 7)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#2c2c2c' }}>{apt.client.name}</p>
                    <div className="flex items-center gap-1">
                      <Clock size={11} color="#8a8a7a" />
                      <p className="text-xs" style={{ color: '#8a8a7a' }}>{apt.time} · {apt.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold" style={{ color: '#2c2c2c' }}>Recent Clients</h2>
            <Link href="/coach/clients" className="text-sm" style={{ color: '#3d6b4f' }}>View all</Link>
          </div>
          {recentClients.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: '#8a8a7a' }}>No clients yet</p>
          ) : (
            <div className="space-y-2">
              {recentClients.map((c) => (
                <Link key={c.id} href={`/coach/clients/${c.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ background: '#c17a4a' }}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#2c2c2c' }}>{c.name}</p>
                    <p className="text-xs" style={{ color: '#8a8a7a' }}>
                      {c._count.clientAppointments} sessions · {c._count.symptoms} symptom entries
                    </p>
                  </div>
                  <ChevronRight size={15} color="#8a8a7a" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl p-6" style={{ background: '#e8f0eb', border: '1px solid #c8dfd0' }}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} color="#3d6b4f" />
          <h3 className="font-semibold text-sm" style={{ color: '#3d6b4f' }}>Quick Actions</h3>
        </div>
        <div className="flex gap-3 mt-3">
          <Link href="/coach/appointments"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: '#3d6b4f' }}>
            + Schedule Appointment
          </Link>
          <Link href="/coach/clients"
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: '#3d6b4f', color: '#3d6b4f', background: '#fff' }}>
            View All Clients
          </Link>
          <Link href="/coach/chat"
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: '#3d6b4f', color: '#3d6b4f', background: '#fff' }}>
            {unreadMessages > 0 ? `${unreadMessages} Unread Messages` : 'Open Messages'}
          </Link>
        </div>
      </div>
    </div>
  )
}
