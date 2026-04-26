import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/lib/supabase/server'
import { ImageIcon, Video } from 'lucide-react'

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-20">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Event <span className="text-[#cba35c]">Gallery</span></h1>
          <p className="text-gray-400">Capturing the moments that define our conference.</p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {items?.map((item) => (
            <div key={item.id} className="relative group break-inside-avoid rounded-2xl overflow-hidden glass-card">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-blue-900/10">
                  <Video size={48} className="text-[#cba35c]/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div>
                  <h3 className="text-white font-bold">{item.title}</h3>
                  <p className="text-gray-400 text-xs">{item.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
