import fs from 'fs';
import path from 'path';

function escapeString(str: string): string {
  if (!str) return '';
  return str.replace(/'/g, "''").replace(/\\/g, '\\\\');
}

function generateSQLFromJSON() {
  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'creators-import.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    const creators = JSON.parse(jsonContent);

    console.log(`Converting ${creators.length} creators to SQL...`);

    // Generate SQL
    let sql = `-- Clear existing creators\nDELETE FROM creators;\n\n`;
    sql += `-- Insert ${creators.length} creators from CSV\n\n`;

    for (const creator of creators) {
      const videoPortfolioJson = JSON.stringify(creator.video_portfolio || []);
      
      sql += `INSERT INTO creators (
  name, 
  username, 
  email, 
  whatsapp_number, 
  industry, 
  category, 
  video_portfolio, 
  instagram_profile, 
  tiktok_profile, 
  bio, 
  status, 
  location, 
  avatar_url
) VALUES (
  '${escapeString(creator.name)}',
  '${escapeString(creator.username)}',
  '${escapeString(creator.email)}',
  '${escapeString(creator.whatsapp_number)}',
  '${escapeString(creator.industry)}',
  '${escapeString(creator.category)}',
  '${escapeString(videoPortfolioJson)}'::jsonb,
  ${creator.instagram_profile ? `'${escapeString(creator.instagram_profile)}'` : 'NULL'},
  ${creator.tiktok_profile ? `'${escapeString(creator.tiktok_profile)}'` : 'NULL'},
  '${escapeString(creator.bio)}',
  '${escapeString(creator.status)}',
  '${escapeString(creator.location)}',
  '${escapeString(creator.avatar_url)}'
);\n\n`;
    }

    // Write SQL file
    const sqlPath = path.join(process.cwd(), 'supabase', 'import-creators.sql');
    fs.writeFileSync(sqlPath, sql);

    console.log(`✅ SQL file created: ${sqlPath}`);
    console.log(`\nTo apply to Supabase:`);
    console.log(`1. Copy the SQL content from ${sqlPath}`);
    console.log(`2. Go to your Supabase SQL Editor`);
    console.log(`3. Paste and run the SQL`);

  } catch (error) {
    console.error('Error generating SQL:', error);
  }
}

// Run the conversion
generateSQLFromJSON(); 