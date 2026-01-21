import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import quizzes from '../src/data/quizzes.json';
import { TIMING } from '../src/styles/theme';

const start = async () => {
  console.log('🚀 Starting Render Pipeline...');
  
  const entry = path.join(process.cwd(), 'src/index.tsx');
  
  console.log('📦 Bundling project...');
  // Fixed signature for bundle
  const bundleLocation = await bundle(entry);

  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  // --- 🎬 Render Full Quiz Video ---
  const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/config.json'), 'utf8'));
  const isLandscape = config.templateId === 'landscape_industrial';
  const compositionId = isLandscape ? 'FullLandscapeQuiz' : 'FullQuiz';

  console.log(`🎬 Rendering Full Quiz Video (${isLandscape ? 'Landscape' : 'Shorts'})...`);
  const fullOutput = path.join(outDir, `full_quiz.mp4`);
  
  const fullComposition = await selectComposition({
    id: compositionId,
    inputProps: {},
    serveUrl: bundleLocation,
  });

  await renderMedia({
    composition: fullComposition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: fullOutput,
    concurrency: 8,
  });


  console.log(`✅ Success! Full Video: ${fullOutput}`);
  console.log('🎉 All tasks completed!');
};

start().catch((err) => {
  console.error('❌ Error during render:', err);
  process.exit(1);
});
