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
import { Trophy, Activity, Calendar, Shield, Loader2, AlertCircle, ChevronRight, Play, Image as ImageIcon, Video, ExternalLink, Bell, Info, FileText, Filter, ChevronDown, ChevronUp, Clock, Layers, Users, ArrowRight, Target } from 'lucide-react';
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
      } else if (hash.startsWith('committees/')) {
        const slug = hash.split('/')[1];
        const committee = categories.find(c => c.slug === slug || c.id === slug);
        if (committee) {
          setSelectedCategory(committee.id);
          setActiveTab('committee-detail');
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [categories]);



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
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg gap-6">
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-6 text-center">
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
      case 'gallery':
        return (
          <div className="min-h-screen pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <p className="sec-label">Visuals</p>
                <h2 className="text-6xl md:text-8xl font-display uppercase text-white">Gallery</h2>
                <p className="text-white/40 max-w-2xl mx-auto">Capturing moments of diplomacy, debate, and discovery.</p>
              </div>

              {gallery.length === 0 ? (
                <div className="h-[60vh] rounded-[3rem] border border-white/5 bg-white/5 flex flex-col items-center justify-center gap-6 overflow-hidden relative">
                  <ImageIcon size={64} className="text-white/10" />
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-muted">Media will be uploaded soon</p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-[2rem] border border-white/5 bg-surface break-inside-avoid shadow-2xl">
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

            <div className="bg-surface border border-white/5 rounded-[4rem] p-12 lg:p-24 min-h-[400px] flex items-center justify-center">
               <div className="space-y-12 text-center w-full">
                 <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-muted">Sponsorship opportunities available</p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                    {sponsors.length === 0 ? [1,2,3,4].map(i => (
                      <div key={i} className="h-24 flex items-center justify-center border border-dashed border-white/20 rounded-2xl opacity-20">
                         <span className="text-[10px] font-bold uppercase">Partner {i}</span>
                      </div>
                    )) : sponsors.map(s => (
                      <div key={s.id} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all p-6 bg-white/5 rounded-3xl border border-white/5">
                         <img src={s.logo_url || ''} alt={s.name} className="max-h-20 object-contain" />
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        );

        return <AdminPanel sessions={sessions} schedule={schedule} categories={categories} notices={notices} gallery={gallery} culturalResults={culturalResults} members={members} sponsors={sponsors} profile={profile} settings={settings} refresh={refresh} onBack={() => setActiveTab('home')} />;
            case 'committee-detail':
        const committee = categories.find(c => c.id === selectedCategory);
        const committeeMembers = members.filter(m => m.committee_id === selectedCategory && m.category === 'EB');
        if (!committee) return null;

        return (
          <div className="min-h-screen bg-bg">
            <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
              <button
                onClick={() => {
                  window.location.hash = 'committees';
                  setActiveTab('committees');
                }}
                className="flex items-center gap-2 text-muted hover:text-accent transition-all mb-12 font-ui text-[10px] font-bold uppercase tracking-widest"
              >
                <ChevronRight className="rotate-180" size={14} /> Back to Hall
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                   <div className="space-y-6">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-5xl border border-white/5">
                        {committee.icon || '🛡️'}
                      </div>
                      <h1 className="text-6xl md:text-8xl font-display uppercase tracking-tight text-white leading-none">
                        {committee.name}
                      </h1>
                      <div className="flex flex-wrap gap-4">
                        <span className="px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full font-ui text-[10px] font-bold uppercase tracking-widest text-accent">
                          MUN 2026
                        </span>
                        {committee.bg_guide_url && (
                           <span className="px-4 py-1.5 bg-success/10 border border-success/20 rounded-full font-ui text-[10px] font-bold uppercase tracking-widest text-success">
                             Resource Ready
                           </span>
                        )}
                      </div>
                   </div>

                   <div className="prose prose-invert prose-lg text-white/60 font-sans leading-relaxed">
                      <p className="whitespace-pre-line">{committee.description}</p>
                   </div>

                   {committee.bg_guide_url && (
                     <div className="pt-8 border-t border-white/5">
                        <h4 className="text-xl font-display uppercase tracking-widest text-white mb-6">Study Material</h4>
                        <a
                          href={committee.bg_guide_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary px-10 py-5 rounded-2xl flex items-center justify-center gap-3 w-fit"
                        >
                          <FileText size={20} /> Download Background Guide (PDF)
                        </a>
                     </div>
                   )}
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                   <div className="aspect-[16/10] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative bg-white/5">
                      {committee.image_url ? (
                        <img src={committee.image_url} alt={committee.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                           <Layers size={80} />
                        </div>
                      )}
                   </div>

                   <div className="space-y-8">
                      <div className="flex items-center gap-4">
                         <h4 className="text-xl font-display uppercase tracking-widest text-white">Executive Board</h4>
                         <div className="h-px flex-1 bg-white/5" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {committeeMembers.length > 0 ? committeeMembers.map(eb => (
                            <div key={eb.id} className="p-6 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-6">
                               <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg border border-white/10 shrink-0">
                                  <img src={eb.image_url || ''} className="w-full h-full object-cover" alt={eb.name} />
                               </div>
                               <div>
                                  <p className="font-display text-xl text-white uppercase tracking-wider">{eb.name}</p>
                                  <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-accent">{eb.role}</p>
                               </div>
                            </div>
                         )) : (
                            <div className="col-span-full py-12 border border-dashed border-white/5 rounded-3xl text-center">
                               <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted">Board members will be announced soon</p>
                            </div>
                         )}
                      </div>
                   </div>
                </motion.div>
              </div>
            </div>
          </div>
        );

      case 'events':
        return <EventsSection categories={categories} matches={sessions} members={members} setActiveTab={setActiveTab} />;
      case 'home':
        return (
          <div className="space-y-0">
            {/* HERO SECTION */}
            <section className="relative py-32 md:py-48 flex flex-col items-center justify-center text-center px-6 bg-bg overflow-hidden" id="home">
              <div className="relative z-10 max-w-4xl space-y-16">
                <div className="space-y-8">
                  <p className="font-ui text-[14px] md:text-[18px] font-bold uppercase tracking-[0.6em] text-accent">Shalom Group of Schools Presents</p>
                  <h1 className="text-[14vw] md:text-[10vw] font-display uppercase tracking-tight leading-[0.8] text-white">
                    Harmonia <br/> <span className="text-accent">MUN 2026</span>
                  </h1>
                  <p className="font-ui text-lg md:text-2xl font-medium tracking-[0.2em] uppercase text-white/50 max-w-2xl mx-auto">
                    Beyond Words. Towards Action.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => setActiveTab('committees')}
                    className="btn-primary px-16 py-6 text-[13px] rounded-2xl shadow-2xl shadow-accent/20"
                  >
                    Explore Conference
                  </button>
                </div>
              </div>
            </section>

            {/* QUICK STATS */}
            <section className="py-24 border-y border-white/5 bg-bg">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
                  {[
                    { label: 'Committees', val: categories.length.toString(), icon: Layers },
                    { label: 'Secretariat', val: members.filter(m => m.category === 'Secretariat').length.toString(), icon: Users },
                    { label: 'Delegates', val: '300+', icon: Users },
                    { label: 'Days', val: '2', icon: Calendar }
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="space-y-4 text-center lg:text-left"
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-accent mx-auto lg:mx-0">
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-4xl md:text-5xl font-display text-white">{stat.val}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mt-2">{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* VOICES OF LEADERSHIP */}
            <section className="py-24 bg-bg border-b border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 text-center">
                   <p className="sec-label justify-center">Messages</p>
                   <h2 className="text-6xl md:text-8xl font-display uppercase text-white">Voices of Leadership</h2>
                </div>

                <div className="grid grid-cols-1 gap-12">
                   {members.filter(m => m.category === 'Secretariat' && m.message).length > 0 ? (
                      members.filter(m => m.category === 'Secretariat' && m.message).map((m, i) => (
                        <div
                          key={m.id}
                          className="bg-white/5 border border-white/5 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center md:items-start group hover:border-accent/20 transition-all shadow-2xl"
                        >
                           <div className="w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden border border-white/10 shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                              <img src={m.image_url || ''} alt={m.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="space-y-8 flex-1">
                              <div className="space-y-2 text-center md:text-left">
                                 <h3 className="text-4xl md:text-5xl font-display text-white uppercase tracking-tight leading-none">{m.name}</h3>
                                 <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-accent">{m.role}</p>
                              </div>
                              <div className="prose prose-invert prose-lg max-w-none">
                                 <p className="text-white/60 italic leading-relaxed text-xl">
                                    "{m.message}"
                                 </p>
                              </div>
                              <div className="w-12 h-1 bg-accent/20 rounded-full mx-auto md:mx-0" />
                           </div>
                        </div>
                      ))
                   ) : (
                      <div className="py-24 border border-dashed border-white/5 rounded-[3rem] flex flex-col items-center justify-center text-center space-y-4">
                         <Users className="text-white/5" size={64} />
                         <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-muted">Leadership messages will be added soon</p>
                      </div>
                   )}
                </div>
              </div>
            </section>

            {/* COMMITTEE SHOWCASE */}
            <section className="py-24 bg-bg border-b border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                  <div className="space-y-4">
                    <p className="sec-label">Academics</p>
                    <h2 className="text-6xl md:text-7xl font-display uppercase text-white">The Councils</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('committees')}
                    className="flex items-center gap-3 text-accent font-ui text-[10px] font-bold uppercase tracking-widest hover:gap-5 transition-all"
                  >
                    View All Committees <ArrowRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {categories.slice(0, 3).map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setActiveTab('committee-detail');
                        window.location.hash = `committees/${cat.slug || cat.id}`;
                      }}
                      className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6 hover:border-accent/20 transition-all cursor-pointer group"
                    >
                      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {cat.icon || '🛡️'}
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-display text-white uppercase tracking-wider">{cat.name}</h3>
                         <p className="text-muted text-sm line-clamp-3">{cat.description}</p>
                      </div>
                      <div className="pt-4 flex items-center gap-2 text-accent font-ui text-[9px] font-bold uppercase tracking-widest">
                         Details <ChevronRight size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TIMELINE PREVIEW */}
            <section className="py-24 bg-bg border-b border-white/5">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                  <div className="space-y-4">
                    <p className="sec-label">Schedule</p>
                    <h2 className="text-6xl md:text-7xl font-display uppercase text-white">Timeline</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className="flex items-center gap-3 text-accent font-ui text-[10px] font-bold uppercase tracking-widest hover:gap-5 transition-all"
                  >
                    Full Schedule <ArrowRight size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {schedule.slice(0, 4).map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/[0.07] transition-all">
                      <div className="flex items-center gap-8">
                         <div className="text-3xl font-display text-white/20 uppercase w-32">{item.time_start}</div>
                         <div>
                            <h4 className="text-xl font-display text-white uppercase tracking-wide">{item.title}</h4>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{item.venue}</p>
                         </div>
                      </div>
                      <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full font-ui text-[9px] font-bold uppercase tracking-widest text-muted">
                        {item.day_label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* GALLERY HIGHLIGHTS */}
            <section className="py-24 bg-bg border-b border-white/5">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                      <p className="sec-label">Visuals</p>
                      <h2 className="text-6xl md:text-7xl font-display uppercase text-white">Moments</h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="flex items-center gap-3 text-accent font-ui text-[10px] font-bold uppercase tracking-widest hover:gap-5 transition-all"
                    >
                      View Gallery <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {gallery.slice(0, 4).map((img) => (
                      <div key={img.id} className="aspect-square rounded-3xl overflow-hidden border border-white/5 bg-white/5 group">
                         <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={img.title} />
                      </div>
                    ))}
                    {gallery.length === 0 && [1,2,3,4].map(i => (
                       <div key={i} className="aspect-square rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                          <ImageIcon className="text-white/5" size={40} />
                       </div>
                    ))}
                  </div>
               </div>
            </section>

            {/* PARTNERS */}
            <section className="py-24 bg-bg">
               <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-16">
                     <p className="sec-label justify-center">Support</p>
                     <h2 className="text-4xl font-display uppercase text-white/60">Our Global Partners</h2>
                  </div>
                  <div className="flex flex-wrap justify-center gap-16 opacity-30">
                     {sponsors.length === 0 ? [1,2,3,4].map(i => (
                        <div key={i} className="h-12 w-32 border border-dashed border-white/20 rounded-xl" />
                     )) : sponsors.map(s => (
                        <div key={s.id} className="h-16 flex items-center">
                           <img src={s.logo_url || ''} className="h-full object-contain grayscale" alt={s.name} />
                        </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>
        );


      case 'about':
        const secretariat = members.filter(m => m.category === 'Secretariat');
        const conferencePillars = [
           { title: 'Diplomacy', desc: 'Fostering international cooperation and peaceful resolution of conflicts.', icon: Shield },
           { title: 'Leadership', desc: 'Empowering students to lead with integrity and vision.', icon: Trophy },
           { title: 'Research', desc: 'Encouraging deep dive into global issues and data-driven solutions.', icon: Info },
           { title: 'Collaboration', desc: 'Working together across boundaries to achieve common goals.', icon: Users }
        ];

        return (
          <div className="space-y-0 bg-bg">
             {/* Impactful Intro Section */}
             <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                   <div className="space-y-12">
                      <div className="space-y-6">
                         <p className="sec-label">The Legacy</p>
                         <h2 className="text-7xl md:text-9xl font-display uppercase text-white leading-tight">Beyond <br/> Boundaries.</h2>
                      </div>
                      <div className="space-y-8 text-white/60 font-sans text-xl leading-relaxed max-w-xl">
                         <p>
                            Harmonia Model United Nations, hosted by Shalom Group of Schools, represents the pinnacle of student-led diplomacy.
                            We empower the next generation of global thinkers to engage in rigorous debate and collaborative problem-solving.
                         </p>
                         <p>
                            Our mission is to foster a deeper understanding of international relations while building essential
                            leadership, public speaking, and negotiation skills in every delegate.
                         </p>
                      </div>
                      <div className="flex gap-12 pt-8 border-t border-white/5">
                         <div className="space-y-1">
                            <p className="text-4xl font-display text-accent">02</p>
                            <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted">Successful Chapters</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-4xl font-display text-accent">1000+</p>
                            <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted">Delegates Reached</p>
                         </div>
                      </div>
                   </div>
                   <div className="relative">
                      <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl relative bg-white/5">
                         <img
                           src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1000"
                           alt="Conference"
                           className="w-full h-full object-cover grayscale"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                      </div>
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 blur-3xl rounded-full" />
                   </div>
                </div>
             </section>

             {/* Mission & Vision Section */}
             <section className="py-32 border-t border-white/5 bg-bg">
                <div className="max-w-7xl mx-auto px-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/5">
                         <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <Target size={32} />
                         </div>
                         <h3 className="text-4xl font-display text-white uppercase">Our Mission</h3>
                         <p className="text-white/60 text-lg leading-relaxed">
                            To create an inclusive platform where students from diverse backgrounds can master the art of diplomacy,
                            understand the complexity of global governance, and develop the courage to lead positive change in their communities.
                         </p>
                      </div>
                      <div className="space-y-8 p-12 bg-white/5 rounded-[3rem] border border-white/5">
                         <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                            <Activity size={32} />
                         </div>
                         <h3 className="text-4xl font-display text-white uppercase">Our Vision</h3>
                         <p className="text-white/60 text-lg leading-relaxed">
                            A world where every young leader is equipped with the critical thinking, empathy, and communication skills
                            necessary to build a more harmonious and sustainable international community.
                         </p>
                      </div>
                   </div>
                </div>
             </section>

             {/* Conference Pillars */}
             <section className="py-32 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                   <div className="mb-20">
                      <p className="sec-label">Foundations</p>
                      <h2 className="text-6xl md:text-8xl font-display uppercase text-white">Conference Pillars</h2>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {conferencePillars.map((pillar, i) => (
                        <div key={i} className="p-8 space-y-6 bg-white/2 rounded-3xl border border-white/5 hover:border-accent/20 transition-all">
                           <div className="text-accent">
                              <pillar.icon size={32} />
                           </div>
                           <h4 className="text-2xl font-display text-white uppercase">{pillar.title}</h4>
                           <p className="text-white/40 text-sm leading-relaxed">{pillar.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </section>

             {/* Team Section */}
             <section className="py-32 border-t border-white/5 bg-bg">
                <div className="max-w-7xl mx-auto px-6">
                   <div className="mb-24 text-center">
                      <p className="sec-label justify-center">The Board</p>
                      <h2 className="text-6xl md:text-8xl font-display uppercase text-white">Secretariat Team</h2>
                   </div>

                   {/* Core Leadership (Top Roles) */}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
                      {secretariat.filter(m =>
                        m.role.toLowerCase().includes('general') ||
                        m.role.toLowerCase().includes('affairs') ||
                        m.role.toLowerCase().includes('director')
                      ).map((m) => (
                        <div key={m.id} className="bg-white/5 border border-accent/20 rounded-[3rem] p-10 space-y-8 hover:bg-white/[0.07] transition-all group shadow-2xl relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8">
                              <Shield className="text-accent/20" size={40} />
                           </div>
                           <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-bg border border-white/5">
                             <img src={m.image_url || ''} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={m.name} />
                           </div>
                           <div className="space-y-4">
                             <h4 className="text-3xl font-display uppercase text-white tracking-wide leading-none">{m.name}</h4>
                             <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-accent">{m.role}</p>
                             {m.message && (
                                <p className="text-white/40 text-sm italic leading-relaxed pt-4 border-t border-white/5">
                                   "{m.message.slice(0, 100)}..."
                                </p>
                             )}
                           </div>
                        </div>
                      ))}
                   </div>
                   
                   {/* Other Secretariat */}
                   <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {secretariat.filter(m =>
                        !(m.role.toLowerCase().includes('general') ||
                          m.role.toLowerCase().includes('affairs') ||
                          m.role.toLowerCase().includes('director'))
                      ).map((m) => (
                        <div
                          key={m.id} 
                          className="bg-white/2 border border-white/5 rounded-3xl p-6 space-y-6 hover:border-accent/30 transition-all group"
                        >
                           <div className="aspect-square rounded-2xl overflow-hidden bg-bg border border-white/5">
                             <img src={m.image_url || ''} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={m.name} />
                           </div>
                           <div className="text-center space-y-2">
                             <h4 className="text-lg font-display uppercase text-white tracking-wide">{m.name}</h4>
                             <p className="font-ui text-[8px] font-bold uppercase tracking-widest text-accent/60">{m.role}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </section>


             {/* Gallery Preview in About */}
             <section className="py-32 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                   <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                      <div className="space-y-4">
                        <p className="sec-label">Visuals</p>
                        <h2 className="text-6xl md:text-8xl font-display uppercase text-white">Moments</h2>
                      </div>
                      <button onClick={() => setActiveTab('gallery')} className="btn-ghost px-10 py-4 text-[10px] border-white/10 text-white hover:border-white">
                         Explore Gallery
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {gallery.slice(0, 3).map((item) => (
                        <div key={item.id} className="aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/5 group shadow-2xl">
                           <img src={item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={item.title} />
                        </div>
                      ))}
                   </div>
                </div>
             </section>

             {/* Sponsors Section in About */}
             <section className="py-32 border-t border-white/5 bg-bg">
                <div className="max-w-7xl mx-auto px-6 text-center">
                   <div className="mb-20">
                      <p className="sec-label justify-center">Partners</p>
                      <h2 className="text-5xl md:text-7xl font-display uppercase text-white">Our Global Support</h2>
                   </div>
                   <div className="flex flex-wrap justify-center gap-20 opacity-30">
                      {sponsors.map(s => (
                        <div key={s.id} className="h-16 flex items-center grayscale">
                           <img src={s.logo_url || ''} alt={s.name} className="h-full object-contain" />
                        </div>
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
                    layoutId={`card-${committee.id}`}
                    className="card-glass overflow-hidden group h-full flex flex-col cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(committee.id);
                      setActiveTab('committee-detail');
                    }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                         <h3 className="text-2xl font-display text-white uppercase tracking-wider mb-2">{committee.name}</h3>
                         <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                            <p className="text-white/60 text-xs line-clamp-2 mb-4">{committee.description}</p>
                            <button className="w-full py-3 bg-accent text-bg font-ui text-[9px] font-bold uppercase tracking-widest rounded-xl">
                               More Info & Resources
                            </button>
                         </div>
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

                              <div className="relative z-10 w-[60px] h-[60px] bg-bg border border-white/20 rounded-full flex items-center justify-center shrink-0">
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