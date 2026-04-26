import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const CategoryManagement = dynamic(() => import('@/components/admin/categories/CategoryManagement'), {
  loading: () => <div className="p-8 text-center">Loading management...</div>,
  ssr: true
})

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Categories & Committees</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage MUN committees, cultural events, and their configurations.</p>
      </div>

      <CategoryManagement initialCategories={categories || []} />
    </div>
  )
}
