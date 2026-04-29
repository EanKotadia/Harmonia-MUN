import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, Terminal, Globe, Mail, Instagram, Linkedin, Twitter } from 'lucide-react';
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

export default function Layout({
  children,
  activeTab,
  setActiveTab,
  title,
  subtitle,
  announcement,
  footerText,
  schoolLogoUrl,
  profile
}: LayoutProps) {
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
          <div className="bg-accent text-bg py-2 px-6 text-center font-ui text-[9px] font-bold uppercase tracking-[0.3em] relative shadow-lg">
            {announcement}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex items-center justify-between px-8 md:px-12 h-[80px] bg-bg/80 backdrop-blur-2xl border-b border-white/5">
          <div className="flex items-center gap-12">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <img 
                src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
                alt="School Logo"
                className="h-10 md:h-12 object-contain group-hover:scale-105 transition-all duration-500 brightness-110"
                referrerPolicy="no-referrer"
              />
            </button>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-10 list-none">
            {navItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "font-ui text-[10px] font-bold uppercase tracking-[0.25em] transition-all relative py-2 group cursor-pointer",
                    activeTab === item.id ? "text-accent" : "text-white/40 hover:text-white"
                  )}
                >
                  {item.label}
                  <motion.div
                    layoutId="nav-underline"
                    className={cn(
                      "absolute -bottom-1 left-0 right-0 h-[2px] bg-accent shadow-[0_0_10px_rgba(188,138,44,0.5)]",
                      activeTab === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    )}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <button
               onClick={() => setActiveTab('admin')}
               className="hidden md:flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 hover:border-accent/40 rounded-xl font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted hover:text-accent transition-all group cursor-pointer"
            >
               <Terminal size={14} className="group-hover:animate-pulse" />
               Terminal
            </button>
            <button 
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
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
                className="lg:hidden fixed inset-0 top-0 bg-bg-dark p-10 flex flex-col z-[150]"
              >
                <div className="flex items-center justify-between h-[80px] mb-16">
                   <div className="flex items-center gap-4">
                      <img 
                        src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
                        alt="School Logo"
                        className="h-10 object-contain brightness-125"
                        referrerPolicy="no-referrer"
                      />
                   </div>
                   <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all cursor-pointer">
                      <X size={24} />
                   </button>
                </div>

                <div className="flex flex-col gap-6 flex-1">
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
                        "font-display text-5xl text-left tracking-tight uppercase leading-none py-4 border-b border-white/5 transition-colors",
                        activeTab === item.id ? "text-accent" : "text-white/20 hover:text-white/40"
                      )}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>

                <div className="pt-10 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setActiveTab('admin');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 font-ui text-xs font-bold uppercase tracking-[0.4em] text-accent"
                  >
                    <Terminal size={14} />
                    Terminal
                  </button>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-white/10">EST 2026</p>
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
          announcement ? "h-[110px]" : "h-[80px]"
        )} />
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-bg-dark border-t border-white/5 py-20 px-8 md:px-12 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5 flex flex-col items-start gap-8">
            <img
              src={schoolLogoUrl || "https://www.shalomhills.com/images/logo.png"}
              alt="School Logo"
              className="h-16 md:h-20 object-contain brightness-110"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-display text-4xl tracking-[2px] uppercase mb-2">
                {title.split(' ')[0]} <span className="text-accent">{title.split(' ').slice(1).join(' ')}</span>
              </div>
              <p className="font-ui text-[11px] font-bold uppercase tracking-[4px] text-accent/60">
                {subtitle}
              </p>
            </div>
            <p className="text-sm text-muted max-w-md leading-relaxed">
              Empowering the next generation of global leaders through diplomacy,
              critical thinking, and international collaboration.
            </p>
            <div className="flex items-center gap-4">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-muted hover:text-accent hover:bg-white/10 transition-all border border-white/5">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <span className="font-ui text-[10px] font-bold uppercase tracking-[3px] text-white">Navigation</span>
              <ul className="flex flex-col gap-4 list-none">
                {['Home', 'About', 'Committees', 'Schedule'].map(item => (
                  <li key={item}>
                    <button
                      onClick={() => setActiveTab(item.toLowerCase())}
                      className="text-xs text-muted hover:text-accent transition-colors text-left cursor-pointer"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <span className="font-ui text-[10px] font-bold uppercase tracking-[3px] text-white">Resources</span>
              <ul className="flex flex-col gap-4 list-none">
                {['Background Guides', 'Delegate Portal', 'Conference Map', 'Help Center'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-xs text-muted hover:text-accent transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6 col-span-2 md:col-span-1">
              <span className="font-ui text-[10px] font-bold uppercase tracking-[3px] text-white">Contact Us</span>
              <ul className="flex flex-col gap-4 list-none">
                <li>
                  <a href="mailto:info@shalom.edu" className="flex items-center gap-3 text-xs text-muted hover:text-accent transition-colors">
                    <Mail size={14} /> info@shalom.edu
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-xs text-muted hover:text-accent transition-colors">
                    <Globe size={14} /> shalommun.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-medium uppercase tracking-[2px] text-white/30 text-center md:text-left">
            © 2026 Shalom Group of Schools International School. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[1px] text-white/40">
             <span>Made by <span className="text-accent/60">Ean, Chetanya & Tanush</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
