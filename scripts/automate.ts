import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generateMetadata, uploadToYoutube } from './youtube_upload';

async function main() {
    console.log('🚀 Starting Automated Pipeline...');

    const queuePath = path.join(process.cwd(), 'src/data/video_queue.json');
    if (!fs.existsSync(queuePath)) {
        console.error('❌ No video_queue.json found!');
        return;
    }

    const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    console.log(`📋 Found ${queue.length} videos in queue.`);

    for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        console.log(`\n🎬 [${i + 1}/${queue.length}] Processing: ${item.type.toUpperCase()} - ${item.templateId}`);

        // 1. Prepare data files
        fs.writeFileSync('src/data/quizzes.json', JSON.stringify(item.questions, null, 2));
        
        const config = JSON.parse(fs.readFileSync('src/data/config.json', 'utf8'));
        config.templateId = item.templateId;
        config.videoType = item.type; // Pass short or long
        fs.writeFileSync('src/data/config.json', JSON.stringify(config, null, 2));

        try {
            // 2. Setup Audio
            console.log('🎙️  Generating Audio...');
            execSync('npm run setup-audio', { stdio: 'inherit' });

            // 3. Setup Images
            console.log('🖼️  Setting up Images...');
            execSync('npm run setup-images', { stdio: 'inherit' });

            // 4. Render
            console.log('🎥 Rendering Video...');
            execSync('npm run bulk-render', { stdio: 'inherit' });

            const videoPath = path.join(process.cwd(), 'out/full_quiz.mp4');
            const newName = path.join(process.cwd(), `out/video_${i + 1}.mp4`);
            
            if (fs.existsSync(videoPath)) {
                fs.renameSync(videoPath, newName);
                console.log(`✅ Video saved as: ${newName}`);

                // 5. Generate AI Metadata
                console.log('🤖 Generating AI Metadata...');
                const metadata = await generateMetadata(item.questions);

                // 6. Upload to YouTube
                if (process.env.YOUTUBE_REFRESH_TOKEN) {
                    console.log('☁️  Uploading to YouTube...');
                    await uploadToYoutube(newName, metadata);
                } else {
                    console.log('⚠️  Skipping YouTube upload (missing YOUTUBE_REFRESH_TOKEN)');
                }
            }

        } catch (err) {
            console.error(`❌ Error processing video ${i + 1}:`, err);
        }
    }

    console.log('\n🎉 Automation cycle complete!');
}

main().catch(console.error);
