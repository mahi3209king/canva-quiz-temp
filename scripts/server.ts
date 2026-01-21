import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configure storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'bgm' ? 'public/audio' : 'public/images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// API: Save Quiz Data
app.post('/api/save-quiz', upload.fields([{ name: 'bgm', maxCount: 1 }, { name: 'bgImage', maxCount: 1 }]), (req: express.Request, res: express.Response) => {
  try {
    const { questions, templateId, endScreenMessage, introHook } = JSON.parse(req.body.data);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // ... paths ...
    const bgmPath = files.bgm ? `audio/${files.bgm[0].filename}` : null;
    const bgImagePath = files.bgImage ? `images/${files.bgImage[0].filename}` : null;

    // Update quizzes.json
    fs.writeFileSync('src/data/quizzes.json', JSON.stringify(questions, null, 2));

    // Update config.json
    const configData = JSON.parse(fs.readFileSync('src/data/config.json', 'utf8'));
    if (bgmPath) configData.bgm = bgmPath;
    if (bgImagePath) configData.bgImage = bgImagePath;
    if (templateId) configData.templateId = templateId;
    if (endScreenMessage) configData.endScreenMessage = endScreenMessage;
    if (introHook !== undefined) configData.introHook = introHook;
    
    fs.writeFileSync('src/data/config.json', JSON.stringify(configData, null, 2));

    res.json({ success: true, message: 'Settings saved! Audio generation starting...' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to cleanup temporary generated/uploaded files
const cleanupFiles = () => {
  console.log('🧹 Cleaning up temporary files...');
  const directories = ['public/audio', 'public/images'];
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
      if (file.startsWith('q_') || file.startsWith('a_') || file.startsWith('intro_hook') || file.startsWith('bgm-') || file.startsWith('bgImage-')) {
        try {
          fs.unlinkSync(path.join(dir, file));
        } catch (e) {
          console.error(`Failed to delete ${file}:`, e);
        }
      }
    });
  });

  // Reset config.json to defaults
  const defaultConfig = { bgm: null, bgImage: null, templateId: "modern_dark", endScreenMessage: "Comment your score below!", introHook: null };
  fs.writeFileSync('src/data/config.json', JSON.stringify(defaultConfig, null, 2));
  console.log('✨ Cleanup complete!');
};

// API: Trigger Rendering
app.post('/api/render', (req: express.Request, res: express.Response) => {
  console.log('🎬 Rendering process started via dashboard...');
  
  // 1. Audio Setup
  exec('npm run setup-audio', (audioErr, audioStdout, audioStderr) => {
    if (audioErr) {
      console.error('❌ Audio Setup Error:', audioStderr || audioStdout);
      return res.status(500).json({ success: false, error: 'Audio generation failed' });
    }

    console.log('🎙️ Audio ready, checking images...');
    
    // 2. Image Setup
    exec('npm run setup-images', (imgErr, imgStdout, imgStderr) => {
      if (imgErr) {
          console.warn('⚠️ Image Setup had issues, continuing anyway:', imgStderr);
      }
      console.log('🖼️ Image setup step finished.');
      
      // 3. Bulk Render
      exec('npm run bulk-render', (renderErr, renderStdout, renderStderr) => {
        if (renderErr) {
          console.error('❌ Render Error:', renderStderr || renderStdout);
          // Still cleanup to avoid leaving trash
          cleanupFiles();
          return res.status(500).json({ success: false, error: 'Video rendering failed. Check console for details.' });
        }
        
        cleanupFiles();
        console.log('✅ Render complete!');
        res.json({ success: true, message: 'Videos rendered successfully! Check the "out" folder.' });
      });
    });
  });

});

app.listen(port, () => {
  console.log(`🚀 Admin Dashboard Server at http://localhost:${port}`);
});
