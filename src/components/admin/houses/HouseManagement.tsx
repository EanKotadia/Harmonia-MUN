'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pencil, Save, Upload, X } from 'lucide-react'

interface House {
  id: string
  name: string
  color: string
  points: number
  mascot_name: string
  logo_url?: string
  banner_url?: string
}

export default function HouseManagement({ initialHouses }: { initialHouses: House[] }) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<House>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const supabase = createClient()

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'banner_url') {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(field)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `house-assets/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('houses')
        .upload(filePath, file)

      if (uploadError) throw new Error(uploadError.message)

      const { data: { publicUrl } } = supabase.storage
        .from('houses')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, [field]: publicUrl }))
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(null)
    }
  }

  async function stageChange(houseId: string, updates: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('staged_changes').insert({
      table_name: 'houses',
      record_id: houseId,
      updates: updates,
      created_by: user?.id,
      created_by_email: user?.email,
      status: 'pending'
    })

    if (error) {
      alert('Error staging change: ' + error.message)
    } else {
      alert('Change submitted for approval')
      setIsEditing(null)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        {initialHouses.map(house => (
          <div key={house.id} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                {house.logo_url ? (
                  <img src={house.logo_url} alt="" className="h-12 w-12 rounded-lg object-cover border dark:border-zinc-700" />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-zinc-100 dark:bg-zinc-700" />
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: house.color }} />
                    <h3 className="text-lg font-bold dark:text-white uppercase">{house.name}</h3>
                  </div>
                  <p className="text-xs text-zinc-500 font-bold uppercase">{house.mascot_name || 'No Mascot'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditing(house.id)
                  setFormData(house)
                }}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
              >
                <Pencil className="h-4 w-4 text-zinc-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-xs font-bold uppercase text-zinc-500">Points</p>
                <p className="text-3xl font-black dark:text-white">{house.points}</p>
              </div>
            </div>

            {house.banner_url && (
              <div className="relative h-20 w-full rounded-lg overflow-hidden border dark:border-zinc-700 mb-4">
                <img src={house.banner_url} alt="" className="h-full w-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent" />
              </div>
            )}

            {isEditing === house.id && (
              <div className="mt-6 pt-6 border-t dark:border-zinc-700 space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500">Update Points</label>
                  <input
                    type="number"
                    value={formData.points || 0}
                    onChange={e => setFormData({...formData, points: parseInt(e.target.value)})}
                    className="w-full mt-1 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Logo</label>
                    {formData.logo_url ? (
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden border dark:border-zinc-700 group">
                        <img src={formData.logo_url} alt="" className="h-full w-full object-cover" />
                        <button onClick={() => setFormData(prev => ({...prev, logo_url: ''}))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><X size={16} /></button>
                      </div>
                    ) : (
                      <label className="h-20 w-20 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <Upload size={16} className="text-zinc-400" />
                        <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'logo_url')} accept="image/*" />
                      </label>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Banner</label>
                    {formData.banner_url ? (
                      <div className="relative h-20 w-full rounded-lg overflow-hidden border dark:border-zinc-700 group">
                        <img src={formData.banner_url} alt="" className="h-full w-full object-cover" />
                        <button onClick={() => setFormData(prev => ({...prev, banner_url: ''}))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><X size={16} /></button>
                      </div>
                    ) : (
                      <label className="h-20 w-full rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <Upload size={16} className="text-zinc-400" />
                        <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'banner_url')} accept="image/*" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => stageChange(house.id, {
                      points: formData.points,
                      logo_url: formData.logo_url,
                      banner_url: formData.banner_url
                    })}
                    className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Submit for Approval
                  </button>
                  <button
                    onClick={() => setIsEditing(null)}
                    className="px-4 py-2 border dark:border-zinc-700 rounded-lg dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
