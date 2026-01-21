import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME, TIMING } from '../styles/theme';
import config from '../data/config.json';
import { TEMPLATES } from '../data/templates';

export const IntroHook: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    const introText = config.introHook || "";
    const lines = introText.split('\n').filter(l => l.trim() !== "");

    const selectedTemplate = (TEMPLATES as any)[config.templateId] || TEMPLATES.modern_dark;
    const colors = selectedTemplate.colors;

    // Divide duration by number of lines
    const framesPerLine = durationInFrames / lines.length;

    return (
        <AbsoluteFill style={{
            background: config.bgImage ? `url(${staticFile(config.bgImage)}) center/cover no-repeat` : 'linear-gradient(to bottom, #112244, #051020)',
            fontFamily: THEME.fontFamily,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        }}>
            {/* Audio for intro hook */}
            <Audio src={staticFile("audio/intro_hook.mp3")} />

            {/* Background Light Effects */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.1) 0%, transparent 70%)',
                opacity: 0.5
            }} />

            {lines.map((line, index) => {
                const startFrame = index * framesPerLine;
                const endFrame = (index + 1) * framesPerLine;

                // Entrance animation
                const entrance = spring({
                    frame: frame - startFrame,
                    fps,
                    config: { damping: 12 }
                });

                // Exit animation (starts 10 frames before the end of the line)
                const exit = spring({
                    frame: frame - (endFrame - 10),
                    fps,
                    config: { damping: 12 }
                });

                const opacity = interpolate(frame,
                    [startFrame, startFrame + 10, endFrame - 10, endFrame],
                    [0, 1, 1, 0],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
                );

                const scale = interpolate(entrance - exit, [0, 1], [0.8, 1]);

                if (frame >= startFrame && frame < endFrame) {
                    return (
                        <div key={index} style={{
                            position: 'absolute',
                            width: '80%',
                            textAlign: 'center',
                            opacity,
                            transform: `scale(${scale})`,
                            fontSize: '80px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            color: '#fff',
                            textShadow: '0 0 20px #00ccff, 4px 4px 0px #000',
                            WebkitTextStroke: '2px #00ccff',
                            lineHeight: 1.2
                        }}>
                            {line}
                        </div>
                    );
                }
                return null;
            })}
        </AbsoluteFill>
    );
};
