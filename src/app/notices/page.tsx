import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { Bell, Clock } from 'lucide-react'

export default async function NoticesPage() {
  const supabase = await createClient()
  const { data: notices } = await supabase.from('notices').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-20">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Official <span className="text-[#cba35c]">Notices</span></h1>
          <p className="text-gray-400">Stay updated with the latest conference announcements.</p>
        </div>

        <div className="space-y-6">
          {notices?.map((notice) => (
            <div key={notice.id} className="glass-card p-8 rounded-3xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-1 ${
                notice.priority === 'high' ? 'bg-red-500' : notice.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
              }`} />
              <div className="flex items-center gap-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-[#cba35c]">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{notice.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} />
                    {new Date(notice.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">{notice.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
