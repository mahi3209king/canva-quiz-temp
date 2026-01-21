import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, spring, interpolate, Img } from 'remotion';
import { THEME, TIMING } from '../styles/theme';
import { QuizVideoProps, QuizData } from '../types';
import config from '../data/config.json';
import { TEMPLATES } from '../data/templates';
import { Question } from '../components/Question';
import { Option } from '../components/Option';
import { Timer } from '../components/Timer';
import { AnswerReveal } from '../components/AnswerReveal';

// --- MAIN ENTRANCE ---
export const QuizVideo: React.FC<QuizVideoProps> = ({ quiz, audioUrls, questionIndex = 0, totalQuestions = 1, allQuizzes = [] }) => {
    const frame = useCurrentFrame();
    const isRevealed = frame >= 150;

    const selectedTemplate = (TEMPLATES as any)[config.templateId] || TEMPLATES.modern_dark;
    const colors = selectedTemplate.colors;
    const isCityStyle = config.templateId === 'usa_city_style';

    if (isCityStyle) {
        return <USACityStyleQuiz quiz={quiz} audioUrls={audioUrls} isRevealed={isRevealed} colors={colors} questionIndex={questionIndex} allQuizzes={allQuizzes} />;
    }

    return (
        <AbsoluteFill
            style={{
                background: config.bgImage ? `url(${staticFile(config.bgImage)}) center/cover no-repeat` : colors.background,
                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 40px', fontFamily: THEME.fontFamily, overflow: 'hidden'
            }}
        >
            <StandardQuizLayout quiz={quiz} audioUrls={audioUrls} isRevealed={isRevealed} colors={colors} questionIndex={questionIndex} totalQuestions={totalQuestions} />
        </AbsoluteFill>
    );
};

// --- TYPEWRITER COMPONENT ---
const TypewriterText: React.FC<{ text: string, delay?: number, speed?: number, style?: React.CSSProperties }> = ({ text, delay = 0, speed = 1.5, style }) => {
    const frame = useCurrentFrame();
    const charsToShow = Math.floor(Math.max(0, frame - delay) / speed);
    const visibleText = text.substring(0, charsToShow);

    return (
        <div style={{ ...style, minHeight: '1.2em' }}>
            {visibleText}
            {frame % 10 < 5 && <span style={{ color: '#00ccff', borderLeft: '3px solid #00ccff', marginLeft: '2px' }} />}
        </div>
    );
};

