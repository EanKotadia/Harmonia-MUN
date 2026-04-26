import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Award } from 'lucide-react'

export default async function HousesPage() {
  const supabase = await createClient()
  const { data: houses } = await supabase.from('houses').select('*').order('points', { ascending: false })

  return (
    <div className="min-h-screen bg-[#050a18] pt-32 pb-20 selection:bg-[#cba35c]/30">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cba35c]/30 bg-[#cba35c]/5 px-6 py-2.5 text-[10px] font-bold tracking-[0.3em] text-[#cba35c] uppercase">
            CHAMPIONSHIP STANDINGS
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white mb-4 italic">HOUSE <span className="text-[#cba35c]">RANKINGS</span></h1>
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Live updates from the floor of the general assembly</p>
        </div>

        <div className="space-y-4">
          {houses?.map((house, index) => (
            <div key={house.id} className="group relative flex items-center gap-6 rounded-2xl border border-white/5 bg-white/5 p-8 transition-all hover:border-[#cba35c]/50">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ backgroundColor: house.color }} />

              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/5 text-2xl font-black text-white group-hover:bg-[#cba35c] group-hover:text-black transition-all">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black tracking-tight text-white uppercase italic">{house.name}</h3>
                  {index === 0 && <Award size={20} className="text-[#cba35c]" />}
                </div>
                <p className="mt-1 text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">{house.mascot_name || 'VALIANT DIPLOMATS'}</p>
              </div>

              <div className="text-right">
                <p className="text-4xl font-black tracking-tighter text-white group-hover:text-[#cba35c] transition-colors">{house.points}</p>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">CREDITS</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
