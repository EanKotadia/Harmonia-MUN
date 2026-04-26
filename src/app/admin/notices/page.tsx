'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell, Plus, Trash2, X } from 'lucide-react'

interface Notice {
  id: number
  title: string
  content: string
  priority: 'low' | 'medium' | 'high'
  created_at: string
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  })
  const supabase = createClient()

  useEffect(() => {
    fetchNotices()
  }, [])

  async function fetchNotices() {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false })
    if (data) setNotices(data)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('notices').insert([formData])

    if (error) {
      alert('Error posting notice: ' + error.message)
    } else {
      setIsAdding(false)
      setFormData({ title: '', content: '', priority: 'medium' })
      fetchNotices()
    }
  }

  async function deleteNotice(id: number) {
    if (!confirm('Are you sure you want to delete this notice?')) return
    const { error } = await supabase.from('notices').delete().eq('id', id)
    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      fetchNotices()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Notices & Announcements</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Post news, alerts, and priority announcements.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-zinc-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-zinc-900 transition-colors dark:bg-white dark:text-black"
        >
          <Plus size={18} /> Post Notice
        </button>
      </div>

      {isAdding && (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                  placeholder="e.g. Schedule Change for G20"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Content</label>
                <textarea
                  required
                  rows={4}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                  placeholder="Details of the announcement..."
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as any})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Publish Notice</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 border dark:border-zinc-700 rounded-lg dark:text-white">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {notices.map(notice => (
          <div key={notice.id} className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:border-zinc-700 group relative">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  notice.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                  notice.priority === 'medium' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-500/10 text-zinc-500'
                }`}>
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">{notice.title}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {new Date(notice.created_at).toLocaleString()} • {notice.priority} priority
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteNotice(notice.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">{notice.content}</p>
          </div>
        ))}
        {notices.length === 0 && (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed dark:border-zinc-800">
            <Bell className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
            <p className="text-zinc-500 text-sm">No active notices.</p>
          </div>
        )}
      </div>
    </div>
  )
}
