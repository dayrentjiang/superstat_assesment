-- Summaries table (one per video, upserted on regenerate)
create table summaries (
  id uuid primary key default uuid_generate_v4(),
  video_id uuid not null references videos(id) on delete cascade unique,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_summaries_video_id on summaries(video_id);

alter table summaries enable row level security;
create policy "Allow all on summaries" on summaries for all using (true) with check (true);
