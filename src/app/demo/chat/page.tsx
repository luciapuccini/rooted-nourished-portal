'use client'

import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { Send, Leaf } from 'lucide-react'
import { DEMO_MESSAGES } from '@/lib/demo'

const MY_ID = 'demo-client-001'

export default function DemoChat() {
  const [messages, setMessages] = useState(DEMO_MESSAGES)
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        senderId: MY_ID,
        recipientId: 'coach-001',
        content: text,
        read: true,
        createdAt: new Date(),
        sender: { name: 'Emma Thompson', role: 'CLIENT' },
      },
    ])
    setText('')
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="px-8 py-5 border-b" style={{ background: '#ffffff', borderColor: '#e0d8cc' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: '#3d6b4f' }}>
            <Leaf size={18} color="#fff" />
          </div>
          <div>
            <h1 className="font-semibold" style={{ color: '#2c2c2c' }}>Sophia Khosravi</h1>
            <p className="text-xs" style={{ color: '#8a8a7a' }}>Nutrition & Health Coach · Rooted & Nourished</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4" style={{ background: '#faf7f2' }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === MY_ID
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-sm lg:max-w-md">
                {!isMe && (
                  <p className="text-xs mb-1 px-1" style={{ color: '#8a8a7a' }}>{msg.sender.name}</p>
                )}
                <div
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{
                    background: isMe ? '#3d6b4f' : '#ffffff',
                    color: isMe ? '#ffffff' : '#2c2c2c',
                    border: isMe ? 'none' : '1px solid #e0d8cc',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}
                >
                  {msg.content}
                </div>
                <p className="text-xs mt-1 px-1" style={{ color: '#8a8a7a', textAlign: isMe ? 'right' : 'left' }}>
                  {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="px-8 py-4 border-t"
        style={{ background: '#ffffff', borderColor: '#e0d8cc' }}>
        <div className="flex items-end gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) } }}
            placeholder="Message Sophia…"
            rows={2}
            className="flex-1 resize-none px-4 py-2.5 rounded-xl text-sm border outline-none"
            style={{ borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }}
          />
          <button type="submit" disabled={!text.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity"
            style={{ background: '#3d6b4f', opacity: !text.trim() ? 0.5 : 1 }}>
            <Send size={16} />
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#8a8a7a' }}>
          Demo mode — messages are local only and won&apos;t send emails.
        </p>
      </form>
    </div>
  )
}
