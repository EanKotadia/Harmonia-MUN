import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, ScheduleItem, Setting, Committee, GalleryItem, Notice, Ranking, Profile, Member, Sponsor } from '../types';

// Global cache to persist data across component remounts
const globalCache: {
  sessions: Session[] | null;
  schedule: ScheduleItem[] | null;
  settings: Record<string, string> | null;
  categories: Committee[] | null;
  gallery: GalleryItem[] | null;
  notices: Notice[] | null;
  culturalResults: Ranking[] | null;
  members: Member[] | null;
  sponsors: Sponsor[] | null;
} = {
  sessions: null,
  schedule: null,
  settings: null,
  categories: null,
  gallery: null,
  notices: null,
  culturalResults: null,
  members: null,
  sponsors: null,
};

// Retry logic for Supabase calls
const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  try {
    return await fn();
  } catch (e) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return withRetry(fn, retries - 1);
    }
    throw e;
  }
};

export function useHarmoniaMUNData() {
  const [sessions, setSessions] = useState<Session[]>(globalCache.sessions || []);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(globalCache.schedule || []);
  const [settings, setSettings] = useState<Record<string, string>>(globalCache.settings || {});
  const [categories, setCategories] = useState<Committee[]>(globalCache.categories || []);
  const [gallery, setGallery] = useState<GalleryItem[]>(globalCache.gallery || []);
  const [notices, setNotices] = useState<Notice[]>(globalCache.notices || []);
  const [culturalResults, setCulturalResults] = useState<Ranking[]>(globalCache.culturalResults || []);
  const [members, setMembers] = useState<Member[]>(globalCache.members || []);
  const [sponsors, setSponsors] = useState<Sponsor[]>(globalCache.sponsors || []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(!globalCache.categories);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      const { data } = await supabase!.from('matches').select('*, committee:committee_id(*)').order('id', { ascending: true });
      if (data) {
        setSessions(data);
        globalCache.sessions = data;
      }
    } catch (e) {
      console.warn('Sessions fetch error:', e);
    }
  };

  const fetchSchedule = async () => {
    try {
      const { data } = await supabase!.from('schedule').select('*').order('sort_order', { ascending: true });
      if (data) {
        setSchedule(data);
        globalCache.schedule = data;
      }
    } catch (e) {
      console.warn('Schedule fetch error:', e);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await supabase!.from('settings').select('*');
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((s: any) => settingsMap[s.key_name] = s.val);
        setSettings(settingsMap);
        globalCache.settings = settingsMap;
      }
    } catch (e) {
      console.warn('Settings fetch error:', e);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await supabase!.from('committees').select('*').order('sort_order', { ascending: true });
      if (data) {
        setCategories(data);
        globalCache.categories = data;
      }
    } catch (e) {
      console.warn('Categories fetch error:', e);
    }
  };

  const fetchGallery = async () => {
    try {
      const { data } = await supabase!.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) {
        setGallery(data);
        globalCache.gallery = data;
      }
    } catch (e) {
      console.warn('Gallery fetch error:', e);
    }
  };

  const fetchNotices = async () => {
    try {
      const { data } = await supabase!.from('notices').select('*').order('created_at', { ascending: false });
      if (data) {
        setNotices(data);
        globalCache.notices = data;
      }
    } catch (e) {
      console.warn('Notices fetch error:', e);
    }
  };

  const fetchCulturalResults = async () => {
    try {
      const { data } = await supabase!.from('rankings').select('*').order('created_at', { ascending: false });
      if (data) {
        setCulturalResults(data);
        globalCache.culturalResults = data;
      }
    } catch (e) {
      console.warn('Results fetch error:', e);
    }
  };

  const fetchMembers = async () => {
    try {
      const { data } = await supabase!.from('members').select('*').order('sort_order', { ascending: true });
      if (data) {
        setMembers(data);
        globalCache.members = data;
      }
    } catch (e) {
      console.warn('Members fetch error:', e);
    }
  };

  const fetchSponsors = async () => {
    try {
      const { data } = await supabase!.from('sponsors').select('*').order('sort_order', { ascending: true });
      if (data) {
        setSponsors(data);
        globalCache.sponsors = data;
      }
    } catch (e) {
      console.warn('Sponsors fetch error:', e);
    }
  };

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setProfile(null);
      return;
    }

    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
    } catch (e) {
      console.warn('Profile fetch error:', e);
    }
  };

  const fetchData = async (isInitial = false) => {
    if (isInitial && globalCache.categories) {
      setLoading(false);
      return;
    }

    if (!isInitial) setIsRefreshing(true);
    else setLoading(true);

    try {
      if (isInitial) {
        await withRetry(fetchProfile);
      }

      await Promise.all([
        withRetry(fetchSessions),
        withRetry(fetchSchedule),
        withRetry(fetchSettings),
        withRetry(fetchCategories),
        withRetry(fetchGallery),
        withRetry(fetchNotices),
        withRetry(fetchCulturalResults),
        withRetry(fetchMembers),
        withRetry(fetchSponsors),
      ]);
    } catch (e) {
      setError('Connection disrupted. Retrying...');
      console.error('Fetch data error:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!supabase) return;

    fetchData(true);

    // Set up real-time subscriptions
    const matchesSub = supabase.channel('matches-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, fetchSessions)
      .subscribe();

    const scheduleSub = supabase.channel('schedule-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'schedule' }, fetchSchedule)
      .subscribe();

    const settingsSub = supabase.channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchSettings)
      .subscribe();

    const categoriesSub = supabase.channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'committees' }, fetchCategories)
      .subscribe();

    const gallerySub = supabase.channel('gallery-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, fetchGallery)
      .subscribe();

    const noticesSub = supabase.channel('notices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, fetchNotices)
      .subscribe();

    const resultsSub = supabase.channel('rankings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rankings' }, fetchCulturalResults)
      .subscribe();

    const membersSub = supabase.channel('members-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, fetchMembers)
      .subscribe();

    const sponsorsSub = supabase.channel('sponsors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sponsors' }, fetchSponsors)
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(matchesSub);
        supabase.removeChannel(scheduleSub);
        supabase.removeChannel(settingsSub);
        supabase.removeChannel(categoriesSub);
        supabase.removeChannel(gallerySub);
        supabase.removeChannel(noticesSub);
        supabase.removeChannel(resultsSub);
        supabase.removeChannel(membersSub);
        supabase.removeChannel(sponsorsSub);
      }
    };
  }, []);

  const refresh = React.useCallback(() => fetchData(false), []);

  return { sessions, schedule, settings, categories, gallery, notices, culturalResults, members, sponsors, profile, loading, isRefreshing, error, refresh };
}
