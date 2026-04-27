import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import {
  X,
  Plus,
  Trash2,
  Save,
  LogOut,
  Trophy,
  Activity,
  Calendar,
  Layers,
  Users,
  Bell,
  Image as ImageIcon,
  Settings,
  ChevronRight,
  Shield,
  Loader2,
  AlertCircle,
  Database,
  CheckCircle2,
  Clock,
  Layout,
  Upload,
  Heart
} from 'lucide-react';
import { Session, ScheduleItem, Committee, Notice, Profile, Ranking, Member, Sponsor, GalleryItem } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CategoryEditorProps {
  cat: Committee;
  onRefresh: () => void;
  handleSupabaseError: (err: any, context: string) => void;
  culturalResults: Ranking[];
  members: Member[];
}

const CategoryEditor = ({
  cat,
  onRefresh,
  handleSupabaseError,
  culturalResults,
  members,
}: CategoryEditorProps) => {
  const [loading, setLoading] = useState(false);
  const catResults = culturalResults.filter(r => r.committee_id === cat.id);

  const updateCategory = async (updates: Partial<Committee>) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('committees').update(updates).eq('id', cat.id);
      if (error) throw error;
      onRefresh();
    } catch (err) {
      handleSupabaseError(err, 'Updating committee');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async () => {
    if (!confirm('Permanently delete this committee and all its data?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('committees').delete().eq('id', cat.id);
      if (error) throw error;
      onRefresh();
    } catch (err) {
      handleSupabaseError(err, 'Deleting committee');
    } finally {
      setLoading(false);
    }
  };

  const addRanking = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('rankings').insert([{
        committee_id: cat.id,
        name: 'New Delegate',
        school: 'School Name',
        award: 'Award Title'
      }]);
      if (error) throw error;
      onRefresh();
    } catch (err) {
      handleSupabaseError(err, 'Adding award');
    } finally {
      setLoading(false);
    }
  };

  const updateRanking = async (id: number, updates: Partial<Ranking>) => {
    try {
      const { error } = await supabase.from('rankings').update(updates).eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch (err) {
      handleSupabaseError(err, 'Updating award');
    }
  };

  const deleteRanking = async (id: number) => {
    try {
      const { error } = await supabase.from('rankings').delete().eq('id', id);
      if (error) throw error;
      onRefresh();
    } catch (err) {
      handleSupabaseError(err, 'Deleting award');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-accent text-3xl border border-white/5 group-hover:scale-105 transition-transform">
            {cat.icon || '🏛️'}
          </div>
          <div>
            <input
              type="text"
              value={cat.name}
              onChange={(e) => updateCategory({ name: e.target.value })}
              className="bg-transparent border-none text-2xl font-display text-white outline-none focus:ring-0 w-full"
            />
            <div className="flex items-center gap-3 mt-1">
              <span className="font-ui text-[9px] font-bold uppercase tracking-widest text-accent/60">ID: {cat.id}</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <input
                type="text"
                value={cat.slug}
                onChange={(e) => updateCategory({ slug: e.target.value })}
                className="bg-transparent border-none text-[10px] font-bold text-muted outline-none focus:ring-0 uppercase tracking-widest"
              />
            </div>
          </div>
        </div>
        <button
          onClick={deleteCategory}
          className="w-12 h-12 bg-white/5 hover:bg-danger/10 hover:text-danger rounded-2xl flex items-center justify-center text-muted transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={18} />
        </button>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-3">
            Description
            <div className="h-[1px] flex-1 bg-white/5" />
          </span>
          <textarea
            value={cat.description || ''}
            onChange={(e) => updateCategory({ description: e.target.value })}
            className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-5 text-xs text-muted font-medium outline-none focus:border-accent/50 transition-all min-h-[120px] resize-none"
            placeholder="Committee description..."
          />
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-3">
              Image URL
              <div className="h-[1px] flex-1 bg-white/5" />
            </span>
            <input
              type="text"
              value={cat.image_url || ''}
              onChange={(e) => updateCategory({ image_url: e.target.value })}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-xs text-white font-medium outline-none focus:border-accent/50 transition-all"
              placeholder="https://.../committee-image.jpg"
            />
          </div>
          <div className="space-y-4">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-muted flex items-center gap-3">
              Background Guide Link (PDF)
              <div className="h-[1px] flex-1 bg-white/5" />
            </span>
            <input
              type="text"
              value={cat.bg_guide_url || ''}
              onChange={(e) => updateCategory({ bg_guide_url: e.target.value })}
              className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 text-xs text-accent font-medium outline-none focus:border-accent/50 transition-all"
              placeholder="https://.../guide.pdf"
            />
          </div>
        </div>
      </div>



            <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-3 w-full">
            Executive Board (Assigned)
            <div className="h-[1px] flex-1 bg-accent/10" />
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {members.filter(m => m.committee_id === cat.id && m.category === 'EB').map(eb => (
              <div key={eb.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group/eb">
                 <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/5">
                    <img src={eb.image_url || ''} className="w-full h-full object-cover" alt={eb.name} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white uppercase tracking-tight">{eb.name}</p>
                    <p className="text-[9px] text-accent font-bold uppercase tracking-widest">{eb.role}</p>
                 </div>
              </div>
           ))}
           {members.filter(m => m.committee_id === cat.id && m.category === 'EB').length === 0 && (
              <div className="col-span-full py-6 border border-dashed border-white/10 rounded-2xl text-center">
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted">No EB members assigned in the Members tab</p>
              </div>
           )}
        </div>
      </div>


      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-3 w-full">
            Awards & Rankings
            <div className="h-[1px] flex-1 bg-accent/10" />
          </span>
          <button
            onClick={addRanking}
            className="ml-4 flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-bg transition-all"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {catResults.map(res => (
            <div key={res.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex gap-4 items-start group/res transition-all hover:border-white/10">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={res.award}
                  onChange={(e) => updateRanking(res.id, { award: e.target.value })}
                  placeholder="Award Title"
                  className="w-full bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-accent outline-none"
                />
                <input
                  type="text"
                  value={res.name}
                  onChange={(e) => updateRanking(res.id, { name: e.target.value })}
                  placeholder="Winner Name"
                  className="w-full bg-transparent border-none text-xs font-semibold text-white outline-none"
                />
                <input
                  type="text"
                  value={res.school}
                  onChange={(e) => updateRanking(res.id, { school: e.target.value })}
                  placeholder="School Name"
                  className="w-full bg-transparent border-none text-[10px] font-medium text-muted outline-none"
                />
              </div>
              <button
                onClick={() => deleteRanking(res.id)}
                className="p-2 text-muted hover:text-danger opacity-0 group-hover/res:opacity-100 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

type AdminTab = 'sessions' | 'schedule' | 'categories' | 'members' | 'sponsors' | 'notices' | 'gallery' | 'settings';

interface AdminPanelProps {
  sessions: Session[];
  schedule: ScheduleItem[];
  categories: Committee[];
  notices: Notice[];
  gallery: GalleryItem[];
  culturalResults: Ranking[];
  members: Member[];
  members: Member[];
  sponsors: Sponsor[];
  profile: Profile | null;
  settings: Record<string, string>;
  refresh: () => void;
  onBack: () => void;
}

export default function AdminPanel({
  sessions,
  schedule,
  categories,
  notices,
  gallery,
  culturalResults,
  members,
  sponsors,
  profile,
  settings,
  refresh,
  onBack
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('sessions');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSupabaseError = (err: any, context: string) => {
    console.error(`Error ${context}:`, err);
    setErrorMsg(`${context}: ${err.message || 'Unexpected error'}`);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onBack();
  };

  // Generic direct database modifiers
  const addItem = async (table: string, data: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.from(table).insert([data]);
      if (error) throw error;
      refresh();
    } catch (err) {
      handleSupabaseError(err, `Adding to ${table}`);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (table: string, id: any, updates: any) => {
    try {
      const { error } = await supabase.from(table).update(updates).eq('id', id);
      if (error) throw error;
      refresh();
    } catch (err) {
      handleSupabaseError(err, `Updating in ${table}`);
    }
  };

  const deleteItem = async (table: string, id: any) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      refresh();
    } catch (err) {
      handleSupabaseError(err, `Deleting from ${table}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col lg:flex-row relative">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col flex-shrink-0 z-50">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-accent rounded-1.5xl flex items-center justify-center text-bg shadow-lg shadow-accent/20">
              <Shield size={20} />
            </div>
            <div>
              <h1 className="text-sm font-display text-white tracking-widest uppercase">Console</h1>
              <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{profile?.email?.split('@')[0] || 'Admin'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {[
            { id: 'sessions', label: 'Sessions', icon: Activity },
            { id: 'schedule', label: 'Timeline', icon: Calendar },
            { id: 'categories', label: 'Committees', icon: Layers },
            { id: 'members', label: 'Conference Team', icon: Users },
            { id: 'sponsors', label: 'Sponsors', icon: Heart },
            { id: 'notices', label: 'Notices', icon: Bell },
            { id: 'gallery', label: 'Media', icon: ImageIcon },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-ui text-[10px] font-bold uppercase tracking-widest",
                activeTab === item.id 
                  ? "bg-accent text-bg shadow-lg shadow-accent/10"
                  : "text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={16} />
              {item.label}
              {activeTab === item.id && <ChevronRight className="ml-auto" size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-muted font-ui text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
          >
            <Layout size={16} /> Close Terminal
          </button>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-danger/60 font-ui text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 hover:text-danger transition-all mt-1"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto lg:h-screen custom-scrollbar relative bg-bg-dark">
        <header className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5 h-32 flex items-center px-8 lg:px-12 justify-between">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-accent border border-white/5 shadow-2xl">
              {activeTab === 'sessions' && <Activity size={24} />}
              {activeTab === 'schedule' && <Calendar size={24} />}
              {activeTab === 'categories' && <Layers size={24} />}
              {activeTab === 'members' && <Users size={24} />}
              {activeTab === 'notices' && <Bell size={24} />}
              {activeTab === 'gallery' && <ImageIcon size={24} />}
              {activeTab === 'sponsors' && <Heart size={24} />}
              {activeTab === 'settings' && <Settings size={24} />}
            </div>
            <div>
              <h2 className="text-2xl font-display text-white uppercase tracking-wider">{activeTab.toUpperCase()}</h2>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mt-1">Management Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                switch(activeTab) {
                  case 'sessions':
                    const targetId = selectedCategory || (categories.length > 0 ? categories[0].id : null);
                    if (targetId) addItem('matches', { committee_id: targetId, session_no: sessions.length + 1, status: 'upcoming', venue: 'Main Hall' });
                    break;
                  case 'schedule':
                    addItem('schedule', { title: 'New Event', day_label: 'Day 1', time_start: '09:00 AM', venue: 'Room 201', status: 'upcoming', sort_order: schedule.length });
                    break;
                  case 'categories':
                    addItem('committees', { name: 'New Committee', slug: 'new-committee', icon: '🏛️', sort_order: categories.length });
                    break;
                  case 'members':
                    addItem('members', { name: 'New Member', role: 'Role', category: 'OC', sort_order: members.length });
                    break;
                  case 'notices':
                    addItem('notices', { title: 'New Notice', content: 'Content here...', priority: 'medium' });
                    break;
                  case 'gallery':
                    addItem('gallery', { title: 'New Media', type: 'image', url: 'https://', year: 2026 });
                    break;
                  case 'sponsors':
                    addItem('sponsors', { name: 'New Sponsor', tier: 'Partner', sort_order: sponsors.length });
                    break;
                }
              }}
              className="px-6 py-3 bg-accent text-bg rounded-xl text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-accent/20"
            >
              <Plus size={16} /> New {activeTab.replace(/s$/, '')}
            </button>
            <button
              onClick={refresh}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-muted hover:text-accent transition-all"
            >
              <Activity size={18} />
            </button>
          </div>
        </header>

        <div className="p-8 lg:p-12 pb-32 max-w-[1600px] mx-auto">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-12 p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] flex items-center justify-between gap-6"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
                   <AlertCircle size={24} />
                </div>
                <div>
                   <h4 className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">System Error</h4>
                   <p className="text-red-300 font-medium">{errorMsg}</p>
                </div>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-red-500/40 hover:text-red-500 transition-colors">
                 <X size={20} />
              </button>
            </motion.div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-12">
               {/* Search & Filter Bar */}
               <div className="bg-surface border border-white/5 p-4 rounded-[2.5rem] flex flex-col gap-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search sessions, committees, venues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-14 py-5 text-sm text-white outline-none focus:border-accent/40 transition-all font-medium"
                    />
                    <Activity className="absolute left-6 top-1/2 -translate-y-1/2 text-muted" size={20} />
                  </div>
                  
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                       <button
                         onClick={() => setSelectedCategory(null)}
                         className={cn(
                           "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                           !selectedCategory ? "bg-accent text-bg shadow-lg" : "bg-white/5 text-muted hover:text-white"
                         )}
                       >
                         All Categories
                       </button>
                       {categories.map(cat => (
                         <button
                           key={cat.id}
                           onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                           className={cn(
                             "px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                             selectedCategory === cat.id ? "bg-accent text-bg shadow-lg" : "bg-white/5 text-muted hover:text-white"
                           )}
                         >
                           {cat.name}
                         </button>
                       ))}
                    </div>
                    <button
                      onClick={() => {
                        const targetId = selectedCategory || (categories.length > 0 ? categories[0].id : null);
                        if (!targetId) {
                          handleSupabaseError({ message: "Please create a committee first." }, "Add Session");
                          return;
                        }
                        addItem('matches', { committee_id: targetId, session_no: sessions.length + 1, status: 'upcoming', venue: 'Main Hall' });
                      }}
                      className="bg-accent/80 hover:bg-accent text-bg px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-accent/10 whitespace-nowrap flex items-center gap-2"
                    >
                      <Plus size={16} /> Add Session
                    </button>
                  </div>
               </div>

               {/* Committee Based List */}
               {categories.map(cat => {
                 const catSessions = sessions.filter(s => s.committee_id === cat.id);
                 if (selectedCategory && selectedCategory !== cat.id) return null;
                 return (
                   <div key={cat.id} className="space-y-6">
                      <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">
                              {cat.icon || '🏆'}
                           </div>
                           <div>
                              <h3 className="text-3xl font-display text-white uppercase tracking-wider">{cat.name}</h3>
                              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">{catSessions.length} Active Records</p>
                           </div>
                        </div>
                        <button
                          onClick={() => addItem('matches', { committee_id: cat.id, session_no: catSessions.length + 1, status: 'upcoming', venue: 'Main Hall' })}
                          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-accent hover:text-bg border border-white/5 hover:border-accent rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          <Plus size={16} /> Add Session
                        </button>
                      </div>

                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {catSessions.map(s => (
                          <motion.div
                             layout
                             key={s.id}
                             className="bg-surface border border-white/5 rounded-[2.5rem] p-8 space-y-8 group hover:border-accent/20 transition-all shadow-2xl"
                          >
                             <div className="flex items-start justify-between">
                               <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/5">
                                     <span className="text-[9px] font-bold text-muted uppercase">SESS</span>
                                     <input
                                       type="number"
                                       value={s.session_no}
                                       onChange={(e) => updateItem('matches', s.id, { session_no: parseInt(e.target.value) })}
                                       className="bg-transparent border-none text-2xl font-bold text-white text-center outline-none w-10 p-0"
                                     />
                                  </div>
                                  <div className="space-y-1">
                                     <div className="flex items-center gap-3">
                                        <select
                                          value={s.status}
                                          onChange={(e) => updateItem('matches', s.id, { status: e.target.value })}
                                          className="bg-accent/10 border border-accent/20 text-accent text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full outline-none"
                                        >
                                          <option value="upcoming">Upcoming</option>
                                          <option value="live">Live</option>
                                          <option value="completed">Completed</option>
                                        </select>
                                        <input
                                          type="text"
                                          value={s.venue || ''}
                                          placeholder="Enter Venue..."
                                          onChange={(e) => updateItem('matches', s.id, { venue: e.target.value })}
                                          className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-muted outline-none focus:text-white transition-colors"
                                        />
                                     </div>
                                  </div>
                               </div>
                               <button onClick={() => deleteItem('matches', s.id)} className="p-3 text-white/10 hover:text-danger hover:bg-danger/10 rounded-xl transition-all">
                                  <Trash2 size={20} />
                               </button>
                             </div>

                             <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                   <Trophy size={18} className="text-accent" />
                                   <input
                                     type="text"
                                     value={s.outstanding_delegate || ''}
                                     placeholder="Current Standings / Active Updates..."
                                     onChange={(e) => updateItem('matches', s.id, { outstanding_delegate: e.target.value })}
                                     className="bg-transparent border-none text-sm font-medium text-white outline-none w-full"
                                   />
                                </div>
                             </div>
                          </motion.div>
                        ))}
                      </div>
                   </div>
                 );
               })}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'categories' && (
              <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                {categories.map(cat => (
                  <CategoryEditor
                    key={cat.id}
                    cat={cat}
                    culturalResults={culturalResults} members={members}
                    onRefresh={refresh}
                    handleSupabaseError={handleSupabaseError}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-surface border border-white/5 p-6 rounded-[2rem] space-y-4">
                  {schedule.map(si => (
                    <div key={si.id} className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row items-center gap-8 group hover:border-accent/20 transition-all">
                      <div className="flex items-center gap-4 w-full lg:w-48">
                         <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-accent/50 group-hover:text-accent transition-colors">
                            <Clock size={16} />
                         </div>
                         <input
                          type="text"
                          value={si.day_label || ''}
                          onChange={(e) => updateItem('schedule', si.id, { day_label: e.target.value })}
                          className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-accent outline-none"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        <input
                          type="text"
                          value={si.title}
                          onChange={(e) => updateItem('schedule', si.id, { title: e.target.value })}
                          className="bg-transparent border-none text-sm font-bold text-white outline-none w-full"
                          placeholder="Event Title"
                        />
                        <input
                          type="text"
                          value={si.time_start || ''}
                          placeholder="Time (e.g., 09:00 AM)"
                          onChange={(e) => updateItem('schedule', si.id, { time_start: e.target.value })}
                          className="bg-transparent border-none text-[10px] font-bold text-muted outline-none focus:text-white"
                        />
                        <input
                          type="text"
                          value={si.venue || ''}
                          placeholder="Venue / Room"
                          onChange={(e) => updateItem('schedule', si.id, { venue: e.target.value })}
                          className="bg-transparent border-none text-[10px] font-bold text-muted outline-none focus:text-white"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                         <select
                            value={si.status}
                            onChange={(e) => updateItem('schedule', si.id, { status: e.target.value })}
                            className="bg-white/10 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white outline-none"
                         >
                            <option value="upcoming">Upcoming</option>
                            <option value="live">Live</option>
                            <option value="completed">Completed</option>
                         </select>
                         <button onClick={() => deleteItem('schedule', si.id)} className="p-3 text-white/10 hover:text-danger hover:bg-danger/10 rounded-xl transition-all">
                            <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div key="members" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {members.map(m => (
                  <div key={m.id} className="bg-surface border border-white/5 rounded-[2.5rem] p-8 space-y-8 group hover:border-accent/20 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                        {m.image_url ? (
                          <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                             <Users size={32} />
                             <span className="text-[8px] font-bold uppercase">No Image</span>
                          </div>
                        )}
                      </div>
                      <button onClick={() => deleteItem('members', m.id)} className="p-3 text-white/10 hover:text-danger hover:bg-danger/10 rounded-xl transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Full Name</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => updateItem('members', m.id, { name: e.target.value })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-accent/40"
                          placeholder="Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Official Role</label>
                        <input
                          type="text"
                          value={m.role}
                          onChange={(e) => updateItem('members', m.id, { role: e.target.value })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-accent outline-none focus:border-accent/40"
                          placeholder="Role"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Category</label>
                           <select
                              value={m.category}
                              onChange={(e) => updateItem('members', m.id, { category: e.target.value })}
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-bold text-muted outline-none focus:border-accent/40"
                           >
                              <option value="Secretariat">Secretariat</option>
                              <option value="EB">Executive Board</option>
                              <option value="OC">Organizing Committee</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Assign Committee</label>
                           <select
                              value={m.committee_id || ''}
                              onChange={(e) => updateItem('members', m.id, { committee_id: e.target.value || null })}
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-bold text-muted outline-none focus:border-accent/40"
                           >
                              <option value="">No Committee</option>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                           </select>
                        </div>
                                                <div className="col-span-2 space-y-2">
                           <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Personal Message (for Secretariat)</label>
                           <textarea
                              value={m.message || ''}
                              placeholder="A message to the delegates..."
                              onChange={(e) => updateItem('members', m.id, { message: e.target.value })}
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-medium text-white outline-none focus:border-accent/40 min-h-[100px] resize-none"
                           />
                        </div>

                        <div className="col-span-2 space-y-2">
                           <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Image URL</label>
                           <input
                              type="text"
                              value={m.image_url || ''}
                              placeholder="https://..."
                              onChange={(e) => updateItem('members', m.id, { image_url: e.target.value })}
                              className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-medium text-white outline-none focus:border-accent/40"
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'sponsors' && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {sponsors.map(s => (
                    <div key={s.id} className="bg-surface border border-white/5 rounded-[2.5rem] p-8 space-y-8 group hover:border-accent/20 transition-all shadow-2xl">
                      <div className="h-32 rounded-3xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-6 relative group">
                        {s.logo_url ? <img src={s.logo_url} className="max-w-full max-h-full object-contain" /> : <div className="text-muted flex flex-col items-center gap-2"><Heart size={32} /><span className="text-[8px] font-bold">NO LOGO</span></div>}
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Sponsor Name</label>
                           <input
                            type="text"
                            value={s.name}
                            onChange={(e) => updateItem('sponsors', s.id, { name: e.target.value })}
                            className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none w-full text-center focus:border-accent/40"
                          />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Tier / Level</label>
                           <input
                            type="text"
                            placeholder="Platinum / Gold / etc"
                            value={s.tier || ''}
                            onChange={(e) => updateItem('sponsors', s.id, { tier: e.target.value })}
                            className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-bold uppercase tracking-[0.3em] text-accent outline-none w-full text-center focus:border-accent/40"
                          />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold text-muted uppercase tracking-widest pl-1">Logo URL</label>
                           <input
                            type="text"
                            value={s.logo_url || ''}
                            placeholder="https://..."
                            onChange={(e) => updateItem('sponsors', s.id, { logo_url: e.target.value })}
                            className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[9px] font-medium text-white outline-none w-full focus:border-accent/40"
                          />
                        </div>
                        <button onClick={() => deleteItem('sponsors', s.id)} className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-red-500/10">
                          Remove Sponsor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notices' && (
              <div className="space-y-6">
                {notices.map(n => (
                  <div key={n.id} className="bg-surface border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={n.title}
                        onChange={(e) => updateItem('notices', n.id, { title: e.target.value })}
                        className="bg-transparent border-none text-2xl font-display text-white outline-none flex-1"
                        placeholder="Notice Title"
                      />
                      <div className="flex items-center gap-4">
                        <select
                          value={n.priority}
                          onChange={(e) => updateItem('notices', n.id, { priority: e.target.value })}
                          className="bg-white/5 px-4 py-2 rounded-xl text-[10px] font-bold uppercase text-accent outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <button onClick={() => deleteItem('notices', n.id)} className="p-3 text-muted hover:text-danger hover:bg-danger/10 rounded-xl">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={n.content}
                      onChange={(e) => updateItem('notices', n.id, { content: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl p-6 text-sm text-muted font-medium min-h-[150px] outline-none"
                      placeholder="Markdown content..."
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {gallery.map(item => (
                  <div key={item.id} className="bg-surface border border-white/5 rounded-[2.5rem] p-6 space-y-6 group">
                     <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 relative">
                        <img src={item.url} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => deleteItem('gallery', item.id)}
                          className="absolute top-4 right-4 p-3 bg-bg-dark/60 backdrop-blur-xl text-white/40 hover:text-danger rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                     </div>
                     <div className="space-y-4">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem('gallery', item.id, { title: e.target.value })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none"
                          placeholder="Media Title"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            value={item.type}
                            onChange={(e) => updateItem('gallery', item.id, { type: e.target.value })}
                            className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold uppercase text-accent outline-none"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                          <input
                            type="number"
                            value={item.year || 2026}
                            onChange={(e) => updateItem('gallery', item.id, { year: parseInt(e.target.value) })}
                            className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-bold text-center text-white outline-none"
                          />
                        </div>
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => updateItem('gallery', item.id, { url: e.target.value })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-[10px] font-medium text-muted outline-none"
                          placeholder="URL (https://...)"
                        />
                     </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-12">
                <div className="bg-surface border border-white/5 rounded-[3rem] p-10 space-y-12 shadow-2xl">
                   <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-12">
                        {[
                          { key: 'festival_name', label: 'Conference Name', desc: 'Main title' },
                          { key: 'festival_subtitle', label: 'Subtitle', desc: 'Supporting tagline' },
                        ].map(s => (
                           <div key={s.key} className="space-y-4">
                              <div className="flex flex-col">
                                <label className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">{s.label}</label>
                                <p className="text-[10px] text-muted font-medium mb-4">{s.desc}</p>
                              </div>
                              <input
                                type="text"
                                value={settings[s.key] || ''}
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  await supabase.from('settings').upsert({ key_name: s.key, val }, { onConflict: 'key_name' });
                                  refresh();
                                }}
                                className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-6 text-sm text-white font-semibold outline-none focus:border-accent/40 transition-all"
                              />
                           </div>
                        ))}
                      </div>
                      <div className="space-y-12">
                        {[
                          { key: 'festival_dates', label: 'Venue & Dates', desc: 'Location' },
                          { key: 'announcement_text', label: 'Banner Alerts', desc: 'Scrolling text' },
                        ].map(s => (
                           <div key={s.key} className="space-y-4">
                              <div className="flex flex-col">
                                <label className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">{s.label}</label>
                                <p className="text-[10px] text-muted font-medium mb-4">{s.desc}</p>
                              </div>
                              <input
                                type="text"
                                value={settings[s.key] || ''}
                                onChange={async (e) => {
                                  const val = e.target.value;
                                  await supabase.from('settings').upsert({ key_name: s.key, val }, { onConflict: 'key_name' });
                                  refresh();
                                }}
                                className="w-full bg-white/5 border border-white/5 rounded-[1.5rem] p-6 text-sm text-white font-semibold outline-none focus:border-accent/40 transition-all"
                              />
                           </div>
                        ))}
                      </div>
                   </div>
                   
                   <div className="pt-12 border-t border-white/5 space-y-6">
                      <div className="flex flex-col">
                        <label className="font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-accent mb-1">Footer & Branding</label>
                        <p className="text-[10px] text-muted font-medium mb-4">Site-wide footer and school identity</p>
                      </div>
                      <textarea
                        value={settings['footer_text'] || ''}
                        placeholder="Footer text or legal credits..."
                        onChange={async (e) => {
                          const val = e.target.value;
                          await supabase.from('settings').upsert({ key_name: 'footer_text', val }, { onConflict: 'key_name' });
                          refresh();
                        }}
                        className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 text-sm text-white font-medium outline-none focus:border-accent/40 transition-all min-h-[150px] resize-none"
                      />
                   </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/40 backdrop-blur-sm pointer-events-none">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="text-accent animate-spin" size={40} />
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Syncing with DB...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
