-- Add soft delete column to videos
ALTER TABLE videos ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX idx_videos_deleted_at ON videos(deleted_at);