// --- USA CITY STYLE (LIST REFINED AS PER EXACT USER REQUEST) ---
const USACityStyleQuiz: React.FC<{ quiz: QuizData, audioUrls: any, isRevealed: boolean, colors: any, questionIndex: number, allQuizzes: QuizData[] }> = ({ quiz, audioUrls, isRevealed, colors, questionIndex, allQuizzes }) => {
    const frame = useCurrentFrame();

    // Static Header (No entry animation)
    const headerStyle: React.CSSProperties = {
        margin: '0 auto',
        backgroundColor: '#ff0000',
        padding: '12px 60px',
        borderRadius: '12px',
        border: '5px solid #000',
        display: 'inline-block',
        alignSelf: 'center',
        boxShadow: '0 8px 0 rgba(0,0,0,0.5)',
        zIndex: 10
    };

    const DIFFICULTY_LEVELS = [
        { label: 'EASY:', color: '#ffff00', range: [1, 4] },
        { label: 'MEDIUM:', color: '#00ff00', range: [4, 7] },
        { label: 'HARD:', color: '#ff0000', range: [7, 10] },
        { label: 'EXPERT:', color: '#ff00ff', range: [10, 11] },
    ];

    return (
        <AbsoluteFill style={{
            background: config.bgImage ? `url(${staticFile(config.bgImage)}) center/cover no-repeat` : 'linear-gradient(to bottom, #112244, #051020)',
            fontFamily: THEME.fontFamily, color: '#fff', padding: '40px 0'
        }}>
            {config.bgm && <Audio src={staticFile(config.bgm)} volume={0.2} />}

            {/* 1. STATIC TITLE */}
            <div style={headerStyle}>
                <h1 style={{ color: '#ffff00', fontSize: '50px', fontWeight: '900', margin: 0, textTransform: 'uppercase', WebkitTextStroke: '2px black', textAlign: 'center' }}>
                    {quiz.category} QUIZ
                </h1>
            </div>

            {/* 2. QUESTION / IMAGE AREA */}
            <div style={{
                marginTop: '40px',
                height: '400px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0 40px',
                position: 'relative'
            }}>
                {!isRevealed ? (
                    // Display question in typing format
                    <TypewriterText
                        text={quiz.question}
                        delay={0}
                        speed={1.5}
                        style={{
                            fontSize: '65px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            color: '#fff',
                            textShadow: '0 0 20px #00ccff, 4px 4px 0px #000',
                            WebkitTextStroke: '2.5px #00ccff',
                            textAlign: 'center',
                            lineHeight: 1.1
                        }}
                    />
                ) : (
                    // On reveal, swap with static image
                    quiz.image && (
                        <div style={{
                            width: '90%',
                            height: '100%',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            border: '8px solid #fff',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Img
                                src={staticFile(quiz.image)}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain', // Keep aspect ratio
                                }}
                            />
                        </div>
                    )
                )}
            </div>

            {/* 3. ANSWER REVEAL SECTION (10 Numbers) */}
            <div style={{
                marginTop: '40px',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                width: '100%',
                paddingLeft: '15%',
                flex: 1
            }}>
                {DIFFICULTY_LEVELS.map((level, idx) => {
                    const nums = [];
                    for (let n = level.range[0]; n < level.range[1]; n++) nums.push(n);

                    return (
                        <div key={idx} style={{ marginBottom: '10px' }}>
                            <div style={{ color: level.color, fontSize: '38px', fontWeight: '900', textShadow: '2px 2px 0px #000', marginBottom: '8px' }}>{level.label}</div>
                            {nums.map((num) => {
                                const questionNum = num; // 1-indexed
                                const isCurrent = questionNum === questionIndex + 1;
                                const isPrevious = questionNum < questionIndex + 1;

                                // Show answer if it's a previous question OR if it's the current revealed question
                                const shouldShowAnswerText = isPrevious || (isCurrent && isRevealed);

                                // Get the answer text from allQuizzes
                                const quizForThisNum = allQuizzes[questionNum - 1];
                                const answerToDisplay = quizForThisNum ? (quizForThisNum.Answer || (quizForThisNum.options ? quizForThisNum.options[quizForThisNum.correctIndex!] : "")) : "";

                                return (
                                    <div key={num} style={{
                                        fontSize: '44px',
                                        fontWeight: '800',
                                        marginLeft: '40px',
                                        color: shouldShowAnswerText ? level.color : '#fff',
                                        textShadow: '2px 2px 2px #000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        height: '55px'
                                    }}>
                                        <span style={{ color: level.color, minWidth: '60px' }}>{num}.</span>

                                        {shouldShowAnswerText && (
                                            <div style={{
                                                color: level.color,
                                                textTransform: 'uppercase',
                                                // Fade in only if it's the current one just being revealed
                                                animation: isCurrent ? 'fadeIn 0.5s ease' : 'none'
                                            }}>
                                                {answerToDisplay}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Timer Logic */}
            {!isRevealed && (
                <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)' }}>
                    <Timer />
                </div>
            )}

            {/* Watermark */}
            <div style={{ position: 'absolute', bottom: '30px', width: '100%', textAlign: 'center', opacity: 0.5 }}>
                <h3 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px' }}>@QUIZMASTER</h3>
            </div>

            <AudioLogic quiz={quiz} audioUrls={audioUrls} isRevealed={isRevealed} />
        </AbsoluteFill>
    );
};

const AudioLogic: React.FC<{ quiz: any, audioUrls: any, isRevealed: boolean }> = ({ quiz, audioUrls, isRevealed }) => {
    return (
        <>
            {audioUrls?.question && <Audio src={staticFile(audioUrls.question)} />}
            <Sequence from={15} durationInFrames={150}><Audio src={staticFile("audio/timer.mp3")} volume={0.5} /></Sequence>
            <Sequence from={150}>
                <Audio src={staticFile("audio/correct.mp3")} volume={0.8} />
                {audioUrls?.answer && <Audio src={staticFile(audioUrls.answer)} />}
            </Sequence>
        </>
    );
};

// --- STANDARD LAYOUT ---
const StandardQuizLayout: React.FC<{ quiz: any, audioUrls: any, isRevealed: boolean, colors: any, questionIndex: number, totalQuestions: number }> = ({ quiz, audioUrls, isRevealed, colors, questionIndex, totalQuestions }) => {
    const isUSA = config.templateId === 'usa_quiz';
    return (
        <>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 30px', backgroundColor: isUSA ? '#fff' : colors.surface, borderRadius: isUSA ? '12px' : '100px', border: isUSA ? `4px solid ${colors.secondary}` : `1px solid rgba(255,255,255,0.1)`, backdropFilter: 'blur(10px)' }}>
                    <span style={{ color: isUSA ? colors.secondary : '#fff', fontWeight: '900', fontSize: '28px', textTransform: 'uppercase' }}>{isUSA ? 'USA TRIVIA' : quiz.category}</span>
                </div>
                <div style={{ color: '#fff', fontSize: '24px', fontWeight: '800', backgroundColor: isUSA ? colors.secondary : colors.primary, width: '60px', height: '60px', borderRadius: isUSA ? '15px' : '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {questionIndex + 1}
                </div>
            </div>
            <Question text={quiz.question} />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                {quiz.options?.map((option: string, index: number) => (
                    <Option key={index} text={option} index={index} isSelected={false} isCorrect={index === quiz.correctIndex} reveal={isRevealed} isUSA={isUSA} />
                ))}
            </div>
            <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                {!isRevealed ? <Timer /> : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><AnswerReveal isVisible={true} correctOption={quiz.Answer || (quiz.options ? quiz.options[quiz.correctIndex!] : "")} /></div>}
            </div>
            <AudioLogic quiz={quiz} audioUrls={audioUrls} isRevealed={isRevealed} />
        </>
    );
};
