-- Harmonia MUN 2026 Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cleanup existing objects
DROP TABLE IF EXISTS public.staged_changes CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.sponsors CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.notices CASCADE;
DROP TABLE IF EXISTS public.rankings CASCADE;
DROP TABLE IF EXISTS public.schedule CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.committees CASCADE;

-- Committees / Councils
CREATE TABLE public.committees (
  id text NOT NULL DEFAULT uuid_generate_v4()::text,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  bg_guide_url text,
  icon text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT committees_pkey PRIMARY KEY (id)
);

-- Committee Sessions
CREATE TABLE public.matches (
  id serial PRIMARY KEY,
  committee_id text REFERENCES public.committees(id) ON DELETE CASCADE,
  session_no integer,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  venue text,
  session_time timestamp with time zone,
  outstanding_delegate text,
  created_at timestamp with time zone DEFAULT now()
);

-- Conference Team Members
CREATE TABLE public.members (
  id serial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  image_url text,
  committee_id text REFERENCES public.committees(id) ON DELETE SET NULL,
  category text NOT NULL, -- Secretariat, EB, OC
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Conference Schedule
CREATE TABLE public.schedule (
  id serial PRIMARY KEY,
  day_label text, -- Day 1, Day 2
  day_date date,
  time_start text, -- Changed to text for more flexible admin input
  time_end text,
  title text NOT NULL,
  subtitle text,
  venue text,
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Rankings & Awards
CREATE TABLE public.rankings (
  id serial PRIMARY KEY,
  committee_id text REFERENCES public.committees(id) ON DELETE CASCADE,
  name text NOT NULL,
  school text NOT NULL,
  award text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Announcements
CREATE TABLE public.notices (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamp with time zone DEFAULT now()
);

-- Media Gallery
CREATE TABLE public.gallery (
  id serial PRIMARY KEY,
  title text NOT NULL,
  type text DEFAULT 'image' CHECK (type IN ('image', 'video')),
  url text NOT NULL,
  thumbnail_url text,
  year integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Sponsors
CREATE TABLE public.sponsors (
  id serial PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  tier text,
  website_url text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Site Configuration
CREATE TABLE public.settings (
  key_name text PRIMARY KEY,
  val text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- User Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  is_super_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Setup (PERMISSIVE - Use with caution in production)
-- For MVP/Development: We allow ALL operations to anyone for tables we don't strictly need to protect
-- This ensures the admin panel and public site work without permission road-blocks

ALTER TABLE public.committees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Creating permissive policies for all tables
-- USING (true) allow SELECT, WITH CHECK (true) allows INSERT/UPDATE

DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('committees', 'matches', 'members', 'schedule', 'rankings', 'notices', 'gallery', 'sponsors', 'settings', 'profiles')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Permissive Access %I" ON public.%I', tbl, tbl);
        EXECUTE format('CREATE POLICY "Permissive Access %I" ON public.%I FOR ALL USING (true) WITH CHECK (true)', tbl, tbl);
    END LOOP;
END $$;
