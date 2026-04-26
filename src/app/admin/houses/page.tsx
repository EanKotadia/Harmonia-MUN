import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const HouseManagement = dynamic(() => import('@/components/admin/houses/HouseManagement'), {
  loading: () => <div className="p-8 text-center">Loading management...</div>,
  ssr: true
})

export default async function AdminHousesPage() {
  const supabase = await createClient()
  const { data: houses } = await supabase.from('houses').select('*').order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">House Management</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage the four houses, their points, and visual identity.</p>
        </div>
      </div>

      <HouseManagement initialHouses={houses || []} />
    </div>
  )
}
