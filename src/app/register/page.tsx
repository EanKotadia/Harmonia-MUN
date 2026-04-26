'use client'

import Navbar from '@/components/layout/Navbar'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, Upload } from 'lucide-react'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    student_name: '',
    student_class: '',
    student_section: '',
    event_name: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let file_url = ''
    if (file) {
      const fileName = `${Math.random()}.${file.name.split('.').pop()}`
      const { data } = await supabase.storage.from('registrations').upload(fileName, file)
      if (data) {
        const { data: urlData } = supabase.storage.from('registrations').getPublicUrl(fileName)
        file_url = urlData.publicUrl
      }
    }

    const { error } = await supabase.from('registrations').insert({
      ...formData,
      file_url
    })

    if (error) {
      alert(error.message)
    } else {
      setSubmitted(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-32 pb-20">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 rounded-3xl">
          {submitted ? (
            <div className="text-center py-10">
              <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <Send size={40} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Registration Successful!</h2>
              <p className="text-gray-400">Your application has been received. Our team will review it and get back to you shortly.</p>
              <button onClick={() => window.location.href = '/'} className="mt-8 text-[#cba35c] font-bold border-b border-[#cba35c]">Return Home</button>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2">Delegate <span className="text-[#cba35c]">Registration</span></h1>
                <p className="text-gray-400 text-sm">Fill out the details below to secure your spot at Harmonia MUN.</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={e => setFormData({...formData, student_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#cba35c] outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Class</label>
                    <input
                      type="text"
                      required
                      value={formData.student_class}
                      onChange={e => setFormData({...formData, student_class: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#cba35c] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Section</label>
                    <input
                      type="text"
                      required
                      value={formData.student_section}
                      onChange={e => setFormData({...formData, student_section: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#cba35c] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Target Committee/Event</label>
                  <input
                    type="text"
                    required
                    value={formData.event_name}
                    onChange={e => setFormData({...formData, event_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#cba35c] outline-none"
                    placeholder="e.g. UNHRC or Football"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Upload ID/Proof (Optional)</label>
                  <div className="relative group cursor-pointer">
                    <input
                      type="file"
                      onChange={e => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-xl px-4 py-8 flex flex-col items-center justify-center text-gray-500 group-hover:border-[#cba35c] transition-colors">
                      <Upload size={32} className="mb-2" />
                      <p className="text-sm">{file ? file.name : 'Click or drag to upload file'}</p>
                    </div>
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#cba35c] py-4 rounded-xl text-[#0a0f1d] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Complete Registration'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
