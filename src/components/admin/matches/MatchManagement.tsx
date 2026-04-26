'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Match {
  id: number
  status: string
  score1: number
  score2: number
  team1: { name: string; color: string }
  team2: { name: string; color: string }
  categories: { name: string }
}

export default function MatchManagement({ initialMatches }: { initialMatches: Match[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Match>>({})
  const supabase = createClient()

  async function stageChange(id: number, updates: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('staged_changes').insert({
      table_name: 'matches',
      record_id: id.toString(),
      updates: updates,
      created_by: user?.id,
      created_by_email: user?.email,
      status: 'pending'
    })

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Submitted for approval')
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {initialMatches.map((match) => (
          <div key={match.id} className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded dark:text-zinc-300 uppercase tracking-widest">
                {match.categories?.name}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                match.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-300'
              }`}>
                {match.status}
              </span>
            </div>

            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center space-y-2">
                <div className="h-2 w-full rounded" style={{ backgroundColor: match.team1?.color }} />
                <p className="font-black dark:text-white uppercase text-sm">{match.team1?.name}</p>
                <p className="text-4xl font-black dark:text-white">{match.score1}</p>
              </div>
              <div className="text-zinc-300 font-black italic">VS</div>
              <div className="text-center space-y-2">
                <div className="h-2 w-full rounded" style={{ backgroundColor: match.team2?.color }} />
                <p className="font-black dark:text-white uppercase text-sm">{match.team2?.name}</p>
                <p className="text-4xl font-black dark:text-white">{match.score2}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-zinc-700 flex justify-end">
              <button
                onClick={() => {
                  setEditingId(match.id)
                  setFormData(match)
                }}
                className="text-sm font-bold text-blue-600 dark:text-blue-400"
              >
                Update Result
              </button>
            </div>

            {editingId === match.id && (
              <div className="mt-6 space-y-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">{match.team1?.name} Score</label>
                    <input type="number" value={formData.score1 || 0} onChange={e => setFormData({...formData, score1: parseInt(e.target.value)})} className="w-full mt-1 p-2 border dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 dark:text-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">{match.team2?.name} Score</label>
                    <input type="number" value={formData.score2 || 0} onChange={e => setFormData({...formData, score2: parseInt(e.target.value)})} className="w-full mt-1 p-2 border dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
                  <select value={formData.status || 'upcoming'} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full mt-1 p-2 border dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 dark:text-white">
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button onClick={() => stageChange(match.id, { score1: formData.score1, score2: formData.score2, status: formData.status })} className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition-colors">Submit Update</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
