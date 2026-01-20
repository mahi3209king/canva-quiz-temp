import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { THEME } from '../styles/theme';

export const AnswerReveal: React.FC<{ isVisible: boolean; correctOption: string }> = ({ isVisible, correctOption }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame: frame - 165,
        fps,
        config: { damping: 10, stiffness: 100 },
    });

    if (!isVisible) return null;

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: entrance,
                transform: `translateY(${interpolate(entrance, [0, 1], [20, 0])}px)`,
            }}
        >
            <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: THEME.primary,
                textTransform: 'uppercase',
                letterSpacing: '4px',
                marginBottom: '10px'
            }}>
                Correct Answer
            </div>
            <div style={{
                fontSize: '80px',
                fontWeight: '900',
                color: THEME.text,
                textShadow: `0 0 40px ${THEME.primary}44`,
                textAlign: 'center',
                padding: '0 40px'
            }}>
                {correctOption}
            </div>
        </div>
    );
};
