import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import quizzes from '../src/data/quizzes.json';
import { generateTTS } from '../src/utils/tts';
import { TIMING } from '../src/styles/theme';

const start = async () => {
  console.log('🚀 Starting bulk render with gTTS...');
  
  const entry = path.join(process.cwd(), 'src/index.tsx');
  
  console.log('📦 Bundling project...');
  const bundleLocation = await bundle({ entryPoint: entry });

  const audioPublicDir = path.join(process.cwd(), 'public/audio');
  if (!fs.existsSync(audioPublicDir)) {
    fs.mkdirSync(audioPublicDir, { recursive: true });
  }

  if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
  }

  // Render Full Quiz Video

  console.log('🎬 Rendering Full Quiz Video...');
  const fullOutput = path.join(process.cwd(), `out/full_quiz.mp4`);
  const fullComposition = await selectComposition({
    id: 'FullQuiz',
    inputProps: {},
    serveUrl: bundleLocation,
  });


  await renderMedia({
    composition: fullComposition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: fullOutput,
  });
  console.log(`✅ Finished Full Video: ${fullOutput}`);

  // Render Individual Clips (Optional)
  for (let i = 0; i < quizzes.length; i++) {
    const quiz = quizzes[i];
    const outputFile = path.join(process.cwd(), `out/quiz_${i + 1}.mp4`);
    
    console.log(`🎬 Rendering Single Clip ${i + 1}/${quizzes.length}`);

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'SingleQuiz',
      inputProps: { 
        quiz,
        audioUrls: {
            question: `audio/q_${i}.mp3`,
            answer: `audio/a_${i}.mp3`
        }
      },
    });


    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputFile,
    });
  }

  console.log('🎉 All tasks completed!');
};

start().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
