import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const MatchManagement = dynamic(() => import('@/components/admin/matches/MatchManagement'), {
  loading: () => <div className="p-8 text-center">Loading matches...</div>,
  ssr: true
})

export default async function AdminMatchesPage() {
  const supabase = await createClient()
  const { data: matches } = await supabase
    .from('matches')
    .select('*, categories(name), team1:houses!team1_id(name, color), team2:houses!team2_id(name, color)')
    .order('created_at', { ascending: false })

  const { data: houses } = await supabase.from('houses').select('id, name')
  const { data: categories } = await supabase.from('categories').select('id, name')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Match Scoring</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Record scores and winners for MUN debate matches or sports events.</p>
      </div>

      <MatchManagement
        initialMatches={matches || []}
      />
    </div>
  )
}
