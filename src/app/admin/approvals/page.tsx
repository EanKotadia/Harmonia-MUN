import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'

const ApprovalsList = dynamic(() => import('@/components/admin/ApprovalsList'), {
  loading: () => <div className="p-8 text-center text-zinc-500">Loading pending changes...</div>,
  ssr: true
})

export default async function ApprovalsPage() {
  const supabase = await createClient()
  const { data: changes } = await supabase
    .from('staged_changes')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">Pending Approvals</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Review and apply proposed changes to the live database.</p>
      </div>

      <ApprovalsList initialChanges={changes || []} />
    </div>
  )
}
