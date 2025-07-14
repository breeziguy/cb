-- Add missing profile fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS instagram_profile TEXT,
ADD COLUMN IF NOT EXISTS tiktok_profile TEXT,
ADD COLUMN IF NOT EXISTS twitter_profile TEXT,
ADD COLUMN IF NOT EXISTS facebook_profile TEXT; 