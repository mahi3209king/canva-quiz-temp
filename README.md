# 🎬 Advanced YouTube Shorts Quiz Automator

A professional, fully automated video pipeline to create viral quiz content.

## ✨ New Features
- **Decorative UI**: Modern glassmorphism design with animated background glows.
- **Full Video Support**: Automatically sequence all questions into a single long Short.
- **Free AI Voice**: Integrated **gTTS** (Google Text-to-Speech) - no API keys required!
- **Engagement Triggers**: Circular countdown timers, staggered entry animations, and correct answer highlight glows.
- **Progress Tracking**: Dynamic progress bar and question numbering (e.g., "1/5").
- **Premium Typography**: Uses the 'Outfit' Google Font for a clean, bold look.

## 🚀 Quick Start

1. **Install**:
   ```bash
   npm install
   ```
2. **Setup Audio** (Preview version):
   Run this once to generate voices for the browser preview:
   ```bash
   npm run setup-audio
   ```
3. **Preview**:
   ```bash
   npm start
   ```
4. **Render Everything**:
   ```bash
   npm run bulk-render
   ```

## 🛠️ Composition IDs
- `FullQuiz`: Sequences all quizzes from your JSON into one video.
- `SingleQuiz`: Renders just one specific quiz (good for testing).

## ⚙️ Customization
- **Change Content**: Edit `src/data/quizzes.json`.
- **Change Colors/Timing**: Edit `src/styles/theme.ts`.
- **Change Voice/Icons**: Modify components in `src/components/`.

---
Created by Antigravity AI
