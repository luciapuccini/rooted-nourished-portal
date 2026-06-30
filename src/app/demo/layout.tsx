'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Activity, FileText, MessageSquare, Leaf,
} from 'lucide-react'

const nav = [
  { href: '/demo/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/demo/appointments', label: 'Appointments', icon: <Calendar size={18} /> },
  { href: '/demo/symptoms', label: 'Symptom Tracker', icon: <Activity size={18} /> },
  { href: '/demo/forms', label: 'Forms', icon: <FileText size={18} /> },
  { href: '/demo/chat', label: 'Messages', icon: <MessageSquare size={18} /> },
]

function DemoSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: '#2d5a3d' }}>
      <div className="px-6 py-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Leaf size={20} color="#a8d5b5" />
          <span className="text-white font-semibold text-sm tracking-wide">Rooted & Nourished</span>
        </div>
        <p className="text-xs mt-3 px-2 py-1 rounded-md" style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.15)' }}>
          Demo Mode
        </p>
      </div>

      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ background: '#c17a4a', color: '#fff' }}>
            E
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">Emma Thompson</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Client</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
              style={{
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
              }}>
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Sample client account · demo only
        </p>
      </div>
    </aside>
  )
}

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: '#faf7f2' }}>
      <DemoSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
