import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { THEME } from '../styles/theme';

export const Timer: React.FC = () => {
    const frame = useCurrentFrame();

    const duration = 150; // 5 seconds
    const startFrame = 15;
    const endFrame = startFrame + duration;

    const progress = interpolate(frame, [startFrame, endFrame], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    if (frame > endFrame) return null;

    const seconds = Math.ceil(progress * 5);
    const size = 180;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - progress * circumference;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            marginTop: '20px'
        }}>
            <div style={{ position: 'relative', width: size, height: size }}>
                <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={THEME.surfaceBorder}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={progress < 0.3 ? THEME.accent : THEME.correct}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke 0.3s ease' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '70px',
                    fontWeight: '900',
                    color: THEME.text,
                    fontFamily: THEME.fontFamily
                }}>
                    {seconds}
                </div>
            </div>
        </div>
    );
};
