import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Question } from '../components/Question';
import { Option } from '../components/Option';
import { Timer } from '../components/Timer';
import { AnswerReveal } from '../components/AnswerReveal';
import { THEME, TIMING } from '../styles/theme';
import { QuizVideoProps } from '../types';
import { Trophy, Sparkles, Layout } from 'lucide-react';

export const QuizVideo: React.FC<QuizVideoProps> = ({ quiz, audioUrls, questionIndex = 0, totalQuestions = 1 }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig();

    const isRevealed = frame >= 165;

    return (
        <AbsoluteFill
            style={{
                background: THEME.background,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '60px 40px',
                fontFamily: THEME.fontFamily,
                overflow: 'hidden'
            }}
        >
            {/* Decorative Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, ${THEME.primary}15 0%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(80px)',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: `radial-gradient(circle, ${THEME.accent}15 0%, transparent 70%)`,
                borderRadius: '50%',
                filter: 'blur(80px)',
            }} />

            {/* Header Info */}
            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 24px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '100px',
                    border: `1px solid ${THEME.surfaceBorder}`,
                    backdropFilter: 'blur(10px)'
                }}>
                    <Trophy size={20} color={THEME.primary} />
                    <span style={{ color: THEME.text, fontWeight: '800', fontSize: '24px', textTransform: 'uppercase' }}>
                        {quiz.category}
                    </span>
                </div>

                <div style={{
                    color: THEME.text,
                    fontSize: '24px',
                    fontWeight: '800',
                    backgroundColor: THEME.primary,
                    padding: '80px', // Extra padding for circular look
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: 'scale(0.4)', // Smaller
                    boxShadow: `0 0 30px ${THEME.primary}66`
                }}>
                    {questionIndex + 1}/{totalQuestions}
                </div>
            </div>

            {/* Main Content */}
            <Question text={quiz.question} />

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {quiz.options.map((option, index) => (
                    <Option
                        key={index}
                        text={option}
                        index={index}
                        isSelected={false}
                        isCorrect={index === quiz.correctIndex}
                        reveal={isRevealed}
                    />
                ))}
            </div>

            <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!isRevealed ? (
                    <Timer />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ color: THEME.primary, marginBottom: '20px' }}>
                            <Sparkles size={60} />
                        </div>
                        <AnswerReveal isVisible={true} correctOption={quiz.options[quiz.correctIndex]} />
                    </div>
                )}
            </div>

            {/* Progress Line */}
            <div style={{
                width: '100%',
                height: '6px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                marginTop: '40px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${((questionIndex + (isRevealed ? 1 : 0.5)) / totalQuestions) * 100}%`,
                    height: '100%',
                    backgroundColor: THEME.primary,
                    transition: 'width 0.5s ease'
                }} />
            </div>

            {/* Audio Layers */}

            {/* 1. Question Voiceover (Starts at frame 0) */}
            {audioUrls?.question && (
                <Audio src={staticFile(audioUrls.question)} />
            )}

            {/* 2. Timer Ticking Sound (Starts at frame 15, plays for 150 frames) */}
            <Sequence from={15} durationInFrames={150}>
                <Audio src={staticFile("audio/timer.mp3")} volume={0.5} />
            </Sequence>

            {/* 3. Reveal Sound & Voiceover (Both start at frame 165) */}
            <Sequence from={165}>
                <Audio src={staticFile("audio/correct.mp3")} volume={0.8} />
                {audioUrls?.answer && (
                    <Audio src={staticFile(audioUrls.answer)} />
                )}
            </Sequence>


        </AbsoluteFill>
    );
};
