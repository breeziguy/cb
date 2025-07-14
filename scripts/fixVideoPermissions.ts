import { supabase } from '../lib/supabase-admin';
import { makeObjectPublic } from "../lib/r2Uploader";
import 'dotenv/config';

const R2_BUCKET = process.env.R2_BUCKET!;
const R2_ENDPOINT = process.env.R2_ENDPOINT!;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;

if (!R2_BUCKET || !R2_ENDPOINT || !R2_PUBLIC_URL) {
    throw new Error("R2 environment variables are not properly configured.");
}

// This is the prefix for the old, private URLs stored in the database.
// e.g., https://<endpoint>/<bucket>/...
const oldUrlPrefix = `${R2_ENDPOINT}/${R2_BUCKET}/`;

async function fixVideoPermissions() {
    console.log("Starting script to fix video permissions and URLs...");

    // 1. Fetch all creators with existing video portfolios
    const { data: creators, error: fetchError } = await supabase
        .from("creators")
        .select("id, name, video_portfolio")
        .not("video_portfolio", "is", null);
    
    if (fetchError) {
        console.error("❌ Fatal: Could not fetch creators.", fetchError.message);
        return;
    }

    if (!creators || creators.length === 0) {
        console.log("No creators with video portfolios found. Nothing to do.");
        return;
    }

    console.log(`Found ${creators.length} creators to process.`);

    for (const creator of creators) {
        if (!creator.video_portfolio || creator.video_portfolio.length === 0) {
            continue;
        }

        console.log(`\nProcessing creator: ${creator.name} (ID: ${creator.id})`);
        const newUrls: string[] = [];
        let successCount = 0;

        for (const oldUrl of creator.video_portfolio) {
            // 2. Extract the object key from the old URL
            if (!oldUrl.startsWith(oldUrlPrefix)) {
                console.warn(`  ⚠️ Skipping URL with unexpected format: ${oldUrl}`);
                // If the URL is already public, just add it and continue
                if (oldUrl.startsWith(R2_PUBLIC_URL)) {
                    newUrls.push(oldUrl);
                }
                continue;
            }
            const key = oldUrl.substring(oldUrlPrefix.length);

            try {
                // 3. Update the object's ACL in R2 to public-read
                await makeObjectPublic(key);

                // 4. Construct the new public URL
                const newUrl = `${R2_PUBLIC_URL}/${key}`;
                newUrls.push(newUrl);
                successCount++;
                console.log(`  ✅ Successfully updated permissions for: ${key}`);
            } catch (permError) {
                console.error(`  ❌ Failed to update permissions for key: ${key}`, permError);
                // Even if permissions fail, add the old URL back so we don't lose data
                newUrls.push(oldUrl);
            }
        }

        // 5. Update the database with the new array of public URLs
        if (successCount > 0) {
            console.log(`  Updating database with ${newUrls.length} new URLs...`);
            const { error: updateError } = await supabase
                .from("creators")
                .update({ video_portfolio: newUrls })
                .eq("id", creator.id);

            if (updateError) {
                console.error(`  ❌ Database update failed for ${creator.name}:`, updateError.message);
            } else {
                console.log(`  ✅ Database updated successfully for ${creator.name}.`);
            }
        } else {
            console.log(`  No videos were successfully updated for ${creator.name}, skipping database update.`);
        }
    }

    console.log("\n\n🎉 Script finished.");
}

fixVideoPermissions().catch(console.error); 