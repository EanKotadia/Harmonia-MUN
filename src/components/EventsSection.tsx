import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Committee, Session, Member } from '../types';
import { Info, X, ArrowRight, FileText, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface EventsSectionProps {
  categories: Committee[];
  matches: Session[];
  members: Member[];
  setActiveTab: (tab: string) => void;
}

export default function EventsSection({ categories, matches, members, setActiveTab }: EventsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expandedCategory = categories.find(c => c.id === expandedId);
  const committeeEB = members.filter(m => m.committee_id === expandedId && m.category === 'EB');

  const generalGuidelines = [
    "Formal Western Attire or National Dress is mandatory for all conference sessions.",
    "Delegates must adhere to the Harmonia MUN Code of Conduct at all times.",
    "Position Papers must be submitted at least 48 hours before the first session to be eligible for awards.",
    "Electronic devices are permitted for research but should not impede active participation during moderated caucus.",
    "All resolutions and amendments must be drafted on the official conference portal.",
    "Background Guides should be thoroughly reviewed prior to the commencement of the conference."
  ];

  const renderEventCard = (cat: Committee) => {
    return (
      <motion.div
        key={cat.id}
        layoutId={`card-${cat.id}`}
        onClick={() => setExpandedId(cat.id)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white/5 border border-border rounded-[32px] p-8 flex flex-col h-full hover:border-accent/30 transition-all group cursor-pointer"
      >
        <div className="flex items-start justify-between mb-6">
          <motion.div layoutId={`icon-${cat.id}`} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform overflow-hidden">
            {cat.icon || '🏆'}
          </motion.div>
          <div className="text-right">
            <span className="font-ui text-[10px] font-bold uppercase tracking-widest text-muted block mb-1">
              MUN Committee
            </span>
          </div>
        </div>

        <motion.h3 layoutId={`title-${cat.id}`} className="text-3xl font-display uppercase tracking-wider mb-4">{cat.name}</motion.h3>

        <div className="mb-8">
          <p className="text-muted text-sm line-clamp-2">{cat.description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between text-accent font-ui text-[10px] font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
          Explore Committee Details
          <ArrowRight size={14} />
        </div>
      </motion.div>
    );
  };

  return (
    <div id="events" className="max-w-7xl mx-auto px-6 py-24 space-y-32">
      <AnimatePresence>
        {expandedId && expandedCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpandedId(null)}
              className="absolute inset-0 bg-bg-dark/95 backdrop-blur-xl"
            />

            <motion.div
              layoutId={`card-${expandedId}`}
              className="relative w-full max-w-5xl max-h-[90vh] bg-bg2 border border-border rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
            >
              <button
                onClick={() => setExpandedId(null)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all z-10"
              >
                <X size={24} />
              </button>

              <div className="overflow-y-auto p-8 md:p-16 space-y-12">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                  <div className="flex-1 space-y-12 w-full">
                    <div className="flex items-center gap-8">
                      <motion.div layoutId={`icon-${expandedId}`} className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center text-6xl overflow-hidden">
                        {expandedCategory.icon || '🛡️'}
                      </motion.div>
                      <div>
                        <span className="font-ui text-xs font-bold uppercase tracking-[0.3em] text-accent mb-2 block">
                          Conference Committee
                        </span>
                        <motion.h2 layoutId={`title-${expandedId}`} className="text-5xl md:text-7xl font-display uppercase tracking-tighter">
                          {expandedCategory.name}
                        </motion.h2>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-xl font-display uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Info className="text-accent" size={20} />
                            About the Committee
                          </h4>
                          <div className="bg-white/5 border border-border rounded-3xl p-8">
                            <p className="text-text/70 leading-relaxed whitespace-pre-line">
                              {expandedCategory.description || 'Information for this committee will be updated soon.'}
                            </p>
                          </div>
                        </div>

                        {expandedCategory.bg_guide_url && (
                          <div className="pt-4">
                             <h4 className="text-xl font-display uppercase tracking-widest mb-6 flex items-center gap-3">
                                <FileText className="text-accent" size={20} />
                                Resources
                             </h4>
                             <a
                                href={expandedCategory.bg_guide_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-bg font-ui text-[10px] font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-xl shadow-accent/20"
                             >
                                <FileText size={16} />
                                Background Guide (PDF)
                             </a>
                          </div>
                        )}
                      </div>

                      <div className="space-y-8">
                         <h4 className="text-xl font-display uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Users className="text-accent" size={20} />
                            Executive Board
                         </h4>
                         <div className="space-y-4">
                            {committeeEB.length > 0 ? committeeEB.map(member => (
                               <div key={member.id} className="flex items-center gap-6 p-6 bg-white/5 border border-white/5 rounded-2xl">
                                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-bg-dark border border-white/10 shrink-0">
                                     <img src={member.image_url || ''} alt={member.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                     <p className="font-display text-xl text-white uppercase tracking-wider">{member.name}</p>
                                     <p className="font-ui text-[10px] font-bold uppercase tracking-widest text-accent">{member.role}</p>
                                  </div>
                               </div>
                            )) : (
                               <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">EB Members to be announced</p>
                               </div>
                            )}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* General Guidelines */}
      <section>
        <div className="mb-16">
          <p className="sec-label">Rules & Instructions</p>
          <h2 className="text-6xl md:text-8xl">General Guidelines</h2>
          <p className="text-muted mt-4 text-lg">Essential information for all participants.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-border p-10 rounded-3xl">
            <ul className="space-y-6">
              {generalGuidelines.slice(0, 3).map((item, i) => (
                <li key={i} className="flex gap-4 text-text/80 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white/5 border border-border p-10 rounded-3xl">
            <ul className="space-y-6">
              {generalGuidelines.slice(3).map((item, i) => (
                <li key={i} className="flex gap-4 text-text/80 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section>
          <div className="mb-16">
            <p className="sec-label">Committee Hall</p>
            <h2 className="text-6xl md:text-8xl tracking-tight">The Committees</h2>
            <p className="text-muted mt-4 text-lg max-w-2xl">From the Security Council to Human Rights, explore the bodies shaping international discourse.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map(renderEventCard)}
          </div>
        </section>
      )}
    </div>
  );
}
