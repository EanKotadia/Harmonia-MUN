import { createClient } from '@/lib/supabase/server'

export default async function AdminRegistrationsPage() {
  const supabase = await createClient()
  const { data: regs } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Event Registrations</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">View students registered for specific committees or events.</p>
      </div>

      <div className="space-y-2">
        {regs?.map(reg => (
          <div key={reg.id} className="rounded-xl border bg-white p-4 dark:bg-zinc-800 dark:border-zinc-700 flex items-center justify-between">
            <div>
              <p className="font-bold dark:text-white">{reg.student_name}</p>
              <p className="text-xs text-zinc-500">{reg.student_class}-{reg.student_section} • {reg.event_name}</p>
            </div>
            {reg.file_url && (
              <a href={reg.file_url} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">View Document</a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
