-- 🔥 THE NUCLEAR OPTION: FRESH START 🔥
-- Run this if you want to blow everything up and start clean.

-- 1. DROP EVERYTHING
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.battles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CREATE PROFILES (The foundation)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    username TEXT UNIQUE,
    avatar_url TEXT,
    role TEXT DEFAULT 'player',
    stats JSONB DEFAULT '{"vattlesPlayed": 0, "wins": 0, "losses": 0, "mmr": 1200}'::jsonb,
    rank_tier TEXT DEFAULT 'silver',
    is_founder BOOLEAN DEFAULT true,
    is_war_starter BOOLEAN DEFAULT false,
    vibe_analysis TEXT,
    achievements JSONB DEFAULT '[]'::jsonb,
    portfolio JSONB DEFAULT '[]'::jsonb,
    showcase JSONB DEFAULT '[]'::jsonb,
    prompt_library JSONB DEFAULT '[]'::jsonb,
    profile_theme TEXT DEFAULT 'default'
);

-- 3. CREATE BATTLES
CREATE TABLE public.battles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    theme TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'standard',
    opponent_type TEXT NOT NULL DEFAULT 'player',
    time_limit INTEGER NOT NULL,
    creator_id UUID, -- Can be NULL for Guest created battles or links to profiles
    creator_name TEXT NOT NULL,
    opponent_id UUID,
    opponent_name TEXT DEFAULT 'Open Invite',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, active, voting, completed
    start_time TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT false,
    winner_id UUID,
    github_repo_url TEXT
);

-- 4. CREATE SUBMISSIONS (The code payload)
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    battle_id UUID REFERENCES public.battles ON DELETE CASCADE,
    user_id UUID,
    user_name TEXT,
    html_code TEXT,
    css_code TEXT,
    js_code TEXT,
    screenshot_url TEXT,
    votes INTEGER DEFAULT 0
);

-- 5. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 6. PERMISSIVE POLICIES (For MVP Speed)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR ALL USING (true); -- Broad for testing

CREATE POLICY "Battles are viewable by everyone" ON public.battles FOR SELECT USING (true);
CREATE POLICY "Anyone can create battles" ON public.battles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update battles" ON public.battles FOR UPDATE USING (true);

CREATE POLICY "Submissions are viewable by everyone" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT WITH CHECK (true);

-- 7. ENABLE REALTIME
-- This is critical for the "Live" feel
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE battles, submissions, profiles;
COMMIT;
