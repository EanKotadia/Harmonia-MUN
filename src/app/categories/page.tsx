import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Trophy, Music, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="min-h-screen bg-[#050a18] pt-32 pb-20 selection:bg-[#cba35c]/30">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cba35c]/30 bg-[#cba35c]/5 px-6 py-2.5 text-[10px] font-bold tracking-[0.3em] text-[#cba35c] uppercase">
            COUNCILS & COMMITTEES
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white mb-4 italic">Committees & <span className="text-[#cba35c]">Councils</span></h1>
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Select a platform to voice your diplomatic stance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.map((cat) => (
            <div key={cat.id} className="group relative rounded-3xl border border-white/5 bg-white/5 overflow-hidden transition-all hover:border-[#cba35c]/50">
              <div className="h-48 bg-zinc-900 relative">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                    {cat.category_type === 'sport' ? <Trophy size={48} className="text-[#cba35c]/10" /> : <Music size={48} className="text-[#cba35c]/10" />}
                  </div>
                )}
                <div className="absolute top-4 left-4 rounded-full bg-[#cba35c]/10 border border-[#cba35c]/30 px-3 py-1 text-[8px] font-black text-[#cba35c] uppercase tracking-[0.2em]">
                  {cat.category_type}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight italic">{cat.name}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                   <span className="text-[10px] font-bold bg-white/5 rounded px-2.5 py-1 text-gray-400 uppercase tracking-wider border border-white/5">Years {cat.eligible_years}</span>
                </div>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">{cat.special_rules || 'Participate in intense diplomatic debate and strategic resolution drafting in this committee.'}</p>
                <button className="group/btn relative w-full py-4 rounded-xl border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] overflow-hidden transition-all hover:border-[#cba35c] hover:text-[#cba35c]">
                   <span className="relative z-10 flex items-center justify-center gap-2">
                     VIEW AGENDAS <Sparkles size={12} />
                   </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
