-- ============================================================
-- Superstat — Complete Database Schema
-- Run this in Supabase SQL Editor to set up from scratch
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. Videos table
-- ============================================================
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. Players table
-- ============================================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX idx_players_deleted_at ON players(deleted_at);

-- ============================================================
-- 3. Events table
-- ============================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL,
  timestamp DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_video_id ON events(video_id);
CREATE INDEX idx_events_player_id ON events(player_id);

-- ============================================================
-- 4. Summaries table (one per video)
-- ============================================================
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE UNIQUE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_summaries_video_id ON summaries(video_id);

-- ============================================================
-- 5. Player stats table (one row per player + video + event_type)
-- ============================================================
CREATE TABLE player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  count INT NOT NULL DEFAULT 0,
  UNIQUE(player_id, video_id, event_type)
);

CREATE INDEX idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX idx_player_stats_video_id ON player_stats(video_id);

-- ============================================================
-- Row Level Security (allow all — no auth for prototype)
-- ============================================================
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on videos" ON videos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on summaries" ON summaries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on player_stats" ON player_stats FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Storage buckets (uncomment and run if not created via dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
