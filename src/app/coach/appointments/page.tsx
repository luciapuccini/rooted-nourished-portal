import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { format, isPast, parseISO } from 'date-fns'
import Link from 'next/link'
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'
import ScheduleAppointment from './ScheduleAppointment'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  CONFIRMED: { label: 'Confirmed', color: '#3d6b4f', bg: '#e8f0eb' },
  PENDING: { label: 'Pending', color: '#c17a4a', bg: '#f5ebe0' },
  CANCELLED: { label: 'Cancelled', color: '#b91c1c', bg: '#fef2f2' },
  COMPLETED: { label: 'Completed', color: '#8a8a7a', bg: '#f4f4f2' },
}

export default async function CoachAppointmentsPage() {
  const session = await getSession()
  if (!session) return null

  const [appointments, clients] = await Promise.all([
    prisma.appointment.findMany({
      where: { coachId: session.userId },
      include: { client: { select: { id: true, name: true, email: true } } },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    }),
    prisma.user.findMany({
      where: { role: 'CLIENT' },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    }),
  ])

  const upcoming = appointments.filter((a) => {
    try { return !isPast(parseISO(a.date)) }
    catch { return true }
  })
  const past = appointments.filter((a) => {
    try { return isPast(parseISO(a.date)) }
    catch { return false }
  })

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>Appointments</h1>
          <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
            Schedule and manage client sessions
          </p>
        </div>
        <ScheduleAppointment clients={clients} coachId={session.userId} />
      </div>

      {appointments.length === 0 ? (
        <div className="rounded-xl p-16 text-center" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <Calendar size={48} color="#e0d8cc" className="mx-auto mb-4" />
          <p className="font-medium" style={{ color: '#2c2c2c' }}>No appointments yet</p>
          <p className="text-sm mt-1" style={{ color: '#8a8a7a' }}>Schedule a client&apos;s first session to get started.</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#8a8a7a' }}>
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((apt) => {
                  const cfg = statusConfig[apt.status] || statusConfig.PENDING
                  return (
                    <div key={apt.id} className="flex items-center gap-4 p-5 rounded-xl transition-shadow hover:shadow-sm"
                      style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
                      <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                        style={{ background: '#3d6b4f' }}>
                        <span className="text-xs font-medium leading-none">{apt.date.slice(5, 7)}/{apt.date.slice(8, 10)}</span>
                        <span className="text-xs leading-none opacity-70">{apt.date.slice(0, 4)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium" style={{ color: '#2c2c2c' }}>{apt.title}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm" style={{ color: '#8a8a7a' }}>
                            <Link href={`/coach/clients/${apt.client.id}`} className="hover:underline">
                              {apt.client.name}
                            </Link>
                          </span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#8a8a7a' }}>
                            <Clock size={12} /> {apt.time} · {apt.duration} min
                          </span>
                          {apt.zoomLink && (
                            <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-medium" style={{ color: '#3d6b4f' }}>
                              Zoom link →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#8a8a7a' }}>
                Past Sessions ({past.length})
              </h2>
              <div className="space-y-2 opacity-70">
                {past.slice(0, 10).map((apt) => (
                  <div key={apt.id} className="flex items-center gap-4 px-5 py-3 rounded-xl"
                    style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
                    <span className="text-sm w-20" style={{ color: '#8a8a7a' }}>{apt.date}</span>
                    <span className="flex-1 text-sm font-medium" style={{ color: '#2c2c2c' }}>{apt.title}</span>
                    <Link href={`/coach/clients/${apt.client.id}`} className="text-sm" style={{ color: '#8a8a7a' }}>
                      {apt.client.name}
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
