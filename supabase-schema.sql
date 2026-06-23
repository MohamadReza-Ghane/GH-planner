-- GH Planner - Supabase Schema
-- این فایل را در Supabase SQL Editor اجرا کن

-- Tasks
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  stars numeric default 1,
  "order" integer default 0,
  created_at timestamptz default now()
);
alter table tasks enable row level security;
create policy "Users own tasks" on tasks for all using (auth.uid() = user_id);

-- Notes
create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text default '',
  content text default '',
  updated_at timestamptz default now()
);
alter table notes enable row level security;
create policy "Users own notes" on notes for all using (auth.uid() = user_id);

-- Progress
create table if not exists progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date_key text not null,
  checked_ids text[] default '{}',
  pct integer default 0,
  done_weight numeric default 0,
  total_weight numeric default 0,
  unique(user_id, date_key)
);
alter table progress enable row level security;
create policy "Users own progress" on progress for all using (auth.uid() = user_id);

-- Goals
create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text default '',
  progress integer default 0,
  target_date date,
  created_at timestamptz default now()
);
alter table goals enable row level security;
create policy "Users own goals" on goals for all using (auth.uid() = user_id);

-- Tracker
create table if not exists tracker (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date_key text not null,
  sleep_hours numeric default 7,
  energy_level numeric default 7,
  stress_level numeric default 3,
  study_hours numeric default 4,
  water_glasses numeric default 6,
  mood_score numeric default 7,
  unique(user_id, date_key)
);
alter table tracker enable row level security;
create policy "Users own tracker" on tracker for all using (auth.uid() = user_id);

-- Daily Plans
create table if not exists daily_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date_key text not null,
  title text not null,
  completed boolean default false,
  priority text default 'medium',
  weight numeric default 1,
  created_at timestamptz default now()
);
alter table daily_plans enable row level security;
create policy "Users own daily_plans" on daily_plans for all using (auth.uid() = user_id);

-- User Stats
create table if not exists user_stats (
  user_id uuid references auth.users primary key,
  xp integer default 0,
  level integer default 1,
  productivity_score integer default 0,
  focus_score integer default 0,
  life_score integer default 0,
  streak integer default 0,
  achievements integer default 0,
  updated_at timestamptz default now()
);
alter table user_stats enable row level security;
create policy "Users own stats" on user_stats for all using (auth.uid() = user_id);
