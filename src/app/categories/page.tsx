import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Trophy, Music } from 'lucide-react'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-20">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Committees & <span className="text-[#cba35c]">Councils</span></h1>
          <p className="text-gray-400">Explore the different agendas and debate themes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories?.map((cat) => (
            <div key={cat.id} className="glass-card rounded-3xl overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="h-48 bg-blue-900/10 relative">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {cat.category_type === 'sport' ? <Trophy size={48} className="text-[#cba35c]/20" /> : <Music size={48} className="text-[#cba35c]/20" />}
                  </div>
                )}
                <div className="absolute top-4 left-4 rounded-full bg-[#cba35c] px-3 py-1 text-[10px] font-bold text-[#0a0f1d] uppercase tracking-wider">
                  {cat.category_type}
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] border border-white/10 rounded px-2 py-0.5 text-gray-400 uppercase">{cat.gender}</span>
                  <span className="text-[10px] border border-white/10 rounded px-2 py-0.5 text-gray-400 uppercase">Years {cat.eligible_years}</span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6">{cat.special_rules || 'Join the debate and influence global policy in this prestigious committee.'}</p>
                <button className="w-full py-3 rounded-xl border border-[#cba35c]/30 text-[#cba35c] font-bold text-sm hover:bg-[#cba35c] hover:text-[#0a0f1d] transition-all">
                  View Agendas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
