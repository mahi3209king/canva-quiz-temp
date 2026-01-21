import { generateTTS } from '../src/utils/tts';
import { QuizData } from '../src/types';
import quizzesImport from '../src/data/quizzes.json';
const quizzes = quizzesImport as QuizData[];
import fs from 'fs';
import path from 'path';
import config from '../src/data/config.json';

async function main() {
  console.log('🎙️ Generating audio files for preview...');
  
  const audioDir = path.join(process.cwd(), 'public/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  // Generate Intro Hook if provided
  if (config.introHook) {
      console.log('🔊 Generating Intro Hook audio...');
      await generateTTS(config.introHook, 'intro_hook.mp3', 'gtts');
  }

  for (let i = 0; i < quizzes.length; i++) {
    const quiz = quizzes[i];
    console.log(`- Generating Q${i+1}`);
    const answerText = quiz.Answer || (quiz.options && quiz.correctIndex !== undefined ? quiz.options[quiz.correctIndex] : "");
    await generateTTS(quiz.question, `q_${i}.mp3`, 'gtts');
    if (answerText) {
        await generateTTS(`The correct answer is: ${answerText}`, `a_${i}.mp3`, 'gtts');
    }
  }
  
  console.log('✅ All audio files generated in public/audio/');
}

main().catch(console.error);
