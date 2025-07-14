import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

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

async function importRemainingCreators() {
  try {
    // Load environment variables
    loadEnvFile();
    
    // Initialize Supabase client with service role key for admin access
    const supabaseUrl = 'https://fjwnrirrcysdbrfaajnl.supabase.co';
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqd25yaXJyY3lzZGJyZmFham5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNzI3MzMsImV4cCI6MjA1NTc0ODczM30.GgqZ1jQDYQGXdFsn8Ggma6ZY6WQ6TXHdmqtMk04AOmc';
    
    if (!supabaseServiceKey) {
      throw new Error('Missing Supabase service key');
    }
    
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);
    
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'creators-import.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const creators = JSON.parse(jsonContent);

    console.log(`Importing ${creators.length} creators...`);

    // Clear existing creators first
    const { error: deleteError } = await supabase
      .from('creators')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (deleteError) {
      console.error('Error clearing existing creators:', deleteError);
    } else {
      console.log('✅ Existing creators cleared');
    }

    // Convert creators to database format
    const creatorsToInsert = creators.map((creator: any) => ({
      name: creator.name,
      username: creator.username,
      bio: creator.bio,
      avatar_url: creator.avatar_url,
      whatsapp_number: creator.whatsapp_number,
      category: creator.category,
      location: creator.location,
      status: creator.status,
      email: creator.email,
      industry: creator.industry,
      video_portfolio: creator.video_portfolio,
      instagram_profile: creator.instagram_profile,
      tiktok_profile: creator.tiktok_profile
    }));

    // Insert creators in batches
    const batchSize = 20;
    let totalInserted = 0;
    
    for (let i = 0; i < creatorsToInsert.length; i += batchSize) {
      const batch = creatorsToInsert.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase
          .from('creators')
          .insert(batch)
          .select();
        
        if (error) {
          console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
          console.log('Sample creator from failed batch:', batch[0]);
          break;
        } else {
          totalInserted += batch.length;
          console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} creators) - Total: ${totalInserted}`);
        }
      } catch (batchError) {
        console.error(`Network error inserting batch ${Math.floor(i / batchSize) + 1}:`, batchError);
        break;
      }
    }
    
    console.log(`\n🎉 Successfully imported ${totalInserted} creators to database!`);
    
    // Verify the count
    const { count, error: countError } = await supabase
      .from('creators')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`✅ Verification: Database now contains ${count} creators`);
    }

  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Run the import
importRemainingCreators(); 