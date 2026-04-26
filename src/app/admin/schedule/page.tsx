import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const ScheduleManagement = dynamic(() => import('@/components/admin/schedule/ScheduleManagement'), {
  loading: () => <div className="p-8 text-center">Loading schedule...</div>,
  ssr: true
})

export default async function AdminSchedulePage() {
  const supabase = await createClient()
  const { data: schedule } = await supabase.from('schedule').select('*').order('day_date').order('time_start')
  const { data: houses } = await supabase.from('houses').select('id, name')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Event Schedule</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage the timeline of MUN sessions, ceremonies, and events.</p>
      </div>

      <ScheduleManagement initialSchedule={schedule || []}  />
    </div>
  )
}
