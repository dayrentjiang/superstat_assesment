-- Allow team-level events (Timeout, Jump Ball, Shot Clock Violation)
-- that don't belong to a specific player.
ALTER TABLE events ALTER COLUMN player_id DROP NOT NULL;
