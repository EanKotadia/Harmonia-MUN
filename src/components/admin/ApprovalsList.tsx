'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Check, X, Clock, User, Database, AlertCircle } from 'lucide-react'

interface StagedChange {
  id: string
  table_name: string
  record_id: string
  updates: Record<string, any>
  created_by_email: string
  created_at: string
}

export default function ApprovalsList({ initialChanges }: { initialChanges: StagedChange[] }) {
  const [changes, setChanges] = useState(initialChanges)
  const supabase = createClient()

  async function handleApproval(change: StagedChange, approve: boolean) {
    try {
      if (approve) {
        if (change.record_id === 'new') {
          // Perform insert
          const { error: insertError } = await supabase
            .from(change.table_name)
            .insert([change.updates])

          if (insertError) throw insertError
        } else {
          // Perform update
          const { error: updateError } = await supabase
            .from(change.table_name)
            .update(change.updates)
            .eq('id', change.record_id)

          if (updateError) throw updateError
        }
      }

      // Update staged_change status
      const { error: statusError } = await supabase
        .from('staged_changes')
        .update({ status: approve ? 'approved' : 'discarded' })
        .eq('id', change.id)

      if (statusError) throw statusError

      setChanges(changes.filter(c => c.id !== change.id))
      alert(approve ? 'Changes applied successfully' : 'Changes discarded')
    } catch (error: any) {
      alert('Error processing approval: ' + error.message)
    }
  }

  if (changes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
        <Check className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
        <h3 className="mt-4 text-lg font-medium dark:text-white">All caught up!</h3>
        <p className="text-zinc-500">No pending changes require your attention.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {changes.map(change => (
        <div key={change.id} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {change.record_id === 'new' ? (
                  <AlertCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Database className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                  {change.record_id === 'new' ? 'New Record' : 'Update Record'} in {change.table_name}
                  {change.record_id !== 'new' && ` (#${change.record_id})`}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" /> {change.created_by_email}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {new Date(change.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApproval(change, true)}
                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors dark:bg-green-900/20"
                title="Approve and Apply"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleApproval(change, false)}
                className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors dark:bg-red-900/20"
                title="Discard"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-zinc-50 p-4 font-mono text-xs dark:bg-zinc-900 dark:text-zinc-300">
            {JSON.stringify(change.updates, null, 2)}
          </div>
        </div>
      ))}
    </div>
  )
}
