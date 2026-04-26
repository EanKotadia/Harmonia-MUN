'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Save } from 'lucide-react'

interface House {
  id: string
  name: string
  color: string
  points: number
  mascot_name: string
}

export default function HouseManagement({ initialHouses }: { initialHouses: House[] }) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<House>>({})
  const supabase = createClient()

  async function stageChange(houseId: string, updates: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('staged_changes').insert({
      table_name: 'houses',
      record_id: houseId,
      updates: updates,
      created_by: user?.id,
      created_by_email: user?.email,
      status: 'pending'
    })

    if (error) {
      alert('Error staging change: ' + error.message)
    } else {
      alert('Change submitted for approval')
      setIsEditing(null)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        {initialHouses.map(house => (
          <div key={house.id} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: house.color }} />
                <h3 className="text-lg font-bold dark:text-white uppercase">{house.name}</h3>
              </div>
              <button
                onClick={() => {
                  setIsEditing(house.id)
                  setFormData(house)
                }}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <Pencil className="h-4 w-4 text-zinc-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-zinc-500">Points</p>
                <p className="text-2xl font-black dark:text-white">{house.points}</p>
              </div>
              <div>
                <p className="text-zinc-500">Mascot</p>
                <p className="font-bold dark:text-white">{house.mascot_name || 'N/A'}</p>
              </div>
            </div>

            {isEditing === house.id && (
              <div className="mt-6 pt-6 border-t dark:border-zinc-700 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500">Update Points</label>
                  <input
                    type="number"
                    value={formData.points || 0}
                    onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                    className="w-full mt-1 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => stageChange(house.id, { points: formData.points })}
                    className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Submit for Approval
                  </button>
                  <button
                    onClick={() => setIsEditing(null)}
                    className="px-4 py-2 border dark:border-zinc-700 rounded-lg dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700"
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
