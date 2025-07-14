import fs from 'fs';
import path from 'path';

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

function escapeString(str: string): string {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

async function bulkInsertCreators() {
  try {
    // Load environment variables
    loadEnvFile();
    
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'creators-import.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const creators = JSON.parse(jsonContent);

    console.log(`Bulk inserting ${creators.length} creators...`);

    // Generate SQL for all creators
    let valuesArray = [];
    
    for (const creator of creators) {
      const videoPortfolioJson = JSON.stringify(creator.video_portfolio || []);
      
      const values = `(
        '${escapeString(creator.name)}',
        '${escapeString(creator.username)}',
        '${escapeString(creator.bio)}',
        '${escapeString(creator.avatar_url)}',
        '${escapeString(creator.whatsapp_number)}',
        '${escapeString(creator.category)}',
        '${escapeString(creator.location)}',
        '${escapeString(creator.status)}',
        '${escapeString(creator.email)}',
        '${escapeString(creator.industry)}',
        '${escapeString(videoPortfolioJson)}'::jsonb,
        ${creator.instagram_profile ? `'${escapeString(creator.instagram_profile)}'` : 'NULL'},
        ${creator.tiktok_profile ? `'${escapeString(creator.tiktok_profile)}'` : 'NULL'}
      )`;
      
      valuesArray.push(values);
    }

    // Create the full SQL
    const sql = `INSERT INTO creators (
      name, 
      username, 
      bio, 
      avatar_url, 
      whatsapp_number, 
      category, 
      location, 
      status,
      email,
      industry,
      video_portfolio,
      instagram_profile,
      tiktok_profile
    ) VALUES 
    ${valuesArray.join(',\n')};`;

    // Write SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'bulk-insert-creators.sql');
    fs.writeFileSync(sqlPath, sql);

    console.log(`✅ Bulk insert SQL file created: ${sqlPath}`);
    console.log(`\nTo apply to Supabase:`);
    console.log(`1. Copy the SQL content from ${sqlPath}`);
    console.log(`2. Go to your Supabase SQL Editor`);
    console.log(`3. Paste and run the SQL`);
    console.log(`\nOr use the MCP tools to execute directly.`);

  } catch (error) {
    console.error('Error generating bulk insert SQL:', error);
  }
}

// Run the conversion
bulkInsertCreators(); 