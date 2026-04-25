import { ReactNode } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Home,
  Trophy,
  Calendar,
  Music,
  Image as ImageIcon,
  Bell,
  Settings,
  UserPlus,
  CheckSquare,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Houses', href: '/admin/houses', icon: Home },
    { label: 'Categories', href: '/admin/categories', icon: Trophy },
    { label: 'Matches', href: '/admin/matches', icon: Trophy },
    { label: 'Schedule', href: '/admin/schedule', icon: Calendar },
    { label: 'Cultural Results', href: '/admin/cultural-results', icon: Music },
    { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Notices', href: '/admin/notices', icon: Bell },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Registrations', href: '/admin/registrations', icon: UserPlus },
    { label: 'Approvals', href: '/admin/approvals', icon: CheckSquare },
  ]

  if (!user) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-900">
      <aside className="w-64 bg-white shadow-md dark:bg-zinc-800">
        <div className="p-6">
          <h1 className="text-xl font-bold dark:text-white">Admin Panel</h1>
        </div>
        <nav className="mt-2 space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 w-64 px-4">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
