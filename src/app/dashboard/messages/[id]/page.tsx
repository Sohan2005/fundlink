'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  recipient_id: string
  company_id: string
  company_name: string
  message_text: string
  is_read: boolean
  created_at: string
}

interface Conversation {
  id: string
  company_id: string
  company_name: string
}

export default function ConversationPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const conversationId = params?.id as string

  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/dashboard/messages')
      return
    }

    if (conversationId) {
      loadConversation()
      loadMessages()
    }
  }, [user, conversationId, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function loadConversation() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user?.id)
        .single()

      if (error) throw error

      setConversation(data as Conversation)
    } catch (err: any) {
      console.error('Error loading conversation:', err)
      setError('Conversation not found')
    }
  }

  async function loadMessages() {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages((data || []) as Message[])

      // Mark messages as read for this user
      if (data && data.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', conversationId)
          .eq('recipient_id', user?.id)
          .eq('is_read', false)

        await supabase
          .from('conversations')
          .update({ unread_count: 0 })
          .eq('id', conversationId)
      }

      setLoading(false)
    } catch (err: any) {
      console.error('Error loading messages:', err)
      setError(err.message || 'Failed to load messages')
      setLoading(false)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !conversation || sending) return

    try {
      setSending(true)
      setError(null)

      // Insert message
      const { data: inserted, error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          recipient_id: 'company_' + conversation.company_id, // simulated company recipient
          company_id: conversation.company_id,
          company_name: conversation.company_name,
          message_text: newMessage.trim(),
          is_read: false,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Update conversation metadata
      await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId)

      // ✅ Email notification to user about new message (if you want company replies to notify user, you’d trigger this on the company side instead)
      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'message_received',
            to: user?.email,
            userName:
              user?.user_metadata?.full_name ||
              (user?.email ? user.email.split('@')[0] : 'there'),
            companyName: conversation.company_name,
            messagePreview: newMessage.trim().slice(0, 120),
          }),
        })
        console.log('Message notification email sent')
      } catch (emailError) {
        console.error('Failed to send message notification email:', emailError)
      }

      // Update local state
      setMessages(prev => [...prev, inserted as Message])
      setNewMessage('')
      setSending(false)
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message')
      setSending(false)
    }
  }

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function formatTime(timestamp: string) {
    const date = new Date(timestamp)
    return date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  function formatDay(timestamp: string) {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-height-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto" />
              <p className="mt-4 text-gray-600">Loading conversation…</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !conversation) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-600">
            Conversation not found.{' '}
            <Link href="/dashboard/messages" className="text-blue-600 hover:underline">
              Back to messages
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-4 pb-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard/messages"
              className="text-gray-600 hover:text-black text-sm"
            >
              ← Back to Messages
            </Link>
            <h1 className="text-2xl font-semibold text-black mt-2">
              {conversation.company_name}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((message, idx) => {
              const isMine = message.sender_id === user.id
              const prev = messages[idx - 1]
              const showDay =
                !prev || formatDay(prev.created_at) !== formatDay(message.created_at)

              return (
                <div key={message.id}>
                  {showDay && (
                    <div className="text-center my-4">
                      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {formatDay(message.created_at)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMine ? 'bg-black text-white' : 'bg-gray-100 text-black'
                      }`}
                    >
                      <p className="text-sm">{message.message_text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isMine ? 'text-gray-300' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 pt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 placeholder:text-gray-400"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !newMessage.trim()}
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {sending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
