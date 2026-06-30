import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format, parseISO, isPast } from 'date-fns'
import { Calendar, Clock, Video, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  CONFIRMED: { label: 'Confirmed', icon: <CheckCircle size={14} />, color: '#3d6b4f', bg: '#e8f0eb' },
  PENDING: { label: 'Pending', icon: <AlertCircle size={14} />, color: '#c17a4a', bg: '#f5ebe0' },
  CANCELLED: { label: 'Cancelled', icon: <XCircle size={14} />, color: '#b91c1c', bg: '#fef2f2' },
  COMPLETED: { label: 'Completed', icon: <CheckCircle size={14} />, color: '#8a8a7a', bg: '#f4f4f2' },
}

export default async function AppointmentsPage() {
  const session = await getSession()
  if (!session) return null

  const appointments = await prisma.appointment.findMany({
    where: { clientId: session.userId },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  const upcoming = appointments.filter((a) => {
    try { return !isPast(parseISO(a.date)) || a.status === 'PENDING' }
    catch { return true }
  })
  const past = appointments.filter((a) => {
    try { return isPast(parseISO(a.date)) && a.status !== 'PENDING' }
    catch { return false }
  })

  function AppointmentCard({ apt }: { apt: typeof appointments[0] }) {
    const cfg = statusConfig[apt.status] || statusConfig.PENDING
    return (
      <div className="rounded-xl p-5 transition-shadow hover:shadow-sm"
        style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold" style={{ color: '#2c2c2c' }}>{apt.title}</h3>
            {apt.notes && <p className="text-sm mt-1" style={{ color: '#8a8a7a' }}>{apt.notes}</p>}
          </div>
          <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: cfg.bg, color: cfg.color }}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#8a8a7a' }}>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {apt.date ? format(parseISO(apt.date), 'EEEE, MMMM d, yyyy') : '—'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {apt.time} · {apt.duration} min
          </span>
          {apt.zoomLink && (
            <a href={apt.zoomLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium" style={{ color: '#3d6b4f' }}>
              <Video size={14} /> Join Zoom
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>Appointments</h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          Your scheduled sessions with Sophia
        </p>
      </div>

      {upcoming.length === 0 && past.length === 0 && (
        <div className="rounded-xl p-12 text-center" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <Calendar size={40} color="#e0d8cc" className="mx-auto mb-4" />
          <p className="font-medium" style={{ color: '#2c2c2c' }}>No appointments yet</p>
          <p className="text-sm mt-1" style={{ color: '#8a8a7a' }}>
            Sophia will schedule your sessions here. You&apos;ll receive an email confirmation.
          </p>
        </div>
      )}

      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#8a8a7a' }}>
            Upcoming
          </h2>
          <div className="space-y-3">
            {upcoming.map((a) => <AppointmentCard key={a.id} apt={a} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#8a8a7a' }}>
            Past Sessions
          </h2>
          <div className="space-y-3 opacity-70">
            {past.map((a) => <AppointmentCard key={a.id} apt={a} />)}
          </div>
        </section>
      )}
    </div>
  )
}
