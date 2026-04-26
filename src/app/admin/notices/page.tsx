import { createClient } from '@/lib/supabase/server'

export default async function AdminNoticesPage() {
  const supabase = await createClient()
  const { data: notices } = await supabase.from('notices').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Notices & Announcements</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Post news, alerts, and priority announcements.</p>
      </div>

      <div className="space-y-4">
        {notices?.map(notice => (
          <div key={notice.id} className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold dark:text-white">{notice.title}</h3>
              <span className={`text-[10px] font-black px-2 py-1 rounded ${
                notice.priority === 'high' ? 'bg-red-500 text-white' : 'bg-zinc-100 dark:bg-zinc-700'
              }`}>
                {notice.priority.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-zinc-500">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
