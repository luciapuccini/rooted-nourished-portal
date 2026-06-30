'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Login failed')
      return
    }

    if (data.user.role === 'COACH') {
      router.push('/coach/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Leaf size={28} color="#3d6b4f" />
          <h1 className="text-2xl font-semibold" style={{ color: '#3d6b4f' }}>
            Rooted & Nourished
          </h1>
        </div>
        <p style={{ color: '#8a8a7a' }}>Client & Practitioner Portal</p>
      </div>

      <div
        className="rounded-2xl shadow-sm border p-8"
        style={{ background: '#ffffff', borderColor: '#e0d8cc' }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#2c2c2c' }}>
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-all"
              style={{ borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: '#fef2f2', color: '#b91c1c' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity"
            style={{ background: '#3d6b4f', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#8a8a7a' }}>
          New client?{' '}
          <Link href="/signup" className="font-medium" style={{ color: '#3d6b4f' }}>
            Create your account
          </Link>
        </p>
      </div>

      <p className="text-center text-xs mt-6" style={{ color: '#8a8a7a' }}>
        Heal the root. Nourish for life.
      </p>
    </div>
  )
}
