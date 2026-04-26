import { createClient } from '@/lib/supabase/server'
import { Trophy, Users, Calendar, CheckSquare } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: housesCount } = await supabase.from('houses').select('*', { count: 'exact', head: true })
  const { count: pendingApprovals } = await supabase.from('staged_changes').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  const { count: matchesCount } = await supabase.from('matches').select('*', { count: 'exact', head: true })
  const { count: scheduleCount } = await supabase.from('schedule').select('*', { count: 'exact', head: true })

  const stats = [
    { label: 'Houses', value: housesCount || 0, icon: Users, href: '/admin/houses', color: 'bg-blue-500' },
    { label: 'Matches', value: matchesCount || 0, icon: Trophy, href: '/admin/matches', color: 'bg-amber-500' },
    { label: 'Schedule Events', value: scheduleCount || 0, icon: Calendar, href: '/admin/schedule', color: 'bg-green-500' },
    { label: 'Pending Approvals', value: pendingApprovals || 0, icon: CheckSquare, href: '/admin/approvals', color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Dashboard</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Overview of Harmonia MUN management.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800 dark:border-zinc-700">
              <div className={`rounded-lg p-3 ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-8 dark:bg-zinc-800 dark:border-zinc-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/matches" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Record Match Result</Link>
          <Link href="/admin/notices" className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-900 transition-colors dark:bg-white dark:text-black">Post New Notice</Link>
          <Link href="/admin/schedule" className="px-4 py-2 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:hover:bg-zinc-700 dark:text-white">Update Schedule</Link>
        </div>
      </div>
    </div>
  )
}
