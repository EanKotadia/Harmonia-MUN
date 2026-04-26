'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Settings, Save, RefreshCcw, ShieldCheck, Globe } from 'lucide-react'

interface Setting {
  key_name: string
  val: string
  created_at: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const { data } = await supabase.from('settings').select('*')
    if (data) setSettings(data)
  }

  async function updatePoints() {
    setLoading(true)
    const { error } = await supabase.rpc('recompute_points')
    if (error) {
      alert('Error recomputing points: ' + error.message)
    } else {
      alert('Points recomputed based on all match results and cultural standings.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight dark:text-white">System Settings</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Global configuration and maintenance for the Harmonia MUN portal.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-8 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCcw className="text-blue-500" />
            <h3 className="text-lg font-bold dark:text-white uppercase tracking-wider">Database Maintenance</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-6">
            Force a full recalculation of house points by processing all completed matches and cultural event results.
          </p>
          <button
            disabled={loading}
            onClick={updatePoints}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Recompute House Standings'}
          </button>
        </div>

        <div className="rounded-xl border bg-white p-8 dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-green-500" />
            <h3 className="text-lg font-bold dark:text-white uppercase tracking-wider">Admin Security</h3>
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            Currently logged in as an authorized administrator. Ensure you sign out after making changes to sensitive data.
          </p>
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border dark:border-zinc-700">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase">
              <span>Status</span>
              <span className="text-green-500">Active Session</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-8 dark:bg-zinc-800 dark:border-zinc-700">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="text-[#cba35c]" />
          <h3 className="text-lg font-bold dark:text-white uppercase tracking-wider">Site Configuration</h3>
        </div>
        <div className="space-y-4">
          {settings.map(setting => (
            <div key={setting.key_name} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border dark:border-zinc-700">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{setting.key_name}</p>
                <p className="text-sm font-medium dark:text-white mt-1">{setting.val}</p>
              </div>
              <button className="text-xs font-bold text-blue-600 uppercase hover:underline">Edit</button>
            </div>
          ))}
          {settings.length === 0 && (
            <div className="text-center py-6 text-zinc-500 text-sm italic">
              No custom site settings defined.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
