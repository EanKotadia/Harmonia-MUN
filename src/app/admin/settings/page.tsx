import { createClient } from '@/lib/supabase/server'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('settings').select('*')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">System Settings</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Global configuration for the Harmonia MUN portal.</p>
      </div>

      <div className="rounded-xl border bg-white p-8 dark:bg-zinc-800 dark:border-zinc-700">
        <p className="text-zinc-500 text-sm text-center italic">Settings module under development.</p>
      </div>
    </div>
  )
}
