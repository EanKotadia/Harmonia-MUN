import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Trophy } from 'lucide-react'

export default async function ResultsPage() {
  const supabase = await createClient()
  const [{ data: matches }, { data: cultural }] = await Promise.all([
    supabase.from('matches').select('*, team1:houses!team1_id(name, color), team2:houses!team2_id(name, color), winner:houses!winner_id(name)').eq('status', 'completed').order('match_time', { ascending: false }),
    supabase.from('cultural_results').select('*, categories(name), houses(name)').order('created_at', { ascending: false })
  ])

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-20">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Live <span className="text-[#cba35c]">Results</span></h1>
          <p className="text-gray-400">Celebrating victories and excellence across all events.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sports Results */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Trophy className="text-[#cba35c]" /> Sports Matches
            </h2>
            <div className="space-y-4">
              {matches?.map(match => (
                <div key={match.id} className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <p className="text-xs font-bold text-gray-500 mb-1">{match.team1?.name}</p>
                      <p className="text-3xl font-black text-white">{match.score1}</p>
                    </div>
                    <div className="text-gray-600 font-bold italic">VS</div>
                    <div className="flex-1 text-center">
                      <p className="text-xs font-bold text-gray-500 mb-1">{match.team2?.name}</p>
                      <p className="text-3xl font-black text-white">{match.score2}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Winner: <span className="text-[#cba35c]">{match.winner?.name || 'Draw'}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cultural Results */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Trophy className="text-[#cba35c]" /> Cultural Events
            </h2>
            <div className="space-y-4">
              {cultural?.map(res => (
                <div key={res.id} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#cba35c] uppercase mb-1">{res.categories?.name}</p>
                    <h3 className="text-lg font-bold text-white">{res.houses?.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">Rank #{res.rank}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase">{res.points} Points</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
