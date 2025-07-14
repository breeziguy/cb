import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';
// @ts-ignore - csv-parser doesn't have TypeScript definitions
import csv from 'csv-parser';

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value;
        }
      }
    }
  }
}

// Better CSV parsing utility that handles multiline content
function parseCSV(csvContent: string): any[] {
  const rows: string[][] = [];
  const lines = csvContent.split('\n');
  
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;
  
  // Parse the entire CSV content character by character
  while (i < csvContent.length) {
    const char = csvContent[i];
    
    if (char === '"') {
      if (inQuotes && csvContent[i + 1] === '"') {
        // Handle escaped quotes
        currentField += '"';
        i += 2;
        continue;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField.trim());
      if (currentRow.length > 0 && currentRow.some(field => field.length > 0)) {
        rows.push([...currentRow]);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
    
    i++;
  }
  
  // Add the last field and row if any
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length > 0 && currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }
  
  if (rows.length === 0) return [];
  
  // Extract headers and create objects
  const headers = rows[0].map(h => h.replace(/"/g, '').trim());
  const data: any[] = [];
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length >= headers.length) {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] ? row[index].replace(/"/g, '').trim() : '';
      });
      data.push(obj);
    }
  }
  
  return data;
}

// Function to generate username from name
function generateUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 30) + '_' + Math.random().toString(36).substring(2, 8);
}

// Function to categorize industry
function categorizeIndustry(industry: string): string {
  const industryLower = industry.toLowerCase();
  
  if (industryLower.includes('beauty') || industryLower.includes('skincare')) {
    return 'Beauty';
  } else if (industryLower.includes('fashion')) {
    return 'Fashion';
  } else if (industryLower.includes('lifestyle')) {
    return 'Lifestyle';
  } else if (industryLower.includes('health') || industryLower.includes('wellness')) {
    return 'Health & Wellness';
  } else if (industryLower.includes('food')) {
    return 'Food';
  } else if (industryLower.includes('tech')) {
    return 'Technology';
  } else if (industryLower.includes('finance')) {
    return 'Finance';
  } else if (industryLower.includes('travel')) {
    return 'Travel';
  } else {
    return 'General/Personal Brand';
  }
}

// Function to parse video portfolio links
function parseVideoPortfolio(videoLinks: string): string[] {
  if (!videoLinks || videoLinks.trim() === '') return [];
  
  // Split by common separators and clean up
  return videoLinks
    .split(/[\n,]/)
    .map(link => link.trim())
    .filter(link => link && (
      link.includes('tiktok.com') || 
      link.includes('instagram.com') || 
      link.includes('youtube.com') ||
      link.includes('facebook.com')
    ))
    .slice(0, 5); // Limit to 5 video links
}

// Function to normalize phone number
function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 234, keep as is
  if (cleaned.startsWith('234')) {
    return `+${cleaned}`;
  }
  
  // If it starts with 0, replace with 234
  if (cleaned.startsWith('0')) {
    return `+234${cleaned.substring(1)}`;
  }
  
  // If it starts with 8 or 9 (common Nigerian numbers), prepend 234
  if (cleaned.startsWith('8') || cleaned.startsWith('9')) {
    return `+234${cleaned}`;
  }
  
  // Otherwise, assume it needs 234 prefix
  return `+234${cleaned}`;
}

// Phone number formatting function
function formatPhone(phone: string): string {
  if (!phone || phone.trim() === '') return '';
  
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("234")) return `+${digits}`;
  if (digits.startsWith("0")) return `+234${digits.slice(1)}`;
  return `+234${digits}`;
}

// Extract work URLs from the multi-line work field
function extractWorkUrls(workText: string): string[] {
  if (!workText) return [];
  
  // Split by newlines and filter out URLs
  const urls = workText
    .split(/[\n\r]+/)
    .map(line => line.trim())
    .filter(line => 
      line.includes('http') || 
      line.includes('www.') || 
      line.includes('tiktok.com') || 
      line.includes('youtube.com') ||
      line.includes('instagram.com')
    )
    .slice(0, 3); // Take first 3 URLs
  
  return urls;
}

interface CreatorRow {
  'Full Name': string;
  '  Email Address  ': string;
  '  Phone Number (WhatsApp preferred)  ': string;
  '  What industry do you mostly create content for?  ': string;
  'Drop 3 links to your best video content': string;
  'Instagram Profile Link': string;
  'TikTok Profile Link': string;
}

async function importCreators() {
  try {
    // Load environment variables
    loadEnvFile();
    
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
    
    // First, clear existing creators
    console.log('Clearing existing creators...');
    const { error: deleteError } = await supabase
      .from('creators')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (deleteError) {
      console.error('Error clearing existing creators:', deleteError);
    } else {
      console.log('✅ Existing creators cleared');
    }
    
    const creators: any[] = [];
    
    return new Promise<void>((resolve, reject) => {
      fs.createReadStream('Untitled form copy.csv')
        .pipe(csv())
        .on('data', (row: CreatorRow) => {
          try {
            const name = row['Full Name']?.trim();
            const email = row['  Email Address  ']?.trim();
            const phone = row['  Phone Number (WhatsApp preferred)  ']?.trim();
            const industry = row['  What industry do you mostly create content for?  ']?.trim();
            const workText = row['Drop 3 links to your best video content']?.trim();
            const instagramUrl = row['Instagram Profile Link']?.trim();
            const tiktokUrl = row['TikTok Profile Link']?.trim();
            
            // Skip rows with no name
            if (!name) return;
            
            const workUrls = extractWorkUrls(workText);
            const formattedPhone = formatPhone(phone);
            
            const creator = {
              name,
              username: generateUsername(name),
              bio: null,
              avatar_url: null,
              cover_image_url: null,
              whatsapp_number: formattedPhone || null,
              phone: formattedPhone || null,
              email: email || null,
              industry: industry || null,
              category: industry || 'General/Personal Brand',
              work_url: workUrls.join('\n') || null,
              work_embed: null, // Will be processed later
              profile_image: null,
              instagram_profile: instagramUrl || null,
              tiktok_profile: tiktokUrl || null,
              video_portfolio: workUrls.length > 0 ? workUrls : [],
              platforms: {
                instagram: instagramUrl || null,
                tiktok: tiktokUrl || null
              },
              followers_count: 0,
              engagement_rate: 0.0,
              location: null,
              price_range: null,
              portfolio_images: [],
              status: 'active'
            };
            
            creators.push(creator);
          } catch (error) {
            console.error('Error processing row:', error, row);
          }
        })
        .on('end', async () => {
          try {
            console.log(`Processing ${creators.length} creators...`);
            
            // Insert creators in batches to avoid overwhelming the database
            const batchSize = 10;
            for (let i = 0; i < creators.length; i += batchSize) {
              const batch = creators.slice(i, i + batchSize);
              
              const { data, error } = await supabase
                .from('creators')
                .upsert(batch, { 
                  onConflict: 'email',
                  ignoreDuplicates: false 
                });
              
              if (error) {
                console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
              } else {
                console.log(`✅ Inserted batch ${i / batchSize + 1} (${batch.length} creators)`);
              }
            }
            
            console.log('🎉 Creator import completed!');
            resolve();
          } catch (error) {
            console.error('Error during batch insert:', error);
            reject(error);
          }
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run the import
importCreators()
  .then(() => {
    console.log('Import finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  }); 