-- Player stats table: one row per player + video + event_type combo
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

-- RLS (allow all for prototype)
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on player_stats"
  ON player_stats FOR ALL
  USING (true)
  WITH CHECK (true);
