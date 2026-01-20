import React from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { THEME } from '../styles/theme';
import { CheckCircle2, Circle } from 'lucide-react';

interface OptionProps {
    text: string;
    index: number;
    isSelected: boolean;
    isCorrect: boolean;
    reveal: boolean;
}

export const Option: React.FC<OptionProps> = ({ text, index, isCorrect, reveal }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Staggered entrance
    const startFrame = index * 5 + 15;
    const entrance = spring({
        frame: frame - startFrame,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const revealSpring = spring({
        frame: frame - 165,
        fps,
        config: { damping: 12 },
    });

    const backgroundColor = reveal && isCorrect
        ? THEME.correct
        : THEME.surface;

    const borderColor = reveal && isCorrect
        ? THEME.correct
        : THEME.surfaceBorder;

    const scale = interpolate(entrance, [0, 1], [0.8, 1]);
    const opacity = interpolate(entrance, [0, 1], [0, 1]);

    return (
        <div
            style={{
                width: '90%',
                padding: '30px',
                margin: '12px 0',
                backgroundColor,
                borderRadius: '24px',
                color: reveal && isCorrect ? '#000' : THEME.text,
                fontSize: '44px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `3px solid ${borderColor}`,
                opacity,
                transform: `scale(${scale})`,
                boxShadow: reveal && isCorrect ? `0 0 40px ${THEME.correct}66` : 'none',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: reveal && isCorrect ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '24px'
                }}>
                    {String.fromCharCode(65 + index)}
                </div>
                {text}
            </div>
            {reveal && isCorrect && <CheckCircle2 size={32} />}
            {!reveal && <Circle size={32} opacity={0.2} />}
        </div>
    );
};
