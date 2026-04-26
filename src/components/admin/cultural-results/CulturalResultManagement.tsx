'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Trash2, Trophy, Star } from 'lucide-react'

interface CulturalResult {
  id: number
  category_id: string
  house_id: string
  rank: number
  points: number
  categories: { name: string }
  houses: { name: string }
}

export default function CulturalResultManagement({
  initialResults,
  houses,
  categories
}: {
  initialResults: CulturalResult[],
  houses: { id: string, name: string }[],
  categories: { id: string, name: string }[]
}) {
  const [results, setResults] = useState(initialResults)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    category_id: '',
    house_id: '',
    rank: 1,
    points: 0
  })
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('cultural_results')
      .insert([formData])
      .select('*, categories(name), houses(name)')

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setResults([data[0], ...results])
      setIsAdding(false)
      setFormData({ category_id: '', house_id: '', rank: 1, points: 0 })
    }
  }

  async function deleteResult(id: number) {
    if (!confirm('Delete this result?')) return
    const { error } = await supabase.from('cultural_results').delete().eq('id', id)
    if (error) alert(error.message)
    else setResults(results.filter(r => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => setIsAdding(true)}
        className="flex items-center gap-2 bg-[#cba35c] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b89250] transition-colors"
      >
        <Plus size={18} /> Record New Result
      </button>

      {isAdding && (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Category / Event</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-[#cba35c]/20 dark:text-white"
                >
                  <option value="">Select Category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">House</label>
                <select
                  required
                  value={formData.house_id}
                  onChange={e => setFormData({...formData, house_id: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-[#cba35c]/20 dark:text-white"
                >
                  <option value="">Select House...</option>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Rank</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.rank}
                  onChange={e => setFormData({...formData, rank: parseInt(e.target.value)})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-[#cba35c]/20 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Points Awarded</label>
                <input
                  type="number"
                  required
                  value={formData.points}
                  onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-4 py-2 outline-none focus:ring-2 ring-[#cba35c]/20 dark:text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Save Result</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 border dark:border-zinc-700 rounded-lg dark:text-white">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-xl border bg-white overflow-hidden dark:bg-zinc-800 dark:border-zinc-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">House</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Points</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {results.map(res => (
              <tr key={res.id} className="dark:text-zinc-300 group">
                <td className="px-6 py-4">{res.categories?.name}</td>
                <td className="px-6 py-4 uppercase font-bold">{res.houses?.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {res.rank === 1 && <Trophy size={14} className="text-amber-500" />}
                    {res.rank}
                  </div>
                </td>
                <td className="px-6 py-4 font-black">{res.points}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteResult(res.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
