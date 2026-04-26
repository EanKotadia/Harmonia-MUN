import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const CulturalResultManagement = dynamic(() => import('@/components/admin/cultural-results/CulturalResultManagement'), {
  loading: () => <div className="p-8 text-center text-zinc-500">Loading results...</div>,
  ssr: true
})

export default async function AdminCulturalResultsPage() {
  const supabase = await createClient()
  const { data: results } = await supabase
    .from('cultural_results')
    .select('*, categories(name), houses(name)')
    .order('created_at', { ascending: false })

  const { data: houses } = await supabase.from('houses').select('id, name')
  const { data: categories } = await supabase.from('categories').select('id, name')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Cultural Results</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Review and record outcomes for cultural and non-sporting events.</p>
      </div>

      <CulturalResultManagement
        initialResults={results || []}
        houses={houses || []}
        categories={categories || []}
      />
    </div>
  )
}
