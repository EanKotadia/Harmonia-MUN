export type Committee = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  bg_guide_url: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
};

export type SessionStatus = 'upcoming' | 'live' | 'completed';

export type Session = {
  id: number;
  committee_id: string;
  session_no: number;
  status: SessionStatus;
  venue: string | null;
  session_time: string | null;
  outstanding_delegate: string | null;
  created_at: string;
  committee?: Committee;
};

export type MemberCategory = 'Secretariat' | 'EB' | 'OC';

export type Member = {
  id: number;
  name: string;
  role: string;
  image_url: string | null;
  committee_id: string | null;
  category: MemberCategory;
  message: string | null;
  sort_order: number;
  created_at: string;
};

export type Ranking = {
  id: number;
  committee_id: string;
  name: string;
  school: string;
  award: string;
  created_at: string;
};

export type ScheduleStatus = 'upcoming' | 'live' | 'completed';

export type ScheduleItem = {
  id: number;
  day_label: string | null;
  day_date: string | null;
  time_start: string | null;
  time_end: string | null;
  title: string;
  subtitle: string | null;
  venue: string | null;
  status: ScheduleStatus;
  sort_order: number;
  created_at: string;
};

export type Notice = {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  thumbnail_url: string | null;
  year: number | null;
  created_at: string;
};

export type Sponsor = {
  id: number;
  name: string;
  logo_url: string | null;
  tier: string | null;
  website_url: string | null;
  sort_order: number;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  is_super_admin: boolean;
  created_at: string;
};

export type Setting = {
  key_name: string;
  val: string;
};
