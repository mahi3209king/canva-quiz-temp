import React from 'react';
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
    Img,
    staticFile,
    Audio,
    Series,
    Sequence
} from 'remotion';
import { QuizData } from '../types';
import { TIMING } from '../styles/theme';

interface LandscapeQuizProps {
    quiz?: QuizData;
    audioUrls?: {
        question: string;
        answer: string;
    };
    questionIndex?: number;
    totalQuestions?: number;
}

export const LandscapeQuiz: React.FC<LandscapeQuizProps> = ({
    quiz = {
        question: "Loading question...",
        Answer: "",
        category: "General"
    },
    audioUrls,
    questionIndex = 0,
    totalQuestions = 1
}) => {

    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Timings
    const revealFrame = TIMING.timerDuration;
    const isRevealed = frame >= revealFrame;

    // Animations
    const titleSpring = spring({ frame, fps, config: { damping: 10 } });
    const imageSpring = spring({ frame: frame - 15, fps, config: { damping: 12 } });


    return (
        <AbsoluteFill style={{
            backgroundColor: '#0085ff',
            fontFamily: 'Outfit, sans-serif',
            overflow: 'hidden'
        }}>
            {/* Background Rays */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle, #00a2ff 0%, #0066cc 100%)',
                opacity: 0.8
            }} />

            {/* Sidebars */}
            <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 50,
                backgroundColor: '#0055aa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: '2px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{
                    transform: 'rotate(-90deg)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 20,
                    whiteSpace: 'nowrap',
                    letterSpacing: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>
                    <span>▶</span> QUIZZERMACHA
                </div>
            </div>

            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: 50,
                backgroundColor: '#0055aa',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderLeft: '2px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{
                    transform: 'rotate(90deg)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: 20,
                    whiteSpace: 'nowrap',
                    letterSpacing: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10
                }}>
                    QUIZZERMACHA <span>▶</span>
                </div>
            </div>

            {/* Main Layout Container */}
            <div style={{ padding: '60px 100px', height: '100%', display: 'flex', flexDirection: 'column' }}>

                {/* Header Section */}
                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 60 }}>
                    {/* Question Number */}
                    <div style={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#fffb00',
                        borderRadius: 15,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 48,
                        fontWeight: 900,
                        color: '#000',
                        boxShadow: '0 8px 0 #bbaa00',
                        transform: `scale(${titleSpring})`
                    }}>
                        {questionIndex + 1}
                    </div>

                    {/* Question Title */}
                    <div style={{
                        flex: 1,
                        backgroundColor: '#ff6600',
                        borderRadius: 30,
                        border: '8px solid #fff',
                        padding: '20px 40px',
                        boxShadow: '0 10px 0 rgba(0,0,0,0.2)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 120,
                        transform: `translateY(${interpolate(titleSpring, [0, 1], [-100, 0])}px)`
                    }}>
                        <h1 style={{
                            color: '#fff',
                            fontSize: 42,
                            fontWeight: 900,
                            textAlign: 'center',
                            margin: 0,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                        }}>{quiz.question}</h1>
                    </div>
                </div>

                <div style={{ flex: 1, display: 'flex', gap: 50 }}>
                    {/* Left: Image Card */}
                    <div style={{
                        width: '55%',
                        height: '75%', // Don't take full height
                        backgroundColor: '#fff',
                        borderRadius: 40,
                        padding: 15,
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        transform: `scale(${imageSpring})`
                    }}>
                        <div style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 25,
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            position: 'relative'
                        }}>
                            {/* Question Mark Placeholder */}
                            {!isRevealed && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: '#ff6600',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 2,
                                    border: '10px solid #fff',
                                    borderRadius: 25
                                }}>
                                    <span style={{
                                        fontSize: 220,
                                        fontWeight: 900,
                                        color: '#fff',
                                        textShadow: '0 10px 20px rgba(0,0,0,0.2)'
                                    }}>?</span>
                                </div>
                            )}

                            {/* Actual Image (Revealed later) */}
                            {quiz.image ? (
                                <Img
                                    src={staticFile(quiz.image)}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        opacity: isRevealed ? 1 : 0,
                                        transition: 'opacity 0.5s ease-in-out'
                                    }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: 24 }}>
                                    Loading...
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Right: Options & Timer */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 15, paddingTop: 30 }}>
                        {/* Options A, B, C, D */}
                        {['A', 'B', 'C', 'D'].map((label, idx) => {
                            const optionText = quiz.options ? quiz.options[idx] : (idx === 1 ? quiz.Answer : "---");
                            const isCorrect = (quiz.correctIndex === idx) || (idx === 1 && quiz.Answer);

                            // Initial entrance animation
                            const entranceSpring = spring({ frame: frame - 30 - (idx * 5), fps });
                            const entranceTranslate = interpolate(entranceSpring, [0, 1], [1000, 0]);

                            // Background color logic
                            let bgColor = '#ffbb00'; // Default yellow
                            let textColor = '#444';

                            if (isRevealed) {
                                if (isCorrect) {
                                    bgColor = '#00ff00'; // Correct green
                                    textColor = '#000';
                                } else {
                                    bgColor = '#ff4444'; // Wrong red
                                    textColor = '#fff';
                                }
                            }

                            return (
                                <div key={label} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0,
                                    width: '90%',
                                    transform: `translateX(${entranceTranslate}px)`
                                }}>
                                    <div style={{
                                        width: 70,
                                        height: 75,
                                        backgroundColor: '#a000d0',
                                        borderRadius: '20px 0 0 20px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#fff',
                                        fontSize: 36,
                                        fontWeight: 900,
                                        border: '5px solid #fff',
                                        borderRight: 'none'
                                    }}>
                                        {label}
                                    </div>
                                    <div style={{
                                        flex: 1,
                                        height: 75,
                                        backgroundColor: bgColor,
                                        borderRadius: '0 20px 20px 0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0 30px',
                                        fontSize: 30,
                                        fontWeight: 800,
                                        color: textColor,
                                        border: '5px solid #fff',
                                        transition: 'background-color 0.3s ease',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden'
                                    }}>
                                        {optionText || "---"}
                                    </div>
                                </div>
                            );
                        })}

                        {/* Progress Bar below options */}
                        {!isRevealed && (
                            <div style={{
                                width: '90%',
                                height: 35,
                                backgroundColor: 'rgba(0,0,0,0.3)', // Darker background for contrast
                                borderRadius: 25,
                                padding: 5,
                                border: '6px solid #fff', // Thicker white border
                                marginTop: 70, // More distance from options
                                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${interpolate(frame, [0, revealFrame], [100, 0], { extrapolateRight: 'clamp' })}%`,
                                    height: '100%',
                                    borderRadius: 15,
                                    background: 'linear-gradient(90deg, #00ff00 0%, #33ff33 50%, #00cc00 100%)',
                                    boxShadow: '0 0 20px #00ff00',
                                    borderRight: '2px solid #fff'
                                }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>



            {/* Audio */}
            {audioUrls && (
                <>
                    <Audio src={staticFile(audioUrls.question)} />
                    <Sequence from={15} durationInFrames={TIMING.timerDuration - 15}>
                        <Audio src={staticFile('audio/timer.mp3')} volume={0.2} />
                    </Sequence>
                    <Sequence from={revealFrame}>
                        <Audio src={staticFile(audioUrls.answer)} />
                        <Audio src={staticFile('audio/correct.mp3')} volume={0.5} />
                    </Sequence>
                </>
            )}

        </AbsoluteFill>
    );
};
