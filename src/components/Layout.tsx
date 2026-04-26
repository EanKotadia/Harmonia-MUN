import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
  subtitle: string;
  announcement?: string;
  footerText?: string;
  schoolLogoUrl?: string;
  profile?: any;
}

export default function Layout({ children, activeTab, setActiveTab, title, subtitle, announcement, footerText, schoolLogoUrl, profile }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'committees', label: 'Committees' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'notices', label: 'Notices' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'sponsors', label: 'Sponsors' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-accent selection:text-bg">
      <header className="fixed top-0 left-0 right-0 z-[110]">
        {announcement && (
          <div className="bg-accent text-bg py-2 px-6 text-center font-ui text-[10px] font-bold uppercase tracking-widest relative">
            {announcement}
          </div>
        )}
        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 md:px-10 h-[80px] bg-bg/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl">
          <div className="flex items-center gap-12">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-4 group"
            >
              <img 
                src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
                alt="School Logo"
                className="h-10 md:h-12 object-contain group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="hidden lg:flex flex-col items-start translate-y-[-2px]">
                 <span className="font-display text-2xl tracking-tighter uppercase text-white leading-none">Harmonia</span>
                 <span className="font-ui text-[8px] font-bold tracking-[0.4em] uppercase text-accent leading-none">MUN 2026</span>
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden xl:flex items-center gap-10 list-none">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "font-ui text-[11px] font-bold uppercase tracking-[2px] transition-all relative py-2 group",
                    activeTab === item.id ? "text-accent" : "text-white/40 hover:text-white"
                  )}
                >
                  {item.label}
                  <div className={cn(
                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-300",
                    activeTab === item.id ? "w-full" : "w-0 group-hover:w-full opacity-40"
                  )} />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button
               onClick={() => setActiveTab('admin')}
               className="hidden md:flex px-6 py-2 border border-white/10 hover:border-accent/40 rounded-lg font-ui text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-all"
            >
               Admin
            </button>
            <button 
              className="xl:hidden p-2 text-white/60 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="xl:hidden fixed inset-0 top-0 bg-[#0d0d0d] p-8 flex flex-col z-[150]"
              >
                <div className="flex items-center justify-between h-[80px] mb-12">
                   <div className="flex items-center gap-4">
                      <img 
                        src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
                        alt="School Logo"
                        className="h-10 object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col">
                        <span className="font-display text-xl tracking-tighter uppercase text-white leading-none">Harmonia</span>
                        <span className="font-ui text-[7px] font-bold tracking-[0.4em] uppercase text-accent leading-none">MUN 2026</span>
                      </div>
                   </div>
                   <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white/60 hover:text-white transition-colors">
                      <X size={32} />
                   </button>
                </div>

                <div className="flex flex-col gap-8 flex-1">
                  {navItems.map((item, idx) => (
                    <motion.button
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        "font-display text-6xl text-left tracking-tight uppercase leading-none pb-2 border-b border-white/5",
                        activeTab === item.id ? "text-accent" : "text-white/30"
                      )}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setIsMenuOpen(false);
                    }}
                    className="font-ui text-sm font-bold uppercase tracking-[0.4em] text-accent"
                  >
                    Admin Portal
                  </button>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">© 2026</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Spacer for fixed header */}
        <div className={cn(
          announcement ? "h-[92px]" : "h-[62px]"
        )} />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg border-t border-border py-12 px-6 md:px-10 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <img
            src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
            alt="School Logo"
            className="h-16 md:h-20 object-contain mb-4 opacity-80 hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
          />
          <div className="font-display text-3xl tracking-[4px] uppercase">
            {title.split(' ')[0]} <span>{title.split(' ')[1] || ''}</span>
          </div>
          <p className="font-ui text-[11px] font-bold uppercase tracking-[3px] text-muted">
            {subtitle}
          </p>
          <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted/50 mt-4">
            {footerText || `© 2026 ${title}. All rights reserved.`}
          </p>

          <div className="w-full h-px bg-border my-4" />

          <div className="flex flex-col md:flex-row justify-between w-full gap-4 font-sans text-[12px] text-subtle">
            <span>© 2026 Shalom Hills International School | Made by Ean Kotadia, Chetanya Singh and Tanush Kansal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
