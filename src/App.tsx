import AdminPanel from './components/AdminPanel';
import LoginForm from './components/LoginForm';
import SupabaseConfig from './components/SupabaseConfig';
import { configureSupabase, supabase } from './lib/supabase';
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ScheduleCard from './components/ScheduleCard';
import EventsSection from './components/EventsSection';
import { useHarmoniaMUNData } from './hooks/useHarmoniaMUNData';
import { Session } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, Calendar, Shield, Loader2, AlertCircle, ChevronRight, Play, Image as ImageIcon, Video, ExternalLink, Bell, Info, FileText, Filter, ChevronDown, ChevronUp, Clock, Layers, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';

export default function App() {
  if (!supabase) return <SupabaseConfig onConfigured={configureSupabase} />;

  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [galleryYear, setGalleryYear] = useState<'all' | 2025 | 2026>('all');
  const [noticePriority, setNoticePriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [expandedNoticeId, setExpandedNoticeId] = useState<number | null>(null);
  const { sessions, schedule, settings, categories, gallery, notices, culturalResults, members, sponsors, profile, loading, error, refresh } = useHarmoniaMUNData();
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setActiveTab('admin');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  const liveItems = React.useMemo(() => schedule.filter(s => s.status === 'live'), [schedule]);
  const upcomingItems = React.useMemo(() => schedule.filter(s => s.status === 'upcoming').slice(0, 3), [schedule]);

  const handleTabChange = (tab: string) => {
    if (tab !== 'matches') {
      setSelectedCategory(null);
    }
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="text-accent" size={24} />
          </div>
        </div>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-accent animate-pulse">Loading Conference Data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-dark p-6 text-center">
        <div className="w-20 h-20 bg-danger/10 text-danger rounded-3xl flex items-center justify-center mb-6 border border-danger/20">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-3xl font-display text-white mb-4">Connection Error</h2>
        <p className="text-white/40 max-w-md mb-8 font-medium">
          {error}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry Connection
          </button>
          <button
            onClick={() => refresh()}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-ui text-xs font-bold uppercase tracking-widest text-white transition-all"
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  const festivalName = settings['festival_name'] || 'Harmonia MUN 2026';
  const festivalSubtitle = settings['festival_subtitle'] || 'Harmonia Model United Nations';
  const festivalDates = settings['festival_dates'] || 'April 2026 - Shalom Group of Schools';
  const announcementText = settings['announcement_text'];
  const footerText = settings['footer_text'];
  const schoolLogoUrl = settings['school_logo_url'];

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('docs.google.com/spreadsheets')) {
      if (url.includes('/edit')) {
        return url.split('/edit')[0] + '/preview';
      }
      if (!url.includes('/preview') && !url.includes('/pubhtml')) {
        return url + (url.includes('?') ? '&' : '?') + 'rm=minimal';
      }
    }
    return url;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'admin':
        if (!profile) return <LoginForm onSuccess={() => refresh()} onBack={() => setActiveTab('home')} />;
        return <AdminPanel sessions={sessions} schedule={schedule} categories={categories} notices={notices} gallery={gallery} culturalResults={culturalResults} members={members} sponsors={sponsors} profile={profile} settings={settings} refresh={refresh} onBack={() => setActiveTab('home')} />;
      case 'gallery':
        return (
          <div className="min-h-screen pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="space-y-4">
                  <span className="font-ui text-[12px] font-bold uppercase tracking-[0.4em] text-accent">Visual History</span>
                  <h1 className="font-display text-7xl md:text-8xl tracking-tighter uppercase leading-[0.85]">
                    Moments in <br/> <span className="text-muted/20">Motion</span>
                  </h1>
                </div>
                <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-muted max-w-xs text-right leading-relaxed">
                  A curated collection of memories from previous editions and the current conference.
                </p>
              </div>

              {gallery.length === 0 ? (
                <div className="h-[60vh] rounded-[3rem] border border-white/5 bg-white/2 flex flex-col items-center justify-center gap-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                  <ImageIcon size={64} className="text-white/10" />
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-muted">Media will be uploaded soon</p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-[2rem] border border-white/5 bg-white/5 break-inside-avoid shadow-2xl">
                       {item.type === 'video' ? (
                          <div className="relative aspect-video">
                             <iframe 
                               src={getEmbedUrl(item.url)} 
                               className="w-full h-full"
                               allowFullScreen
                             />
                          </div>
                       ) : (
                         <img 
                           src={item.url} 
                           alt={item.title}
                           className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                           referrerPolicy="no-referrer"
                         />
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 pointer-events-none">
                         <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-accent mb-2">{item.type}</span>
                         <h3 className="font-display text-2xl text-white uppercase tracking-wider">{item.title}</h3>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case 'events':
        return <EventsSection categories={categories} matches={sessions} setActiveTab={setActiveTab} />;
      case 'home':
        return (
          <div className="space-y-0">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] lg:h-screen flex items-center overflow-hidden bg-bg" id="home">
              <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg-dark to-bg opacity-50" />
              
              <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <p className="font-ui text-[12px] md:text-[14px] font-bold uppercase tracking-[0.5em] text-accent">Shalom Group of Schools Presents</p>
                      <h1 className="text-[12vw] lg:text-[7vw] font-display uppercase tracking-tight leading-[0.9] text-white">
                        Harmonia <br/>
                        <span className="text-accent">MUN 2026</span>
                      </h1>
                      <p className="font-ui text-lg md:text-xl font-medium tracking-[0.2em] uppercase text-white/60">
                        Beyond Words. Towards Action.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <button
                        onClick={() => setActiveTab('committees')}
                        className="btn-primary px-10 py-4 text-[11px]"
                      >
                        Explore Committees
                      </button>
                      <button
                        onClick={() => setActiveTab('about')}
                        className="btn-ghost px-10 py-4 text-[11px] border-white/20 text-white hover:border-white"
                      >
                        About Conference
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="relative hidden lg:block"
                  >
                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
                      <img
                        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000"
                        alt="Conference Hero"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent" />

                      {/* Decorative elements */}
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 blur-3xl rounded-full" />
                      <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/10 blur-2xl rounded-full" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* QUICK STATS */}
            <section className="py-24 border-y border-white/5 bg-bg-dark">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
                  {[
                    { label: 'Committees', val: categories.length.toString(), icon: Layers },
                    { label: 'Secretariat', val: members.filter(m => m.category === 'Secretariat').length.toString(), icon: Users },
                    { label: 'Delegates', val: '300+', icon: Users },
                    { label: 'Days', val: '2', icon: Calendar }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-4 text-center lg:text-left"
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent mx-auto lg:mx-0">
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-4xl md:text-5xl font-display text-white">{stat.val}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-2">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case 'about':
        const secretariat = members.filter(m => m.category === 'Secretariat');
        const eb = members.filter(m => m.category === 'EB');
        return (
          <div className="space-y-0 bg-bg">
             {/* Main About Section */}
             <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                   <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      className="space-y-8"
                   >
                      <div className="space-y-4">
                         <p className="sec-label">The Conference</p>
                         <h2 className="text-6xl md:text-7xl font-display uppercase text-white">About <br/> Harmonia MUN</h2>
                      </div>
                      <div className="prose prose-invert prose-lg text-white/60 font-sans leading-relaxed">
                         <p>
                            Harmonia Model United Nations is a premier diplomatic simulation hosted by Shalom Group of Schools.
                            Our conference provides a platform for young minds to engage in meaningful dialogue,
                            tackle global challenges, and develop essential leadership skills.
                         </p>
                         <p>
                            With a legacy of excellence, Chapter 2 brings together delegates from across the region
                             to collaborate, negotiate, and innovate towards a more harmonious future.
                         </p>
                      </div>
                      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                         <div>
                            <h4 className="text-3xl font-display text-accent">300+</h4>
                            <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted">Delegates</p>
                         </div>
                         <div>
                            <h4 className="text-3xl font-display text-accent">12+</h4>
                            <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted">Committees</p>
                         </div>
                      </div>
                   </motion.div>
                   <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      className="relative"
                   >
                      <div className="aspect-[16/10] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative">
                         <img
                           src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1000"
                           alt="Conference"
                           className="w-full h-full object-cover"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent" />
                      </div>
                   </motion.div>
                </div>
             </section>

             {/* Leadership Header */}
             <section className="relative pt-32 pb-24 flex flex-col items-center text-center border-t border-white/5">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-4">
                   <div className="flex items-center justify-center gap-4">
                      <div className="h-[1px] w-8 bg-accent/40" />
                      <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Leadership</span>
                      <div className="h-[1px] w-8 bg-accent/40" />
                   </div>
                   <h1 className="text-7xl md:text-8xl font-display uppercase tracking-tight text-white">Voices of Guidance</h1>
                </motion.div>
             </section>

             {/* Secretariat */}
             <section className="py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                   <div className="text-center mb-16">
                      <div className="flex items-center justify-center gap-4 mb-4">
                         <div className="h-[1px] w-8 bg-accent/40" />
                         <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-accent">The Team</span>
                         <div className="h-[1px] w-8 bg-accent/40" />
                      </div>
                      <h2 className="text-6xl md:text-8xl font-display uppercase text-white">Secretariat</h2>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {secretariat.map((m, i) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: i * 0.1 }}
                          key={m.id} 
                          className="bg-white/5 border border-white/5 rounded-[2rem] p-6 space-y-6 hover:border-accent/20 transition-all group"
                        >
                           <div className="aspect-square rounded-2xl overflow-hidden bg-white/5 grayscale group-hover:grayscale-0 transition-all duration-700">
                             <img src={m.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" />
                           </div>
                           <div className="text-center space-y-2">
                             <h4 className="text-xl font-display uppercase text-white">{m.name}</h4>
                             <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{m.role}</p>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
             </section>

             {/* EB Members */}
             <section className="py-24 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                   <div className="text-center mb-16">
                      <h2 className="text-6xl font-display uppercase text-white">Executive Board</h2>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {eb.map((m, i) => (
                        <motion.div 
                          key={m.id} 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          transition={{ delay: i * 0.05 }}
                          className="p-6 border border-white/5 rounded-[2rem] space-y-4 hover:bg-white/5 transition-all text-center"
                        >
                           <img src={m.image_url || ''} className="w-24 h-24 rounded-full mx-auto object-cover grayscale opacity-50" />
                           <div>
                              <h4 className="text-lg font-display uppercase text-white">{m.name}</h4>
                              <p className="text-[9px] font-bold text-accent uppercase tracking-widest">{m.role}</p>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>
             </section>
          </div>
        );

      case 'committees':
        return (
          <section className="py-32" id="committees">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                <p className="sec-label">Committees & Councils</p>
                <h2 className="text-7xl md:text-8xl font-display uppercase text-white mb-6">The Arena of Diplomacy</h2>
                <p className="text-muted text-xl max-w-2xl">Shape the world's destiny in our high-stakes simulation councils.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categories.map((committee, i) => (
                  <motion.div
                    key={committee.id}
                    whileHover={{ y: -10 }}
                    className="card-glass overflow-hidden group h-full flex flex-col"
                  >
                    <div className="aspect-[4/5] relative bg-white/5 flex items-center justify-center overflow-hidden">
                      {committee.image_url ? (
                        <img
                          src={committee.image_url}
                          alt={committee.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform relative z-10">{committee.icon || '🛡️'}</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <div className="flex items-center justify-between mb-2">
                           <h4 className="text-3xl font-display uppercase tracking-wider text-white">{committee.name}</h4>
                           {committee.bg_guide_url && (
                              <a 
                                href={committee.bg_guide_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-white/10 hover:bg-accent hover:text-bg rounded-lg transition-colors"
                                title="Download Background Guide"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <FileText size={16} />
                              </a>
                           )}
                        </div>
                        <p className="text-white/60 text-sm mb-6 line-clamp-3">{committee.description}</p>
                        <button
                          onClick={() => {
                            setSelectedCategory(committee.id);
                            setActiveTab('events');
                          }}
                          className="w-full py-4 bg-accent/10 border border-accent/20 hover:bg-accent text-accent hover:text-bg-dark transition-all font-ui text-[10px] font-bold uppercase tracking-widest rounded-xl"
                        >
                          Explore Committee
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <div className="text-center mb-24">
              <div className="flex items-center justify-center gap-4 mb-4">
                 <div className="h-[1px] w-8 bg-accent/40" />
                 <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Conference Flow</span>
                 <div className="h-[1px] w-8 bg-accent/40" />
              </div>
              <h1 className="text-7xl md:text-9xl font-display uppercase text-white">The Timeline</h1>
              <p className="text-muted text-xl mt-6">Track the evolution of debate across both days of Harmonia MUN 2026.</p>
            </div>

            <div className="space-y-32 relative">
               <div className="absolute left-[30px] lg:left-1/2 top-4 bottom-4 w-[1px] bg-white/10" />
               {['Day 1', 'Day 2'].map((day) => {
                 const dayItems = schedule.filter(si => si.day_label === day);
                 return (
                   <div key={day} className="space-y-12">
                      <div className="relative z-10 flex justify-center">
                         <div className="px-8 py-3 bg-accent text-bg rounded-full font-display text-xl uppercase">{day}</div>
                      </div>
                      <div className="space-y-12">
                         {dayItems.map((item, idx) => (
                           <motion.div 
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            key={item.id} 
                            className={cn(
                              "relative flex items-center justify-between gap-12 w-full",
                              idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                            )}
                           >
                              <div className="hidden lg:block w-[45%] text-right">
                                 {idx % 2 === 0 ? (
                                    <div className="space-y-2">
                                       <h3 className="text-3xl font-display text-white uppercase">{item.title}</h3>
                                       <p className="text-muted text-lg">{item.venue}</p>
                                    </div>
                                 ) : (
                                    <div className="text-5xl font-display text-white/10 uppercase">{item.time_start}</div>
                                 )}
                              </div>

                              <div className="relative z-10 w-[60px] h-[60px] bg-bg-dark border border-white/20 rounded-full flex items-center justify-center shrink-0">
                                 <Clock size={20} className="text-accent" />
                              </div>

                              <div className="w-full lg:w-[45%] text-left">
                                {idx % 2 === 0 ? (
                                   <div className="text-5xl font-display text-white/10 uppercase lg:hidden">{item.time_start}</div>
                                ) : (
                                   <div className="space-y-2">
                                      <h3 className="text-3xl font-display text-white uppercase">{item.title}</h3>
                                      <p className="text-muted text-lg">{item.venue}</p>
                                   </div>
                                )}
                                {idx % 2 === 0 ? (
                                   <div className="text-5xl font-display text-white/10 uppercase hidden lg:block">{item.time_start}</div>
                                ) : (
                                   <div className="text-5xl font-display text-white/10 uppercase lg:hidden">{item.time_start}</div>
                                )}
                                <div className="lg:hidden mt-2">
                                   <h3 className="text-xl font-display text-white uppercase">{item.title}</h3>
                                   <p className="text-[10px] text-muted font-bold uppercase">{item.venue}</p>
                                </div>
                              </div>
                           </motion.div>
                         ))}
                      </div>
                   </div>
                 );
               })}
            </div>
          </div>
        );

      case 'rankings':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <div className="text-center mb-24">
              <div className="flex items-center justify-center gap-4 mb-4">
                 <div className="h-[1px] w-8 bg-accent/40" />
                 <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Hall of Fame</span>
                 <div className="h-[1px] w-8 bg-accent/40" />
              </div>
              <h1 className="text-7xl md:text-9xl font-display uppercase text-white">Conference Awards</h1>
              <p className="text-muted text-xl mt-6 max-w-3xl mx-auto">Celebrating diplomatic excellence and exceptional contribution to the conference.</p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-[4rem] p-12 lg:p-24 min-h-[500px] flex flex-col items-center justify-center text-center">
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                  <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center mx-auto text-accent mb-8">
                     <Trophy size={64} className="animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-display uppercase text-white/40">Awards will be announced following the closing ceremony.</h3>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.5em] text-accent/40">Stay Tuned for results</p>
               </motion.div>
            </div>
          </div>
        );

      case 'sponsors':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32">
            <div className="text-center mb-24">
              <div className="flex items-center justify-center gap-4 mb-4">
                 <div className="h-[1px] w-8 bg-accent/40" />
                 <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Partners</span>
                 <div className="h-[1px] w-8 bg-accent/40" />
              </div>
              <h1 className="text-7xl md:text-9xl font-display uppercase text-white">Our Sponsors</h1>
              <p className="text-muted text-xl mt-6">Gratitude to our partners who make Harmonia MUN Chapter 2 possible.</p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-[4rem] p-12 lg:p-24 min-h-[400px] flex items-center justify-center">
               <div className="space-y-6 text-center">
                 <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-muted">Sponsorship opportunities available for chapter 2</p>
                 <div className="w-full h-[1px] bg-white/5" />
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20">
                    {/* Placeholder logos */}
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-24 flex items-center justify-center border border-dashed border-white/20 rounded-2xl">
                         <span className="text-[10px] font-bold uppercase">Partner {i}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        );


      case 'notices':
        const filteredNotices = notices.filter(n => noticePriority === 'all' || n.priority === noticePriority);
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <p className="sec-label">Announcements</p>
                <h2 className="text-4xl sm:text-6xl md:text-7xl">Official Notices</h2>
                <p className="text-white/40 mt-4">Stay updated with the latest fest news and alerts.</p>
              </div>

              <div className="flex items-center flex-nowrap gap-2 bg-white/5 p-1 border border-border rounded-lg overflow-x-auto no-scrollbar pb-2">
                {['all', 'high', 'medium', 'low'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNoticePriority(p as any)}
                    className={cn(
                      "px-6 py-2 font-ui text-[11px] font-bold uppercase tracking-widest transition-all rounded-md whitespace-nowrap shrink-0",
                      noticePriority === p ? "bg-accent text-bg shadow-lg" : "text-muted hover:text-text"
                    )}
                  >
                    {p === 'all' ? 'All' : p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredNotices.map((notice) => (
                  <motion.div
                    key={notice.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "card-glass p-8 group hover:border-accent/30 transition-all cursor-pointer",
                      expandedNoticeId === notice.id && "border-accent/50"
                    )}
                    onClick={() => setExpandedNoticeId(expandedNoticeId === notice.id ? null : notice.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                          notice.priority === 'high' ? "bg-danger/20 text-danger" :
                          notice.priority === 'medium' ? "bg-accent/20 text-accent" :
                          "bg-white/5 text-muted"
                        )}>
                          {notice.priority} priority
                        </span>
                        <span className="font-ui text-[10px] font-bold text-muted uppercase tracking-widest">
                          {new Date(notice.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-accent">
                        {expandedNoticeId === notice.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    <h3 className="text-3xl font-display tracking-wide uppercase mb-4">{notice.title}</h3>

                    <AnimatePresence>
                      {expandedNoticeId === notice.id ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="prose prose-invert max-w-none prose-p:text-muted prose-p:text-lg prose-p:leading-relaxed prose-headings:text-white prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-strong:text-accent prose-a:text-accent hover:prose-a:underline mt-6 pt-6 border-t border-white/10">
                            <ReactMarkdown>{notice.content}</ReactMarkdown>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-muted text-lg leading-relaxed line-clamp-2">{notice.content}</p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredNotices.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-40 text-center card-glass"
                >
                  <Bell size={48} className="mx-auto text-muted mb-4" />
                  <p className="font-ui text-sm font-bold text-muted uppercase tracking-widest">No notices found for this category.</p>
                </motion.div>
              )}
            </div>
          </div>
        );


      case 'spreadsheet':
        const spreadsheetUrl = settings['spreadsheet_url'];
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <p className="sec-label">Management</p>
                <h2 className="text-6xl md:text-7xl">Data Sheet</h2>
                <p className="text-white/40 mt-4">Detailed event and participant management via Google Sheets.</p>
              </div>
              {spreadsheetUrl && (
                <a
                  href={spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-3"
                >
                  <ExternalLink size={20} />
                  Open Full Sheet
                </a>
              )}
            </div>

            <div className="card-glass h-[800px] overflow-hidden shadow-2xl relative">
              {spreadsheetUrl ? (
                <iframe
                  src={getEmbedUrl(spreadsheetUrl)}
                  className="w-full h-full border-none"
                  title="Data Spreadsheet"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted gap-4">
                  <FileText size={64} className="opacity-10" />
                  <p className="font-ui text-sm font-bold uppercase tracking-widest">No spreadsheet URL configured</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={handleTabChange}
      title={festivalName}
      subtitle={festivalSubtitle}
      announcement={announcementText}
      footerText={footerText}
      schoolLogoUrl={schoolLogoUrl}
      profile={profile}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
