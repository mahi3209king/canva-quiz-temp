import { google } from 'googleapis';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const TOKEN_PATH = path.join(process.cwd(), 'token.json');

/**
 * Get authenticated service using local file or env vars
 */
async function getAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET
    );

    if (fs.existsSync(TOKEN_PATH)) {
        console.log('🔑 Using local token.json for authentication');
        const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
        oauth2Client.setCredentials(token);
    } else {
        console.log('🌐 Using environment variables for authentication');
        oauth2Client.setCredentials({
            refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
        });
    }

    return oauth2Client;
}

/**
 * Generate AI metadata for the video using Gemini
 */
export async function generateMetadata(questions: any[]) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const topic = questions[0]?.category || "Quiz";
    const prompt = `
        Generate YouTube metadata for a quiz video.
        Topic: ${topic}
        Questions: ${JSON.stringify(questions.map(q => q.question))}

        Return ONLY a JSON object: { "title": "...", "description": "...", "tags": "...", "topic": "..." }
        Rules:
        - Title: catchy, viral, <100 chars
        - Description: 3-4 engaging lines with emojis
        - Tags: comma-separated list of 20 trending SEO tags
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch (e) {
        return {
            title: `Can You Answer This ${topic} Quiz?`,
            description: "Test your knowledge in this amazing quiz! 🚀 Subscribe for more!",
            tags: "quiz,trivia,challenge",
            topic: topic
        };
    }
}

/**
 * Generate AI Thumbnail using Gemini
 */
async function generateThumbnail(topic: string) {
    console.log(`🖼️  Generating AI Thumbnail for: ${topic}`);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Generate a high-energy YouTube quiz thumbnail image for topic '${topic}'. Include bold large text 'GUESS THE ${topic.toUpperCase()}'. Bright colors, high contrast, 16:9 aspect ratio.`;
    
    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        
        if (imagePart?.inlineData?.data) {
            const thumbPath = path.join(process.cwd(), 'out/thumbnail.jpg');
            fs.writeFileSync(thumbPath, Buffer.from(imagePart.inlineData.data, 'base64'));
            return thumbPath;
        }
    } catch (e) {
        console.warn('⚠️ AI Thumbnail generation failed, skipping thumbnail upload.');
    }
    return null;
}

/**
 * Upload video to YouTube
 */
export async function uploadToYoutube(videoPath: string, metadata: any) {
    const auth = await getAuthClient();
    const youtube = google.youtube({ version: 'v3', auth });

    console.log(`☁️  Uploading "${metadata.title}" to YouTube...`);

    const res = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
            snippet: {
                title: metadata.title,
                description: metadata.description,
                tags: metadata.tags.split(','),
                categoryId: '27',
            },
            status: {
                privacyStatus: 'public',
                selfDeclaredMadeForKids: false,
            },
        },
        media: {
            body: fs.createReadStream(videoPath),
        },
    });

    const videoId = res.data.id;
    console.log(`✅ Upload Successful! Video ID: ${videoId}`);

    // --- Thumbnail Upload ---
    const thumbPath = await generateThumbnail(metadata.topic || "Quiz");
    if (thumbPath && videoId) {
        try {
            await youtube.thumbnails.set({
                videoId: videoId,
                media: {
                    body: fs.createReadStream(thumbPath),
                },
            });
            console.log('🖼️  Thumbnail uploaded successfully!');
        } catch (e) {
            console.error('❌ Thumbnail upload failed:', e);
        }
    }

    return res.data;
}
