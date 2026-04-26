import { createClient } from '@/lib/supabase/server'

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Media Gallery</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Upload and manage images and videos from the event.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items?.map(item => (
          <div key={item.id} className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative group">
            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <p className="text-white text-xs font-bold text-center uppercase">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
