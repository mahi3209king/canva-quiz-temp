import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { QuizData } from '../src/types';
import quizzesImport from '../src/data/quizzes.json';

dotenv.config();

const quizzes = quizzesImport as QuizData[];
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Nano Banana Model (Gemini 2.5 Flash Image) 
 * Dedicated to direct image generation.
 */
async function generateAndSaveImage(answer: string, category: string, filename: string): Promise<boolean> {
    const imagesDir = path.join(process.cwd(), 'public/images');
    const localPath = path.join(imagesDir, filename);

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ No GEMINI_API_KEY found in .env");
        return false;
    }

    try {
        // Using "Nano Banana" model (Gemini 2.5 Flash Image)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
        
        console.log(`🤖 Nano Banana: Generating image for "${answer}"...`);
        
        const prompt = `A professional, high-quality photograph of ${answer} for a ${category} quiz. Realistic, high resolution, 4k.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Extract image part from response
        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts) throw new Error("No candidates in response");

        const imagePart = parts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
        
        if (imagePart?.inlineData?.data) {
            const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
            fs.writeFileSync(localPath, buffer);
            console.log(`✅ Nano Banana saved: ${filename}`);
            return true;
        } else {
            // Check if it returned a text response explaining why it didn't generate
            console.error(`❌ Nano Banana failed to produce image for "${answer}". Response: ${response.text()}`);
            return false;
        }

    } catch (err: any) {
        console.error(`❌ Nano Banana Error for "${answer}":`, err.message);
        return false;
    }
}

async function main() {
  console.log('🖼️ Checking for missing quiz images (Direct Nano Banana Gen)...');
  const imagesDir = path.join(process.cwd(), 'public/images');
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  let updated = false;

  for (let i = 0; i < quizzes.length; i++) {
    const quiz = quizzes[i];
    
    // Refresh if missing or placeholder
    const imagePath = quiz.image ? path.join(process.cwd(), 'public', quiz.image) : null;
    const fileMissing = !quiz.image || !fs.existsSync(imagePath!);
    const isPlaceholder = quiz.image?.includes('sample');

    if (fileMissing || isPlaceholder) {
        const answer = quiz.Answer || (quiz.options ? quiz.options[quiz.correctIndex!] : `item_${i}`);
        const safeName = answer.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
        const filename = `${safeName}_${Date.now()}.jpg`;

        const success = await generateAndSaveImage(answer, quiz.category || "General", filename);
        if (success) {
            quiz.image = `images/${filename}`;
            updated = true;
        }
    }
  }

  if (updated) {
    fs.writeFileSync('src/data/quizzes.json', JSON.stringify(quizzes, null, 2));
    console.log('✨ Data updated with direct Nano Banana generated images.');
  } else {
    console.log('✅ No images needed generation.');
  }
}

main().catch(console.error);
