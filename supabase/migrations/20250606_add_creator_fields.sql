-- Add new fields to creators table
ALTER TABLE creators 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS video_portfolio JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS instagram_profile TEXT,
ADD COLUMN IF NOT EXISTS tiktok_profile TEXT; 