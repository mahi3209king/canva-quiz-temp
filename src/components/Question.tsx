import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { THEME } from '../styles/theme';
import { HelpCircle } from 'lucide-react';

export const Question: React.FC<{ text: string }> = ({ text }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const entrance = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const translateY = interpolate(entrance, [0, 1], [40, 0]);
    const opacity = interpolate(entrance, [0, 1], [0, 1]);

    return (
        <div
            style={{
                width: '90%',
                padding: '60px 40px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: THEME.borderRadius,
                border: `2px solid ${THEME.surfaceBorder}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '30px',
                opacity,
                transform: `translateY(${translateY}px) scale(${entrance})`,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                marginBottom: '60px',
            }}
        >
            <div style={{
                backgroundColor: THEME.primary,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 0 20px ${THEME.primary}44`,
            }}>
                <HelpCircle size={40} color="white" />
            </div>
            <div
                style={{
                    textAlign: 'center',
                    color: THEME.text,
                    fontSize: '64px',
                    fontWeight: '900',
                    lineHeight: 1.1,
                    letterSpacing: '-1px',
                }}
            >
                {text}
            </div>
        </div>
    );
};
