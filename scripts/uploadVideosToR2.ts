import fs from "fs";
import path from "path";
import { uploadToR2 } from "../lib/r2Uploader";
import { supabase } from '../lib/supabase-admin';
import slugify from "slugify";

const VIDEO_DIR = path.resolve("migrations/videos");

async function uploadAllVideos() {
  console.log("Starting video upload script...");

  // 1. Fetch all creators to create a mapping from slug to ID
  console.log("Fetching creator data from Supabase...");
  const { data: creators, error: fetchError } = await supabase
    .from("creators")
    .select("id, name, username");

  if (fetchError) {
    console.error("❌ Fatal: Could not fetch creators.", fetchError.message);
    return;
  }

  const slugToIdMap = new Map<string, string>();
  for (const creator of creators) {
    const creatorName = creator.name || creator.username || 'unknown-creator';
    const slug = slugify(creatorName, { lower: true, strict: true });
    slugToIdMap.set(slug, creator.id);
  }
  console.log(`✅ Found ${creators.length} creators. Mapping complete.`);

  // 2. Read the video directories
  const creatorFolders = fs.readdirSync(VIDEO_DIR);
  console.log(`Found ${creatorFolders.length} creator folders in ${VIDEO_DIR}`);

  // 3. Loop, upload, and update
  for (const creatorFolder of creatorFolders) {
    // Check if it's a directory
    const creatorPath = path.join(VIDEO_DIR, creatorFolder);
    if (!fs.statSync(creatorPath).isDirectory()) {
      continue;
    }

    const creatorId = slugToIdMap.get(creatorFolder);

    if (!creatorId) {
      console.warn(`⚠️ Skipping folder '${creatorFolder}': No matching creator found in database.`);
      continue;
    }

    console.log(`\nProcessing folder: ${creatorFolder}`);
    const files = fs.readdirSync(creatorPath);

    if (files.length === 0) {
      console.log(`  No videos found in '${creatorFolder}', skipping.`);
      continue;
    }

    const uploadedUrls: string[] = [];
    for (const fileName of files) {
      const fullPath = path.join(creatorPath, fileName);
      const fileBuffer = fs.readFileSync(fullPath);

      // Use a creator-specific path for R2
      const fileKey = `creators/${creatorFolder}/${fileName}`;
      
      try {
        console.log(`  Uploading ${fileName}...`);
        const url = await uploadToR2({
          fileBuffer,
          fileName: fileKey,
          contentType: "video/mp4", // Assuming all are mp4
        });
        uploadedUrls.push(url);
        console.log(`  ✅ Uploaded to ${url}`);
      } catch (uploadError) {
        console.error(`  ❌ Failed to upload ${fileName}:`, uploadError);
      }
    }

    if (uploadedUrls.length > 0) {
      // Update the creator's profile with the new R2 URLs
      console.log(`  Updating database for creator ID: ${creatorId}`);
      const { error: updateError } = await supabase
        .from("creators")
        .update({ video_portfolio: uploadedUrls }) // Use the correct column name
        .eq("id", creatorId);

      if (updateError) {
        console.error(`  ❌ Failed to update creator ${creatorFolder}:`, updateError.message);
      } else {
        console.log(`  ✅ Database updated for ${creatorFolder} with ${uploadedUrls.length} video(s).`);
      }
    }
  }

  console.log("\n🎉 All videos uploaded and profiles updated.");
}

uploadAllVideos().catch(console.error); 