'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Layers, Globe } from 'lucide-react'

interface Category {
  id: string
  name: string
  category_type: string
  is_active: boolean
  eligible_years: string
}

export default function CategoryManagement({ initialCategories }: { initialCategories: Category[] }) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({})
  const supabase = createClient()

  async function stageChange(id: string, updates: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('staged_changes').insert({
      table_name: 'categories',
      record_id: id,
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
    <div className="grid gap-4">
      {initialCategories.map(cat => (
        <div key={cat.id} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
                {cat.category_type === 'sport' ? <Layers className="h-5 w-5 text-blue-500" /> : <Globe className="h-5 w-5 text-amber-500" />}
              </div>
              <div>
                <h3 className="text-lg font-bold dark:text-white">{cat.name}</h3>
                <p className="text-xs text-zinc-500 font-mono">{cat.category_type} • {cat.eligible_years}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsEditing(cat.id)
                setFormData(cat)
              }}
              className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
            >
              Edit Config
            </button>
          </div>

          {isEditing === cat.id && (
            <div className="mt-6 pt-6 border-t dark:border-zinc-700 grid gap-4">
               <div>
                <label className="text-xs font-bold uppercase text-zinc-500">Eligibility (e.g. Years 9-12)</label>
                <input
                  type="text"
                  value={formData.eligible_years || ''}
                  onChange={e => setFormData({...formData, eligible_years: e.target.value})}
                  className="w-full mt-1 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => stageChange(cat.id, { eligible_years: formData.eligible_years })}
                  className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Stage Updates
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
  )
}
