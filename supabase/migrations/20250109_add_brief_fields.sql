-- Add new fields to briefs table for enhanced brief form
ALTER TABLE briefs 
ADD COLUMN IF NOT EXISTS product_for_content TEXT,
ADD COLUMN IF NOT EXISTS product_naira_value INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS product_website TEXT,
ADD COLUMN IF NOT EXISTS submission_fee INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS video_layout JSONB,
ADD COLUMN IF NOT EXISTS category JSONB,
ADD COLUMN IF NOT EXISTS platforms JSONB DEFAULT '[]';

-- Add comment to explain the new fields
COMMENT ON COLUMN briefs.product_for_content IS 'Product/service that the content will be created for';
COMMENT ON COLUMN briefs.product_naira_value IS 'Value of the product in Naira';
COMMENT ON COLUMN briefs.product_website IS 'Website URL for the product (optional)';
COMMENT ON COLUMN briefs.submission_fee IS 'Fee charged to submit the brief';
COMMENT ON COLUMN briefs.deliverables IS 'Selected video deliverable types';
COMMENT ON COLUMN briefs.video_layout IS 'Selected video layout/aspect ratio';
COMMENT ON COLUMN briefs.category IS 'Product category information';
COMMENT ON COLUMN briefs.platforms IS 'Selected platforms where content will be used'; 