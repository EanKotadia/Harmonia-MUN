'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Layers, Globe, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  category_type: string
  is_active: boolean
  eligible_years: string
  image_url?: string
}

export default function CategoryManagement({ initialCategories }: { initialCategories: Category[] }) {
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({})
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `category-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('categories')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(uploadError.message)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('categories')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, image_url: publicUrl }))
    } catch (error: any) {
      alert('Category image upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function stageChange(id: string, updates: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('staged_changes').insert({
      table_name: 'categories',
      record_id: id,
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
    <div className="grid gap-4">
      {initialCategories.map(cat => (
        <div key={cat.id} className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg">
                {cat.category_type === 'sport' ? <Layers className="h-5 w-5 text-blue-500" /> : <Globe className="h-5 w-5 text-amber-500" />}
              </div>
              <div className="flex items-center gap-4">
                {cat.image_url && (
                  <div className="relative h-12 w-12 rounded-lg overflow-hidden border dark:border-zinc-700">
                    <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-zinc-500 font-mono">{cat.category_type} • {cat.eligible_years}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsEditing(cat.id)
                setFormData(cat)
              }}
              className="px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-900/20"
            >
              Edit Config
            </button>
          </div>

          {isEditing === cat.id && (
            <div className="mt-6 pt-6 border-t dark:border-zinc-700 grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500">Eligibility (e.g. Years 9-12)</label>
                  <input
                    type="text"
                    value={formData.eligible_years || ''}
                    onChange={e => setFormData({...formData, eligible_years: e.target.value})}
                    className="w-full mt-1 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-500">Category Type</label>
                  <select
                    value={formData.category_type || ''}
                    onChange={e => setFormData({...formData, category_type: e.target.value})}
                    className="w-full mt-1 bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-blue-500/20 dark:text-white"
                  >
                    <option value="sport">Sport</option>
                    <option value="cultural">Cultural</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Header Image</label>
                <div className="flex items-center gap-4">
                  {formData.image_url ? (
                    <div className="relative h-24 w-40 rounded-xl overflow-hidden border dark:border-zinc-700 group">
                      <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  ) : (
                    <label className="h-24 w-40 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                      <Upload className="h-6 w-6 text-zinc-400 mb-1" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </span>
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                    </label>
                  )}
                  <p className="text-[10px] text-zinc-500 max-w-[200px]">
                    Recommended: 16:9 aspect ratio. Images will be optimized for the committee page.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => stageChange(cat.id, {
                    eligible_years: formData.eligible_years,
                    category_type: formData.category_type,
                    image_url: formData.image_url
                  })}
                  className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" /> Stage Updates
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
  )
}
