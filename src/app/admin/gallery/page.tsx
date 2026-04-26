'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Plus, ImageIcon, Video } from 'lucide-react'

interface GalleryItem {
  id: number
  title: string
  type: 'image' | 'video'
  url: string
  year: number
  created_at: string
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'image' as 'image' | 'video',
    url: '',
    year: new Date().getFullYear()
  })
  const supabase = createClient()

  useEffect(() => {
    fetchGallery()
  }, [])

  async function fetchGallery() {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    if (data) setItems(data)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (uploadError) throw new Error(uploadError.message)

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      setFormData(prev => ({ ...prev, url: publicUrl }))
    } catch (error: any) {
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('gallery').insert([formData])

    if (error) {
      alert('Error saving to gallery: ' + error.message)
    } else {
      setIsAdding(false)
      setFormData({ title: '', type: 'image', url: '', year: new Date().getFullYear() })
      fetchGallery()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight dark:text-white">Media Gallery</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Upload and manage images and videos from the event.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-[#cba35c] text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b89250] transition-colors"
        >
          <Plus size={18} /> Add Media
        </button>
      </div>

      {isAdding && (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Title</label>
                <input
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#cba35c]/20 dark:text-white"
                  placeholder="e.g. Opening Ceremony Day 1"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Year</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-700 rounded-lg px-3 py-2 outline-none focus:ring-2 ring-[#cba35c]/20 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 block mb-2">Media Upload</label>
              {formData.url ? (
                <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border dark:border-zinc-700 group">
                  <img src={formData.url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, url: ''}))}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
              ) : (
                <label className="aspect-video w-full max-w-md rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                  <Upload className="h-8 w-8 text-zinc-400 mb-2" />
                  <span className="text-xs font-bold text-zinc-500 uppercase">
                    {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
                  </span>
                  <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                </label>
              )}
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Save to Gallery</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 border dark:border-zinc-700 rounded-lg dark:text-white">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative group border dark:border-zinc-700">
            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
              <p className="text-white text-xs font-bold uppercase tracking-wider mb-1">{item.title}</p>
              <p className="text-zinc-400 text-[10px] font-bold">{item.year}</p>
            </div>
            <div className="absolute top-2 right-2 p-1.5 bg-black/20 backdrop-blur-md rounded-lg text-white">
              {item.type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
