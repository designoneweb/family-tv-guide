-- Add completed flag to tv_progress table
-- Tracks when a user has watched all episodes of a show

ALTER TABLE tv_progress
ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN tv_progress.completed IS 'True when user has watched the final episode of the final season';
