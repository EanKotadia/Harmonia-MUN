import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: schedule } = await supabase.from('schedule').select('*').order('day_date').order('time_start')

  return (
    <div className="min-h-screen bg-[#050a18] pt-32 pb-20 selection:bg-[#cba35c]/30">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cba35c]/30 bg-[#cba35c]/5 px-6 py-2.5 text-[10px] font-bold tracking-[0.3em] text-[#cba35c] uppercase">
            CONFERENCE ITINERARY
          </div>
          <h1 className="text-6xl font-black tracking-tight text-white mb-4 italic">EVENT <span className="text-[#cba35c]">SCHEDULE</span></h1>
          <p className="text-gray-500 font-medium tracking-widest text-xs uppercase">Your guide through the days of diplomatic excellence</p>
        </div>

        <div className="space-y-12">
          {schedule?.map((item) => (
            <div key={item.id} className="relative pl-12 border-l border-white/5 group">
              <div className="absolute -left-[6px] top-0 h-3 w-3 rounded-full bg-zinc-800 border-2 border-[#cba35c] transition-all group-hover:bg-[#cba35c]" />

              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[#cba35c] text-sm font-black tracking-[0.2em] uppercase italic">{item.day_label || 'DAY SESSION'}</span>
                    <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      <Clock size={12} className="text-[#cba35c]" />
                      {item.time_start} — {item.time_end}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin size={12} className="text-[#cba35c]" />
                    {item.venue}
                  </div>
                </div>

                <div className="relative group rounded-2xl border border-white/5 bg-white/5 p-8 transition-all hover:border-[#cba35c]/50">
                  <h3 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tight">{item.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.subtitle || 'Standard assembly procedures and platform discussions.'}</p>

                  {item.status === 'live' && (
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                       <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                       <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">LIVE</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(!schedule || schedule.length === 0) && (
            <div className="text-center py-24 rounded-3xl border border-dashed border-white/10">
              <Calendar className="mx-auto h-12 w-12 text-zinc-800 mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Schedule will be released soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
