'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserPlus, FileText, Trash2, ExternalLink, Mail, Search } from 'lucide-react'

interface Registration {
  id: number
  event_name: string
  student_name: string
  student_class: string
  student_section: string
  file_url: string
  created_at: string
}

export default function AdminRegistrationsPage() {
  const [regs, setRegs] = useState<Registration[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchRegistrations()
  }, [])

  async function fetchRegistrations() {
    const { data } = await supabase.from('registrations').select('*').order('created_at', { ascending: false })
    if (data) setRegs(data)
  }

  async function deleteRegistration(id: number) {
    if (!confirm('Are you sure you want to remove this registration record?')) return
    const { error } = await supabase.from('registrations').delete().eq('id', id)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      fetchRegistrations()
    }
  }

  const filteredRegs = regs.filter(reg =>
    reg.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.event_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Event Registrations</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">View and manage student applications for MUN committees and events.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search delegates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg outline-none focus:ring-2 ring-blue-500/20 dark:text-white text-sm w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRegs.map(reg => (
          <div key={reg.id} className="rounded-xl border bg-white p-6 dark:bg-zinc-800 dark:border-zinc-700 group hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white text-lg">{reg.student_name}</h3>
                  <p className="text-sm font-medium text-[#cba35c] uppercase tracking-wider">{reg.event_name}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                    <span>Class {reg.student_class}-{reg.student_section}</span>
                    <span>Applied {new Date(reg.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {reg.file_url && (
                  <a
                    href={reg.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View Documents"
                  >
                    <FileText size={18} />
                  </a>
                )}
                <button
                  onClick={() => deleteRegistration(reg.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete Application"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredRegs.length === 0 && (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed dark:border-zinc-800">
            <UserPlus className="mx-auto h-12 w-12 text-zinc-300 mb-4" />
            <p className="text-zinc-500">No registration records found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
