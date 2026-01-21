import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { THEME } from '../styles/theme';
import config from '../data/config.json';

export const InteractiveLine: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const text = (config as any).interactiveLine || "";

    const entrance = spring({
        frame,
        fps,
        config: { damping: 12 }
    });

    const opacity = interpolate(entrance, [0, 1], [0, 1]);
    const scale = interpolate(entrance, [0, 1], [0.8, 1]);

    return (
        <AbsoluteFill style={{
            background: 'linear-gradient(to bottom, #112244, #051020)',
            fontFamily: THEME.fontFamily,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
        }}>
            <Audio src={staticFile("audio/interactive_line.mp3")} />

            <div style={{
                width: '85%',
                textAlign: 'center',
                opacity,
                transform: `scale(${scale})`,
                fontSize: '90px',
                fontWeight: '900',
                textTransform: 'uppercase',
                color: '#fff',
                textShadow: '0 0 30px #00ff00, 4px 4px 0px #000',
                WebkitTextStroke: '3px #00ff00',
                lineHeight: 1.1,
                padding: '40px',
                backgroundColor: 'rgba(0,0,0,0.4)',
                borderRadius: '40px',
                border: '8px solid #fff',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                {text}
            </div>
        </AbsoluteFill>
    );
};
