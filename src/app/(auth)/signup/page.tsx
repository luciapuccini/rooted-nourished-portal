'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Signup failed')
      return
    }

    setDone(true)
    setTimeout(() => router.push('/login'), 2500)
  }

  if (done) {
    return (
      <div className="w-full max-w-md text-center">
        <CheckCircle size={48} color="#3d6b4f" className="mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2" style={{ color: '#3d6b4f' }}>Account created!</h2>
        <p style={{ color: '#8a8a7a' }}>Redirecting you to sign in…</p>
      </div>
    )
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
        <p style={{ color: '#8a8a7a' }}>Create your client account</p>
      </div>

      <div
        className="rounded-2xl shadow-sm border p-8"
        style={{ background: '#ffffff', borderColor: '#e0d8cc' }}
      >
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#2c2c2c' }}>
          Join the portal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your full name' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'Phone (optional)', key: 'phone', type: 'tel', placeholder: '+1 (555) 000-0000' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '8+ characters' },
            { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: 'Repeat password' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#2c2c2c' }}>
                {label}
              </label>
              <input
                type={type}
                required={key !== 'phone'}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none"
                style={{ borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }}
                placeholder={placeholder}
              />
            </div>
          ))}

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg" style={{ background: '#fef2f2', color: '#b91c1c' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition-opacity mt-2"
            style={{ background: '#3d6b4f', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#8a8a7a' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: '#3d6b4f' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
