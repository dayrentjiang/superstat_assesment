-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Videos table
create table videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  video_url text not null,
  created_at timestamptz default now()
);

-- Players table
create table players (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamptz default now()
);

-- Events table
create table events (
  id uuid primary key default uuid_generate_v4(),
  video_id uuid not null references videos(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  event_type text not null,
  timestamp double precision not null,
  created_at timestamptz default now()
);

-- Indexes
create index idx_events_video_id on events(video_id);
create index idx_events_player_id on events(player_id);

-- RLS: enabled with allow-all policies (no auth for prototype)
alter table videos enable row level security;
alter table players enable row level security;
alter table events enable row level security;

create policy "Allow all on videos" on videos for all using (true) with check (true);
create policy "Allow all on players" on players for all using (true) with check (true);
create policy "Allow all on events" on events for all using (true) with check (true);

-- Storage bucket for videos (run this in Supabase SQL editor or create via dashboard)
-- insert into storage.buckets (id, name, public) values ('videos', 'videos', true);
