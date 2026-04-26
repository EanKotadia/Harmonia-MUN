import Navbar from '@/components/layout/Navbar'
import { Trophy, Users, Calendar, Bell, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050a18] selection:bg-[#cba35c]/30">
      <Navbar />

      <main className="relative flex min-h-screen flex-col items-center justify-center pt-20">
        {/* Glow Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          {/* Date & Location Pill */}
          <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-[#cba35c]/30 bg-[#cba35c]/5 px-6 py-2.5 text-[10px] font-bold tracking-[0.3em] text-[#cba35c] uppercase">
            <Sparkles size={12} className="text-[#cba35c]" />
            APRIL 2026 • SHALOM HILLS
          </div>

          {/* Hero Titles */}
          <div className="flex flex-col items-center gap-0">
            <h1 className="text-8xl font-black tracking-[-0.04em] text-white sm:text-[10rem] lg:text-[12rem] leading-[0.85]">
              HARMONIA
            </h1>
            <h2 className="text-8xl font-black tracking-[-0.04em] text-[#cba35c] sm:text-[10rem] lg:text-[12rem] leading-[0.85]">
              MUN
            </h2>
          </div>

          {/* Bottom School Text */}
          <div className="mt-24 flex flex-col gap-2 max-w-3xl">
            <p className="text-xs font-bold tracking-[0.5em] text-gray-400 uppercase leading-relaxed">
              THE PREMIER MODEL UNITED NATIONS
            </p>
            <p className="text-xs font-bold tracking-[0.5em] text-gray-400 uppercase leading-relaxed">
              CHAMPIONSHIP OF SHALOM HILLS INTERNATIONAL
            </p>
            <p className="text-xs font-bold tracking-[0.5em] text-gray-400 uppercase leading-relaxed text-center">
              SCHOOL
            </p>
          </div>
        </div>
      </main>

      {/* Feature Section (Optional, kept subtle for navigation) */}
      <section className="relative z-10 py-24 border-t border-white/5 bg-[#030712]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'RANKINGS', desc: 'Real-time house standings.', icon: Trophy, href: '/houses' },
              { title: 'COMMITTEES', desc: 'Browse agendas & guides.', icon: Users, href: '/categories' },
              { title: 'SCHEDULE', desc: 'Event timeline & venues.', icon: Calendar, href: '/schedule' },
              { title: 'NOTICES', desc: 'Latest announcements.', icon: Bell, href: '/notices' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-[#cba35c]/50"
              >
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#cba35c]/5 transition-transform group-hover:scale-150" />
                <item.icon className="relative z-10 h-10 w-10 text-[#cba35c] mb-6" strokeWidth={1.5} />
                <h3 className="relative z-10 text-lg font-bold tracking-widest text-white group-hover:text-[#cba35c]">{item.title}</h3>
                <p className="relative z-10 mt-2 text-sm text-gray-500">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
