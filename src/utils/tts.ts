import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import * as googleTTS from 'google-tts-api';

dotenv.config();

export type TTSProvider = 'openai' | 'elevenlabs' | 'gtts';

export async function generateTTS(text: string, filename: string, provider: TTSProvider = 'gtts'): Promise<string> {
  const audioDir = path.join(process.cwd(), 'public/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const filePath = path.join(audioDir, filename);

  // If file already exists, skip (cache logic)
  if (fs.existsSync(filePath)) return `audio/${filename}`;

  if (provider === 'openai') {
    return await generateOpenAITTS(text, filePath, filename);
  } else if (provider === 'elevenlabs') {
    return await generateElevenLabsTTS(text, filePath, filename);
  } else {
    return await generateGTTS(text, filePath, filename);
  }
}

async function generateGTTS(text: string, filePath: string, filename: string): Promise<string> {
  const url = googleTTS.getAudioUrl(text, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com',
  });

  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(filePath, Buffer.from(response.data));
  return `audio/${filename}`;
}

async function generateOpenAITTS(text: string, filePath: string, filename: string): Promise<string> {
  // ... existing implementation
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing');

  const response = await axios.post(
    'https://api.openai.com/v1/audio/speech',
    { model: 'tts-1', input: text, voice: 'alloy' },
    { headers: { Authorization: `Bearer ${apiKey}` }, responseType: 'arraybuffer' }
  );

  fs.writeFileSync(filePath, Buffer.from(response.data));
  return `audio/${filename}`;
}

async function generateElevenLabsTTS(text: string, filePath: string, filename: string): Promise<string> {
  // ... existing implementation
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00Tcm4TlvDq8ikWAM';
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is missing');

  const response = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    { text, model_id: 'eleven_monolingual_v1' },
    { headers: { 'xi-api-key': apiKey }, responseType: 'arraybuffer' }
  );

  fs.writeFileSync(filePath, Buffer.from(response.data));
  return `audio/${filename}`;
}

