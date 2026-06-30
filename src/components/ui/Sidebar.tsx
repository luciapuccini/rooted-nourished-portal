'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  FileText,
  Activity,
  Users,
  ClipboardList,
  TrendingUp,
  LogOut,
  Leaf,
} from 'lucide-react'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

interface SidebarProps {
  role: 'CLIENT' | 'COACH'
  userName: string
  clientId?: string
}

const clientNav: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/appointments', label: 'Appointments', icon: <Calendar size={18} /> },
  { href: '/symptoms', label: 'Symptom Tracker', icon: <Activity size={18} /> },
  { href: '/forms', label: 'Forms', icon: <FileText size={18} /> },
  { href: '/chat', label: 'Messages', icon: <MessageSquare size={18} /> },
]

const coachNav: NavItem[] = [
  { href: '/coach/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/coach/clients', label: 'All Clients', icon: <Users size={18} /> },
  { href: '/coach/appointments', label: 'Appointments', icon: <Calendar size={18} /> },
  { href: '/coach/chat', label: 'Messages', icon: <MessageSquare size={18} /> },
]

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = role === 'COACH' ? coachNav : clientNav

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#2d5a3d' }}>
      <div className="px-6 py-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={20} color="#a8d5b5" />
          <span className="text-white font-semibold text-sm tracking-wide">Rooted & Nourished</span>
        </div>
        <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {role === 'COACH' ? 'Coach Portal' : 'Client Portal'}
        </p>
      </div>

      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ background: '#c17a4a', color: '#fff' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">{userName}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {role === 'COACH' ? 'Practitioner' : 'Client'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

export function ClientLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: { name: string; role: 'CLIENT' | 'COACH' }
}) {
  return (
    <div className="flex min-h-screen" style={{ background: '#faf7f2' }}>
      <Sidebar role={session.role} userName={session.name} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
