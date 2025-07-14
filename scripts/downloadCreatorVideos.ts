import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { supabase } from '../lib/supabase-admin'; // Using admin to run outside of app context
import slugify from 'slugify';
import 'dotenv/config'; // To load .env.local

const OUTPUT_DIR = path.join(process.cwd(), 'migrations', 'videos');

// Helper to create a directory if it doesn't exist
const ensureDirExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const downloadVideo = (url: string, creatorSlug: string, videoNumber: number): boolean => {
    const creatorDir = path.join(OUTPUT_DIR, creatorSlug);
    const outputPath = path.join(creatorDir, `${videoNumber}.mp4`);
    
    // Command to download the video using yt-dlp
    // -o specifies the output template
    // We are forcing it to mp4 for consistency
    const command = `yt-dlp -o "${outputPath}" --force-overwrites -f "best[ext=mp4]/best" "${url}"`;

    try {
        console.log(`  Downloading video #${videoNumber} from: ${url}`);
        execSync(command, { stdio: 'pipe' }); // Use 'pipe' to hide yt-dlp's verbose output
        console.log(`  ✅ Successfully downloaded to ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`  ❌ FAILED to download video from ${url}.`);
        // The error object from execSync might contain useful info in stderr
        const execError = error as { stderr?: Buffer };
        if (execError.stderr) {
            console.error(`  Reason: ${execError.stderr.toString()}`);
        } else {
            console.error(error);
        }
        return false;
    }
};

const main = async () => {
    console.log('Starting creator video download script...');
    ensureDirExists(OUTPUT_DIR);

    // 1. Fetch all creators who have videos
    const { data: creators, error } = await supabase
        .from('creators')
        .select('name, username, video_portfolio')
        .not('video_portfolio', 'is', null);

    if (error) {
        console.error('❌ Error fetching creators from Supabase:', error);
        return;
    }

    if (!creators || creators.length === 0) {
        console.log('No creators with videos found. Exiting.');
        return;
    }

    console.log(`Found ${creators.length} creators with videos to process.`);

    for (const creator of creators) {
        const creatorName = creator.name || creator.username || 'unknown-creator';
        const slug = slugify(creatorName, { lower: true, strict: true });
        const creatorDir = path.join(OUTPUT_DIR, slug);
        ensureDirExists(creatorDir);
        
        console.log(`\nProcessing videos for: ${creatorName} (Folder: ${slug})`);

        if (!creator.video_portfolio || !Array.isArray(creator.video_portfolio) || creator.video_portfolio.length === 0) {
            console.log('  No videos found for this creator, skipping.');
            continue;
        }

        let downloadedCount = 0;
        for (let i = 0; i < creator.video_portfolio.length; i++) {
            const videoUrl = creator.video_portfolio[i];
            if (typeof videoUrl === 'string' && videoUrl.trim()) {
                if (downloadVideo(videoUrl, slug, i + 1)) {
                    downloadedCount++;
                }
            } else {
                 console.log(`  Skipping invalid video entry: ${videoUrl}`);
            }
        }
        
        console.log(`\n✅ Finished processing for ${creatorName}. Downloaded ${downloadedCount} of ${creator.video_portfolio.length} videos.`);
    }

    console.log('\n\nScript finished.');
};

main().catch(console.error); 