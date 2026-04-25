import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Calendar, MapPin, Clock } from 'lucide-react'

export default async function SchedulePage() {
  const supabase = await createClient()
  const { data: schedule } = await supabase.from('schedule').select('*').order('day_date').order('time_start')

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-20">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Conference <span className="text-[#cba35c]">Itinerary</span></h1>
          <p className="text-gray-400">Plan your journey through the days of diplomatic excellence.</p>
        </div>

        <div className="space-y-12">
          {schedule?.map((item) => (
            <div key={item.id} className="relative pl-8 border-l border-white/10 group">
              <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-[#cba35c] shadow-[0_0_10px_rgba(203,163,92,0.5)] transition-transform group-hover:scale-150" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                  <span className="text-[#cba35c] font-black tracking-tighter uppercase">{item.day_label}</span>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={14} />
                    {item.time_start} - {item.time_end}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin size={14} />
                  {item.venue}
                </div>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.subtitle || 'General assembly and discussion phase.'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
