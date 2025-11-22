-- Create users table to store user names
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create planted_flowers table to store all user-drawn flowers
CREATE TABLE IF NOT EXISTS public.planted_flowers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  drawing_data TEXT NOT NULL, -- Base64 encoded canvas drawing
  x FLOAT NOT NULL,
  y FLOAT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planted_flowers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table (everyone can view, anyone can insert)
CREATE POLICY "users_select_all" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_insert_own" ON public.users FOR INSERT WITH CHECK (true);

-- RLS Policies for planted_flowers (everyone can view, users can insert their own)
CREATE POLICY "flowers_select_all" ON public.planted_flowers FOR SELECT USING (true);
CREATE POLICY "flowers_insert_own" ON public.planted_flowers FOR INSERT WITH CHECK (true);
CREATE POLICY "flowers_delete_own" ON public.planted_flowers FOR DELETE USING (true);
