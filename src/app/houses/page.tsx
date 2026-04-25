import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Trophy } from 'lucide-react'

export default async function HousesPage() {
  const supabase = await createClient()
  const { data: houses } = await supabase.from('houses').select('*').order('points', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-20">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">House <span className="text-[#cba35c]">Leaderboard</span></h1>
          <p className="text-gray-400">Tracking excellence across all committees and sports.</p>
        </div>

        <div className="grid gap-6">
          {houses?.map((house, index) => (
            <div key={house.id} className="glass-card p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: house.color }} />
              <div className="text-4xl font-black text-white/10 w-12 text-center group-hover:text-[#cba35c]/20 transition-colors">
                #{index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{house.name}</h3>
                <p className="text-[#cba35c] text-sm font-medium">{house.mascot_name || 'House of Excellence'}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-white">{house.points}</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Points</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
