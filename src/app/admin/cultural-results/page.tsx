import { createClient } from '@/lib/supabase/server'

export default async function AdminCulturalResultsPage() {
  const supabase = await createClient()
  const { data: results } = await supabase
    .from('cultural_results')
    .select('*, categories(name), houses(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Cultural Results</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Review and record outcomes for cultural and non-sporting events.</p>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden dark:bg-zinc-800 dark:border-zinc-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Event</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">House</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Rank</th>
              <th className="px-6 py-4 font-bold uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-zinc-700">
            {results?.map(res => (
              <tr key={res.id} className="dark:text-zinc-300">
                <td className="px-6 py-4">{res.categories?.name}</td>
                <td className="px-6 py-4 uppercase font-bold">{res.houses?.name}</td>
                <td className="px-6 py-4">{res.rank}</td>
                <td className="px-6 py-4 font-black">{res.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
