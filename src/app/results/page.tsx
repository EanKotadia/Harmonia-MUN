import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Trophy, Star } from 'lucide-react'

export default async function ResultsPage() {
  const supabase = await createClient()
  const [{ data: matches }, { data: cultural }] = await Promise.all([
    supabase.from('matches').select('*, team1:houses!team1_id(name, color), team2:houses!team2_id(name, color), winner:houses!winner_id(name)').eq('status', 'completed').order('match_time', { ascending: false }),
    supabase.from('cultural_results').select('*, categories(name), houses(name)').order('created_at', { ascending: false })
  ])

  return (
    <div className="min-h-screen bg-[#050a18] pt-32 pb-20 selection:bg-[#cba35c]/30">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cba35c]/30 bg-[#cba35c]/5 px-6 py-2.5 text-[10px] font-bold tracking-[0.3em] text-[#cba35c] uppercase">
            LIVE SCOREBOARD
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white mb-4 italic">EVENT <span className="text-[#cba35c]">RESULTS</span></h1>
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Celebrating diplomatic and athletic excellence</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Sports Results */}
          <section>
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-wider italic">
              <Trophy className="text-[#cba35c]" size={20} /> Match Outcomes
            </h2>
            <div className="space-y-4">
              {matches?.map(match => (
                <div key={match.id} className="relative group rounded-2xl border border-white/5 bg-white/5 p-8 transition-all hover:border-[#cba35c]/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{match.team1?.name}</p>
                      <p className="text-4xl font-black text-white">{match.score1}</p>
                    </div>
                    <div className="text-zinc-700 font-black italic text-xl">VS</div>
                    <div className="flex-1 text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{match.team2?.name}</p>
                      <p className="text-4xl font-black text-white">{match.score2}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">
                      VICTOR: <span className="text-[#cba35c]">{match.winner?.name || 'DRAW / PENDING'}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cultural Results */}
          <section>
            <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-wider italic">
              <Star className="text-[#cba35c]" size={20} /> Cultural Standings
            </h2>
            <div className="space-y-4">
              {cultural?.map(res => (
                <div key={res.id} className="group relative rounded-2xl border border-white/5 bg-white/5 p-6 flex items-center justify-between transition-all hover:border-[#cba35c]/50">
                  <div>
                    <p className="text-[10px] font-black text-[#cba35c] uppercase tracking-widest mb-1">{res.categories?.name}</p>
                    <h3 className="text-xl font-black text-white uppercase italic">{res.houses?.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">#{res.rank}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{res.points} PTS</p>
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
