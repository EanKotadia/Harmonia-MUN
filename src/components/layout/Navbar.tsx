'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Houses', href: '/houses' },
    { label: 'Schedule', href: '/schedule' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Notices', href: '/notices' },
    { label: 'Register', href: '/register' },
  ]

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#0a0f1d]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-[#cba35c]">HARMONIA <span className="text-white">MUN</span></span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-[#cba35c]"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="rounded-full bg-[#cba35c] px-5 py-2 text-sm font-bold text-[#0a0f1d] hover:bg-[#cba35c]/90 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0a0f1d] border-b border-white/10">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-[#cba35c]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
