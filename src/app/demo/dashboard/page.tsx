import { format, parseISO } from 'date-fns'
import Link from 'next/link'
import { Calendar, FileText, Activity, MessageSquare, Clock, ChevronRight, Leaf } from 'lucide-react'
import { DEMO_APPOINTMENTS, DEMO_SYMPTOMS, DEMO_MESSAGES } from '@/lib/demo'

export default function DemoDashboard() {
  const upcoming = DEMO_APPOINTMENTS.filter((a) => a.status !== 'COMPLETED').slice(0, 3)
  const unreadMessages = DEMO_MESSAGES.filter((m) => !m.read && m.senderId !== 'demo-client-001').length

  const cards = [
    { label: 'Upcoming Appointments', value: upcoming.length, icon: <Calendar size={20} />, color: '#3d6b4f', href: '/demo/appointments' },
    { label: 'Unread Messages', value: unreadMessages, icon: <MessageSquare size={20} />, color: '#c17a4a', href: '/demo/chat' },
    { label: 'Symptom Entries', value: DEMO_SYMPTOMS.length, icon: <Activity size={20} />, color: '#6b7a3d', href: '/demo/symptoms' },
    { label: 'Forms Submitted', value: 1, icon: <FileText size={20} />, color: '#7a3d6b', href: '/demo/forms' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={18} color="#3d6b4f" />
          <p className="text-sm font-medium" style={{ color: '#3d6b4f' }}>Welcome back</p>
        </div>
        <h1 className="text-3xl font-semibold" style={{ color: '#2c2c2c' }}>
          Emma&apos;s Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#8a8a7a' }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            className="rounded-xl p-5 transition-shadow hover:shadow-md"
            style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
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

      <div className="mb-6 rounded-xl p-5" style={{ background: '#e8f5ee', border: '1px solid #c5e0d0' }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: '#3d6b4f' }}>
            <Leaf size={14} color="#fff" />
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: '#2d5a3d' }}>Great progress this week, Emma!</p>
            <p className="text-sm mt-0.5" style={{ color: '#4a7a5a' }}>
              Your energy score improved from <strong>4 → 8</strong> over the past 8 weeks. Keep up the incredible work! 🌱
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold" style={{ color: '#2c2c2c' }}>Upcoming Appointments</h2>
          <Link href="/demo/appointments" className="text-sm" style={{ color: '#3d6b4f' }}>View all</Link>
        </div>
        <div className="space-y-3">
          {upcoming.map((apt) => (
            <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg"
              style={{ background: '#e8f0eb' }}>
              <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center"
                style={{ background: '#3d6b4f', color: '#fff' }}>
                <span className="text-xs font-bold leading-none">
                  {format(parseISO(apt.date), 'MMM')}
                </span>
                <span className="text-sm font-bold leading-none">
                  {format(parseISO(apt.date), 'd')}
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
                <span className="text-xs px-3 py-1.5 rounded-lg font-medium text-white"
                  style={{ background: '#3d6b4f' }}>
                  Join Zoom
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#2c2c2c' }}>Latest from Sophia</h3>
          <p className="text-sm" style={{ color: '#2c2c2c' }}>
            &ldquo;Yes! That&apos;s a great observation Emma. Please track your meals for 3 days and note any symptoms within 2 hours of eating.&rdquo;
          </p>
          <p className="text-xs mt-3" style={{ color: '#8a8a7a' }}>Jun 24 · 10:00 AM</p>
          <Link href="/demo/chat" className="mt-3 inline-block text-sm font-medium" style={{ color: '#3d6b4f' }}>
            Reply →
          </Link>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#ffffff', border: '1px solid #e0d8cc' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#2c2c2c' }}>This Week&apos;s Focus</h3>
          <ul className="space-y-2 text-sm" style={{ color: '#2c2c2c' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: '#3d6b4f' }}>✓</span>
              Drink 8+ glasses of water daily
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#3d6b4f' }}>✓</span>
              Take probiotic with each meal
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#c17a4a' }}>→</span>
              Log your 3-day food diary
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#c17a4a' }}>→</span>
              Track symptoms after each meal
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
