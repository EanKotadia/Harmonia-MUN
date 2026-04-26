'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Calendar, Clock, MapPin, Save, X, Pencil } from 'lucide-react'

interface ScheduleItem {
  id: number
  title: string
  subtitle?: string
  day_date: string
  day_label?: string
  time_start: string
  time_end: string
  venue: string
  status: string
}

export default function ScheduleManagement({ initialSchedule }: { initialSchedule: ScheduleItem[] }) {
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({})
  const supabase = createClient()

  function startEdit(item: ScheduleItem | null) {
    if (item) {
      setEditingId(item.id)
      setFormData(item)
    } else {
      setEditingId('new')
      setFormData({
        title: '',
        subtitle: '',
        day_date: new Date().toISOString().split('T')[0],
        day_label: 'Day 1',
        time_start: '09:00',
        time_end: '10:00',
        venue: 'Main Hall',
        status: 'upcoming'
      })
    }
  }

  async function stageEvent() {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('staged_changes').insert({
      table_name: 'schedule',
      record_id: editingId?.toString() || 'new',
      updates: formData as Record<string, any>,
      created_by: user?.id,
      created_by_email: user?.email,
      status: 'pending'
    })

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Schedule change submitted for approval')
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => startEdit(null)}
        className="flex items-center gap-2 bg-[#cba35c] text-black px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform"
      >
        <Plus className="h-4 w-4" /> Add Event
      </button>

      {editingId && (
        <div className="rounded-2xl border bg-white p-8 shadow-lg dark:bg-zinc-800 dark:border-zinc-700 space-y-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black dark:text-white uppercase tracking-widest text-sm">
              {editingId === 'new' ? 'Create New Event' : 'Modify Existing Event'}
            </h3>
            <button onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-zinc-600"><X size={20} /></button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Event Title</label>
              <input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white outline-none focus:ring-2 ring-[#cba35c]/20" placeholder="e.g. Opening Plenary Session" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Subtitle / Description</label>
              <input value={formData.subtitle || ''} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white outline-none" placeholder="Brief summary of the session..." />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Date</label>
              <input type="date" value={formData.day_date || ''} onChange={e => setFormData({...formData, day_date: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Venue</label>
              <input value={formData.venue || ''} onChange={e => setFormData({...formData, venue: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Start Time</label>
                <input type="time" value={formData.time_start || ''} onChange={e => setFormData({...formData, time_start: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">End Time</label>
                <input type="time" value={formData.time_end || ''} onChange={e => setFormData({...formData, time_end: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Status</label>
              <select value={formData.status || 'upcoming'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg dark:bg-zinc-900 dark:text-white">
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <button onClick={stageEvent} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <Save size={20} /> Submit Proposal for Approval
          </button>
        </div>
      )}

      <div className="space-y-4">
        {initialSchedule.map((item) => (
          <div key={item.id} className="group flex items-center gap-6 rounded-2xl border bg-white p-6 dark:bg-zinc-800 dark:border-zinc-700 hover:border-[#cba35c]/30 transition-all">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-black dark:text-white uppercase italic text-lg tracking-tight">{item.title}</h4>
                <button onClick={() => startEdit(item)} className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-blue-500 transition-all">
                  <Pencil size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">
                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#cba35c]" /> {item.day_date}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#cba35c]" /> {item.time_start} - {item.time_end}</span>
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#cba35c]" /> {item.venue}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                item.status === 'live' ? 'bg-red-500/10 border-red-500/30 text-red-500 animate-pulse' :
                item.status === 'completed' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                'bg-zinc-100 border-zinc-200 dark:bg-zinc-700 dark:border-zinc-600 dark:text-zinc-300'
              } uppercase tracking-widest`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
