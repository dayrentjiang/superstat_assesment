-- Switch videos from soft delete to hard delete.
-- First, permanently remove any previously soft-deleted videos (cascade removes their events, stats, summaries).
DELETE FROM videos WHERE deleted_at IS NOT NULL;

-- Drop the soft-delete column and its index
DROP INDEX IF EXISTS idx_videos_deleted_at;
ALTER TABLE videos DROP COLUMN IF EXISTS deleted_at;
