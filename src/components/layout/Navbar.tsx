'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Home, Layers, Calendar, Award, ExternalLink, Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { label: 'HOME', href: '/', icon: Home },
    { label: 'COMMITTEES', href: '/categories', icon: Layers },
    { label: 'SCHEDULE', href: '/schedule', icon: Calendar },
    { label: 'RANKINGS', href: '/houses', icon: Award },
  ]

  return (
    <nav className="fixed top-0 z-50 w-full px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#cba35c] text-black">
            <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-tight">HARMONIA MUN 2026</span>
            <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">Harmonia Model United Nations</span>
          </div>
        </Link>

        {/* Desktop Nav - Centered Pill */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-black/40 p-1.5 backdrop-blur-xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold tracking-widest transition-all ${
                    isActive
                      ? 'bg-[#cba35c] text-black shadow-[0_0_20px_rgba(203,163,92,0.3)]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <link.icon size={16} strokeWidth={2.5} />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Portal Button */}
        <div className="hidden lg:block">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold tracking-[0.2em] text-white transition-all hover:bg-white/10"
          >
            PORTAL
            <ExternalLink size={14} className="opacity-60" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#050a18]/95 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl p-4 text-sm font-bold tracking-widest text-white hover:bg-white/5"
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between rounded-xl bg-[#cba35c] p-4 text-sm font-bold tracking-widest text-black"
            >
              PORTAL
              <ExternalLink size={18} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
