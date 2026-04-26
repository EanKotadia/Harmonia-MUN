import React, { useState, useEffect } from 'react';
import { supabase, configureSupabase } from './lib/supabase';
import SupabaseConfig from './components/SupabaseConfig';
import Layout from './components/Layout';
import AdminPanel from './components/AdminPanel';
import EventsSection from './components/EventsSection';
import { useShalomData } from './hooks/useShalomData';
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
  const { sessions, schedule, settings, categories, gallery, notices, culturalResults, members, sponsors, profile, loading, error, refresh } = useShalomData();

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
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy className="text-white" size={24} />
          </div>
        </div>
        <p className="font-ui text-xs font-bold uppercase tracking-[0.4em] text-white animate-pulse">Loading Shalom Group of Schools…</p>
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

  const festivalName = 'Shalom Group of Schools';
  const festivalSubtitle = 'Excellence in Education';
  const festivalDates = 'Academic Year 2026';
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
      case 'admin': return <AdminPanel sessions={sessions} schedule={schedule} categories={categories} notices={notices} gallery={gallery} culturalResults={culturalResults} members={members} sponsors={sponsors} profile={profile} settings={settings} refresh={refresh} onBack={() => setActiveTab('home')} />;
      case 'gallery':
        return (
          <div className="min-h-screen pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="space-y-4">
                  <span className="font-ui text-[12px] font-bold uppercase tracking-[0.4em] text-white">Visual History</span>
                  <h1 className="font-display text-7xl md:text-8xl tracking-tighter uppercase leading-[0.85]">
                    Moments in <br/> <span className="text-white/20">Motion</span>
                  </h1>
                </div>
              </div>

              {gallery.length === 0 ? (
                <div className="h-[60vh] rounded-[3rem] border border-white/5 bg-white/2 flex flex-col items-center justify-center gap-6 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  <ImageIcon size={64} className="text-white/10" />
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Media will be uploaded soon</p>
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
                       <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8 pointer-events-none">
                         <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-white mb-2">{item.type}</span>
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
            {/* HERO SECTION - UCSF STYLE */}
            <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center overflow-hidden bg-bg" id="home">
              <div className="lg:w-1/2 p-8 lg:p-24 z-10 space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <p className="font-ui text-[14px] font-bold uppercase tracking-[0.4em] text-white/60">Welcome to</p>
                  <h1 className="text-7xl lg:text-9xl font-display uppercase tracking-tighter leading-[0.8] text-white">
                    Shalom Group <br/> <span className="text-white/40">of Schools</span>
                  </h1>
                  <p className="text-xl text-white/70 max-w-lg font-sans leading-relaxed">
                    Nurturing minds, building character, and empowering the leaders of tomorrow through holistic education and excellence.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="flex flex-wrap gap-6"
                >
                  <button
                    onClick={() => setActiveTab('about')}
                    className="btn-primary"
                  >
                    Discover Our Vision
                  </button>
                  <button 
                    onClick={() => setActiveTab('committees')}
                    className="btn-ghost"
                  >
                    Explore Programs
                  </button>
                </motion.div>
              </div>

              <div className="lg:w-1/2 h-[50vh] lg:h-screen relative">
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1200"
                  alt="Campus"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/20 to-transparent lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent lg:hidden block" />
              </div>
            </section>

            {/* QUICK STATS */}
            <section className="py-24 border-y border-white/5 bg-bg2">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
                  {[
                    { label: 'Campus Locations', val: '5+', icon: Layers },
                    { label: 'Expert Faculty', val: '200+', icon: Users },
                    { label: 'Students', val: '5000+', icon: Users },
                    { label: 'Years of Excellence', val: '25+', icon: Calendar }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="space-y-4 text-center lg:text-left"
                    >
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white mx-auto lg:mx-0">
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-4xl md:text-5xl font-display text-white">{stat.val}</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mt-2">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-0 bg-bg">
             {/* Header */}
             <section className="relative pt-32 pb-24 flex flex-col items-center text-center px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                   <div className="flex items-center justify-center gap-4">
                      <div className="h-[1px] w-8 bg-white/20" />
                      <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">Our Heritage</span>
                      <div className="h-[1px] w-8 bg-white/20" />
                   </div>
                   <h1 className="text-7xl md:text-8xl font-display uppercase tracking-tight text-white">About Our Institution</h1>
                </motion.div>
             </section>

             {/* Split Layout Section */}
             <section className="py-24 bg-bg2 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
                    <div className="lg:w-1/2 space-y-8">
                       <p className="sec-label">Our Philosophy</p>
                       <h2 className="text-5xl lg:text-7xl font-display uppercase text-white leading-tight">Empowering Every Student to Succeed</h2>
                       <div className="space-y-6 text-lg text-white/70 leading-relaxed font-sans">
                         <p>
                           Shalom Group of Schools is dedicated to providing a supportive and challenging learning environment that encourages students to explore their potential and develop a lifelong love for learning.
                         </p>
                         <p>
                           With a focus on academic rigor, character development, and global citizenship, we prepare our students to navigate the complexities of the modern world with confidence and integrity.
                         </p>
                       </div>
                       <div className="pt-8">
                         <button className="btn-primary">Learn More About Our Values</button>
                       </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                      <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10">
                        <img
                          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800"
                          alt="School Environment"
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                    </div>
                  </div>
                </div>
             </section>

             {/* Additional Stats/Info */}
             <section className="py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
                   <h2 className="text-5xl font-display uppercase text-white">Our Global Community</h2>
                   <p className="text-xl text-white/60 max-w-3xl mx-auto">
                     Join a diverse network of students, alumni, and educators committed to making a difference in the world.
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                      {[
                        { title: 'Academic Excellence', desc: 'Consistently ranked among the top schools for academic achievement.' },
                        { title: 'Holistic Growth', desc: 'Comprehensive sports, arts, and leadership programs for all students.' },
                        { title: 'Safe Environment', desc: 'A nurturing and secure campus designed for optimal learning.' }
                      ].map((item, i) => (
                        <div key={i} className="p-10 card-glass space-y-6">
                           <h4 className="text-2xl font-display uppercase text-white">{item.title}</h4>
                           <p className="text-white/60 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </section>
          </div>
        );

      case 'committees':
        return (
          <section className="py-32 bg-bg" id="committees">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                <p className="sec-label">Our Programs</p>
                <h2 className="text-7xl md:text-8xl font-display uppercase text-white mb-6">Educational Offerings</h2>
                <p className="text-white/60 text-xl max-w-2xl font-sans">Discover the wide range of academic and co-curricular programs available at Shalom Group of Schools.</p>
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
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform relative z-10 text-white/20">{committee.icon || '🛡️'}</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-8 flex flex-col flex-grow bg-bg/40 backdrop-blur-md">
                      <h3 className="text-2xl font-display uppercase tracking-wide text-white mb-4 group-hover:text-white transition-colors">{committee.name}</h3>
                      <p className="text-white/50 text-sm line-clamp-3 mb-8 font-sans leading-relaxed">{committee.description}</p>

                      <button
                         onClick={() => {
                           setSelectedCategory(committee.id);
                           setActiveTab('events');
                         }}
                         className="mt-auto flex items-center gap-2 text-white font-ui text-[10px] font-bold uppercase tracking-widest group-hover:gap-4 transition-all"
                      >
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'schedule':
        return (
          <div className="max-w-5xl mx-auto px-6 py-24">
            <div className="mb-20 text-center">
              <p className="sec-label justify-center">Academic Calendar</p>
              <h2 className="text-7xl md:text-8xl font-display uppercase text-white">Event Schedule</h2>
              <p className="text-white/40 mt-6 text-xl max-w-2xl mx-auto">Stay informed about upcoming school events, holidays, and academic milestones.</p>
            </div>

            <div className="space-y-24">
              {['Day 1', 'Day 2'].map((day) => (
                <div key={day} className="space-y-12">
                   <div className="flex items-center gap-6">
                      <h3 className="text-4xl font-display uppercase text-white whitespace-nowrap">{day}</h3>
                      <div className="h-px w-full bg-white/10" />
                   </div>
                   <div className="grid gap-6">
                      {schedule.filter(s => s.day_label === day).map((item) => (
                        <div key={item.id} className="card-glass p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-white/30 transition-all">
                           <div className="flex items-center gap-8">
                              <div className="w-24 text-center border-r border-white/10 pr-8">
                                 <span className="block font-display text-2xl text-white">{item.time_start}</span>
                                 <span className="block font-ui text-[10px] font-bold text-white/40 uppercase tracking-widest">Start</span>
                              </div>
                              <div className="space-y-1">
                                 <h4 className="text-2xl font-display uppercase text-white group-hover:text-white transition-colors">{item.title}</h4>
                                 <p className="text-white/40 text-sm font-sans">{item.subtitle}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <span className="px-4 py-2 bg-white/5 rounded-lg font-ui text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/5">
                                 {item.venue}
                              </span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'rankings':
        return (
          <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center mb-24">
               <p className="sec-label justify-center">Excellence</p>
               <h1 className="text-7xl md:text-9xl font-display uppercase text-white">Hall of Fame</h1>
               <p className="text-white/60 text-xl mt-6">Celebrating the achievements and leadership of our outstanding students.</p>
            </div>

            <div className="card-glass p-12 lg:p-24 min-h-[500px] flex flex-col items-center justify-center text-center">
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white mb-8">
                     <Trophy size={64} className="animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-display uppercase text-white/40">Awards will be announced following the ceremony.</h3>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.5em] text-white/40">Stay Tuned for results</p>
               </motion.div>
            </div>
          </div>
        );

      case 'sponsors':
        return (
          <div className="max-w-7xl mx-auto px-6 py-32 bg-bg">
            <div className="text-center mb-24">
              <div className="flex items-center justify-center gap-4 mb-4">
                 <div className="h-[1px] w-8 bg-white/20" />
                 <span className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">Partners</span>
                 <div className="h-[1px] w-8 bg-white/20" />
              </div>
              <h1 className="text-7xl md:text-9xl font-display uppercase text-white">Our Sponsors</h1>
              <p className="text-white/60 text-xl mt-6">Gratitude to our partners who support Shalom Group of Schools.</p>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-[4rem] p-12 lg:p-24 min-h-[400px] flex items-center justify-center">
               <div className="space-y-6 text-center">
                 <p className="font-ui text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Sponsorship opportunities available</p>
                 <div className="w-full h-[1px] bg-white/5" />
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-24 flex items-center justify-center border border-dashed border-white/20 rounded-2xl">
                         <span className="text-[10px] font-bold uppercase text-white">Partner {i}</span>
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
          <div className="max-w-7xl mx-auto px-6 py-24 bg-bg">
            <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
              <div>
                <p className="sec-label">Announcements</p>
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-display uppercase text-white">Official Notices</h2>
                <p className="text-white/40 mt-4">Stay updated with the latest school news and alerts.</p>
              </div>

              <div className="flex items-center flex-nowrap gap-2 bg-white/5 p-1 border border-white/10 rounded-lg overflow-x-auto no-scrollbar pb-2">
                {['all', 'high', 'medium', 'low'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setNoticePriority(p as any)}
                    className={cn(
                      "px-6 py-2 font-ui text-[11px] font-bold uppercase tracking-widest transition-all rounded-md whitespace-nowrap shrink-0",
                      noticePriority === p ? "bg-white text-bg shadow-lg" : "text-white/40 hover:text-white"
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
                      "card-glass p-8 group hover:border-white/30 transition-all cursor-pointer",
                      expandedNoticeId === notice.id && "border-white/50"
                    )}
                    onClick={() => setExpandedNoticeId(expandedNoticeId === notice.id ? null : notice.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest",
                          notice.priority === 'high' ? "bg-danger/20 text-danger" :
                          notice.priority === 'medium' ? "bg-white/20 text-white" :
                          "bg-white/5 text-white/40"
                        )}>
                          {notice.priority} priority
                        </span>
                        <span className="font-ui text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          {new Date(notice.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="text-white">
                        {expandedNoticeId === notice.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>

                    <h3 className="text-3xl font-display tracking-wide uppercase mb-4 text-white">{notice.title}</h3>

                    <AnimatePresence>
                      {expandedNoticeId === notice.id ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="prose prose-invert max-w-none prose-p:text-white/60 prose-p:text-lg prose-p:leading-relaxed prose-headings:text-white prose-headings:font-display prose-headings:uppercase prose-headings:tracking-widest prose-strong:text-white prose-a:text-white hover:prose-a:underline mt-6 pt-6 border-t border-white/10">
                            <ReactMarkdown>{notice.content}</ReactMarkdown>
                          </div>
                        </motion.div>
                      ) : (
                        <p className="text-white/60 text-lg leading-relaxed line-clamp-2">{notice.content}</p>
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
                  <Bell size={48} className="mx-auto text-white/20 mb-4" />
                  <p className="font-ui text-sm font-bold text-white/40 uppercase tracking-widest">No notices found for this category.</p>
                </motion.div>
              )}
            </div>
          </div>
        );


      case 'spreadsheet':
        const spreadsheetUrl = settings['spreadsheet_url'];
        return (
          <div className="max-w-7xl mx-auto px-6 py-24 bg-bg">
            <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <p className="sec-label">Management</p>
                <h2 className="text-6xl md:text-7xl font-display uppercase text-white">Data Sheet</h2>
                <p className="text-white/40 mt-4">Detailed school and participant management via Google Sheets.</p>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
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
