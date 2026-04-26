'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Calendar, Clock, MapPin } from 'lucide-react'

interface ScheduleItem {
  id: number
  title: string
  day_date: string
  time_start: string
  time_end: string
  venue: string
  status: string
}

export default function ScheduleManagement({ initialSchedule }: { initialSchedule: ScheduleItem[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    title: '',
    day_date: '',
    time_start: '',
    time_end: '',
    venue: '',
    status: 'upcoming'
  })
  const supabase = createClient()

  async function stageNewEvent() {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('staged_changes').insert({
      table_name: 'schedule',
      record_id: 'new',
      updates: formData as Record<string, unknown>,
      created_by: user?.id,
      created_by_email: user?.email,
      status: 'pending'
    })

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('New event submitted for approval')
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 bg-zinc-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-zinc-900 transition-colors dark:bg-white dark:text-black"
      >
        <Plus className="h-4 w-4" /> Add Event
      </button>

      {isAdding && (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700 space-y-4">
          <h3 className="font-bold dark:text-white uppercase tracking-wider">New Schedule Item</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input placeholder="Event Title" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
            <input placeholder="Venue" value={formData.venue || ''} onChange={e => setFormData({...formData, venue: e.target.value})} className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
            <input type="date" value={formData.day_date || ''} onChange={e => setFormData({...formData, day_date: e.target.value})} className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
            <div className="flex gap-2">
              <input type="time" value={formData.time_start || ''} onChange={e => setFormData({...formData, time_start: e.target.value})} className="flex-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
              <input type="time" value={formData.time_end || ''} onChange={e => setFormData({...formData, time_end: e.target.value})} className="flex-1 p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={stageNewEvent} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Submit for Approval</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 border rounded-lg dark:text-white">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {initialSchedule.map((item) => (
          <div key={item.id} className="flex items-center gap-6 rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex-1">
              <h4 className="font-black dark:text-white uppercase italic">{item.title}</h4>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar size={12} /> {item.day_date}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {item.time_start} - {item.time_end}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {item.venue}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-black px-2 py-1 rounded ${
                item.status === 'live' ? 'bg-red-500 text-white' : 'bg-zinc-100 dark:bg-zinc-700'
              }`}>
                {item.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
