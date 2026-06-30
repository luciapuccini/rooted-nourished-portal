'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { format } from 'date-fns'
import { Send, Users, Leaf } from 'lucide-react'

interface Thread {
  id: string
  content: string
  createdAt: string
  senderId: string
  recipientId: string
  sender: { name: string; role: string }
  recipient: { name: string; role: string }
}

interface Message {
  id: string
  content: string
  createdAt: string
  senderId: string
  sender: { name: string; role: string }
}

export default function CoachChatPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [activeClientId, setActiveClientId] = useState<string | null>(null)
  const [activeClientName, setActiveClientName] = useState('')
  const [text, setText] = useState('')
  const [myId, setMyId] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const loadThreads = useCallback(async () => {
    const [tRes, meRes] = await Promise.all([
      fetch('/api/messages'),
      fetch('/api/auth/me'),
    ])
    const { threads: t } = await tRes.json()
    const { user } = await meRes.json()
    if (t) setThreads(t)
    if (user) setMyId(user.userId)
  }, [])

  const loadMessages = useCallback(async (clientId: string) => {
    const res = await fetch(`/api/messages?with=${clientId}`)
    const { messages: msgs } = await res.json()
    if (msgs) setMessages(msgs)
  }, [])

  useEffect(() => { loadThreads() }, [loadThreads])

  useEffect(() => {
    if (!activeClientId) return
    loadMessages(activeClientId)
    const interval = setInterval(() => loadMessages(activeClientId), 8000)
    return () => clearInterval(interval)
  }, [activeClientId, loadMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function selectThread(thread: Thread) {
    const clientId = thread.senderId === myId ? thread.recipientId : thread.senderId
    const clientName = thread.senderId === myId ? thread.recipient.name : thread.sender.name
    setActiveClientId(clientId)
    setActiveClientName(clientName)
    loadMessages(clientId)
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !activeClientId) return
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, recipientId: activeClientId }),
    })
    setText('')
    setSending(false)
    loadMessages(activeClientId)
    loadThreads()
  }

  return (
    <div className="flex h-screen">
      <div className="w-72 border-r flex flex-col" style={{ background: '#ffffff', borderColor: '#e0d8cc' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#e0d8cc' }}>
          <div className="flex items-center gap-2">
            <Users size={16} color="#3d6b4f" />
            <h1 className="font-semibold text-sm" style={{ color: '#2c2c2c' }}>Client Messages</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <p className="text-sm text-center p-8" style={{ color: '#8a8a7a' }}>No messages yet</p>
          ) : (
            threads.map((t) => {
              const clientId = t.senderId === myId ? t.recipientId : t.senderId
              const clientName = t.senderId === myId ? t.recipient.name : t.sender.name
              const isActive = activeClientId === clientId
              return (
                <button key={t.id} onClick={() => selectThread(t)}
                  className="w-full text-left px-5 py-4 border-b transition-colors"
                  style={{
                    borderColor: '#e0d8cc',
                    background: isActive ? '#e8f0eb' : 'transparent',
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: '#c17a4a' }}>
                      {clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#2c2c2c' }}>{clientName}</p>
                      <p className="text-xs truncate mt-0.5" style={{ color: '#8a8a7a' }}>{t.content}</p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!activeClientId ? (
          <div className="flex-1 flex items-center justify-center" style={{ background: '#faf7f2' }}>
            <div className="text-center">
              <Leaf size={40} color="#e0d8cc" className="mx-auto mb-3" />
              <p className="font-medium" style={{ color: '#8a8a7a' }}>Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b" style={{ background: '#ffffff', borderColor: '#e0d8cc' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{ background: '#c17a4a' }}>
                  {activeClientName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#2c2c2c' }}>{activeClientName}</p>
                  <p className="text-xs" style={{ color: '#8a8a7a' }}>Client</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin"
              style={{ background: '#faf7f2' }}>
              {messages.map((msg) => {
                const isMe = msg.senderId === myId
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-sm">
                      {!isMe && (
                        <p className="text-xs mb-1 px-1" style={{ color: '#8a8a7a' }}>{msg.sender.name}</p>
                      )}
                      <div className="rounded-2xl px-4 py-3 text-sm"
                        style={{
                          background: isMe ? '#3d6b4f' : '#ffffff',
                          color: isMe ? '#ffffff' : '#2c2c2c',
                          border: isMe ? 'none' : '1px solid #e0d8cc',
                          borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        }}>
                        {msg.content}
                      </div>
                      <p className="text-xs mt-1 px-1"
                        style={{ color: '#8a8a7a', textAlign: isMe ? 'right' : 'left' }}>
                        {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="px-6 py-4 border-t"
              style={{ background: '#ffffff', borderColor: '#e0d8cc' }}>
              <div className="flex items-end gap-3">
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e) } }}
                  placeholder={`Message ${activeClientName}…`} rows={2}
                  className="flex-1 resize-none px-4 py-2.5 rounded-xl text-sm border outline-none"
                  style={{ borderColor: '#e0d8cc', background: '#faf7f2', color: '#2c2c2c' }} />
                <button type="submit" disabled={sending || !text.trim()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: '#3d6b4f', opacity: sending || !text.trim() ? 0.5 : 1 }}>
                  <Send size={16} />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
