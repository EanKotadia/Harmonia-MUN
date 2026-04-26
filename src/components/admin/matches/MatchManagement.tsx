'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Save, X } from 'lucide-react'

interface Match {
  id: number
  status: string
  score1: number
  score2: number
  team1_id: string
  team2_id: string
  winner_id: string | null
  team1: { name: string; color: string }
  team2: { name: string; color: string }
  categories: { name: string }
}

export default function MatchManagement({ initialMatches }: { initialMatches: Match[] }) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Match>>({})
  const supabase = createClient()

  async function stageChange(id: number, updates: Record<string, any>) {
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
      alert('Result update submitted for approval')
      setEditingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {initialMatches.map((match) => (
          <div key={match.id} className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:border-zinc-700 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-700 rounded dark:text-zinc-300 uppercase tracking-widest">
                {match.categories?.name}
              </span>
              <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter ${
                match.status === 'live' ? 'bg-red-500 text-white animate-pulse' :
                match.status === 'completed' ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-300'
              }`}>
                {match.status}
              </span>
            </div>

            <div className="flex items-center justify-center gap-8 py-6">
              <div className="text-center space-y-2 flex-1">
                <div className="h-1.5 w-full rounded" style={{ backgroundColor: match.team1?.color }} />
                <p className="font-black dark:text-white uppercase text-xs truncate">{match.team1?.name}</p>
                <p className="text-5xl font-black dark:text-white">{match.score1}</p>
              </div>
              <div className="text-zinc-300 font-black italic text-xl">VS</div>
              <div className="text-center space-y-2 flex-1">
                <div className="h-1.5 w-full rounded" style={{ backgroundColor: match.team2?.color }} />
                <p className="font-black dark:text-white uppercase text-xs truncate">{match.team2?.name}</p>
                <p className="text-5xl font-black dark:text-white">{match.score2}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t dark:border-zinc-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {match.winner_id && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 uppercase">
                    <Trophy size={14} /> Winner Recorded
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setEditingId(match.id)
                  setFormData(match)
                }}
                className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Update Scores
              </button>
            </div>

            {editingId === match.id && (
              <div className="mt-6 space-y-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border dark:border-zinc-700">
                <div className="grid grid-cols-2 gap-6">
                   <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">{match.team1?.name} Score</label>
                    <input type="number" value={formData.score1 || 0} onChange={e => setFormData({...formData, score1: parseInt(e.target.value)})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 dark:text-white outline-none focus:ring-2 ring-blue-500/20" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">{match.team2?.name} Score</label>
                    <input type="number" value={formData.score2 || 0} onChange={e => setFormData({...formData, score2: parseInt(e.target.value)})} className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 dark:text-white outline-none focus:ring-2 ring-blue-500/20" />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">Winner</label>
                    <select
                      value={formData.winner_id || ''}
                      onChange={e => setFormData({...formData, winner_id: e.target.value || null})}
                      className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="">Draw / No Winner</option>
                      <option value={match.team1_id}>{match.team1?.name}</option>
                      <option value={match.team2_id}>{match.team2?.name}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase">Match Status</label>
                    <select
                      value={formData.status || 'upcoming'}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full mt-1 p-3 border dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 dark:text-white"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => stageChange(match.id, {
                      score1: formData.score1,
                      score2: formData.score2,
                      status: formData.status,
                      winner_id: formData.winner_id
                    })}
                    className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={18} /> Submit Update
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-6 py-3 border dark:border-zinc-700 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
