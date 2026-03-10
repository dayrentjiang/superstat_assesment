-- Add soft delete column to players
ALTER TABLE players ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX idx_players_deleted_at ON players(deleted_at);
