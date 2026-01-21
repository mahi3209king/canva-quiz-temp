import React from 'react';
import { useCurrentFrame, spring } from 'remotion';
import { THEME } from '../styles/theme';
import { CheckCircle2, Circle } from 'lucide-react';

interface OptionProps {
    text: string;
    index: number;
    isSelected?: boolean;
    isCorrect?: boolean;
    reveal?: boolean;
    isUSA?: boolean;
}

export const Option: React.FC<OptionProps> = ({ text, index, isCorrect, reveal, isUSA }) => {
    const frame = useCurrentFrame();

    const letter = String.fromCharCode(65 + index);
    const isAnswer = reveal && isCorrect;

    const scale = spring({
        frame,
        fps: 30,
        config: { damping: 12 },
        delay: index * 5
    });

    const getColors = () => {
        if (!reveal) return { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', text: '#fff' };
        if (isCorrect) return { bg: THEME.correct, border: '#fff', text: '#fff' };
        return { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.3)' };
    };

    const colors = getColors();

    return (
        <div style={{
            width: '100%',
            padding: '24px 30px',
            marginBottom: '20px',
            backgroundColor: colors.bg,
            borderRadius: isUSA ? '12px' : '24px',
            border: `2px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
            transform: `scale(${scale})`,
            boxShadow: isAnswer ? `0 0 40px ${THEME.correct}44` : 'none',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: isUSA ? '8px' : '50%',
                backgroundColor: isAnswer ? '#fff' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '24px',
                fontWeight: '900',
                color: isAnswer ? THEME.correct : '#fff',
                flexShrink: 0
            }}>
                {letter}
            </div>

            <div style={{
                fontSize: '32px',
                fontWeight: '700',
                color: colors.text,
                flex: 1
            }}>
                {text}
            </div>

            {reveal && isCorrect && (
                <div style={{ color: '#fff' }}>
                    <CheckCircle2 size={32} />
                </div>
            )}
        </div>
    );
};
