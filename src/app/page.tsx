import Navbar from '@/components/layout/Navbar'
import { Trophy, Users, Calendar, Bell, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1d]">
      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-[#0a0f1d] z-10" />
        </div>

        <div className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center rounded-full border border-[#cba35c]/30 bg-[#cba35c]/5 px-3 py-1 text-sm font-medium text-[#cba35c] mb-8">
            <span className="mr-2">✨</span> Harmonia MUN 2026
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl">
            LEAD WITH <span className="text-[#cba35c]">HARMONY</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Join the most prestigious Model United Nations conference where diplomacy meets innovation.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="rounded-full bg-[#cba35c] px-8 py-4 text-lg font-bold text-[#0a0f1d] transition-transform hover:scale-105">
              Register Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Leaderboard', desc: 'Track house points.', icon: Trophy, href: '/houses' },
              { title: 'Committees', desc: 'Explore agendas.', icon: Users, href: '/categories' },
              { title: 'Schedule', desc: 'Conference itinerary.', icon: Calendar, href: '/schedule' },
              { title: 'Updates', desc: 'Latest notices.', icon: Bell, href: '/notices' },
            ].map((item) => (
              <Link key={item.title} href={item.href} className="group glass-card p-8 rounded-2xl transition-all hover:-translate-y-2">
                <item.icon className="h-12 w-12 text-[#cba35c] mb-6" />
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#cba35c]">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
