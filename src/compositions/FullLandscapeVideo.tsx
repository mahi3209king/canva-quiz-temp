import React from 'react';
import { Series } from 'remotion';
import { LandscapeQuiz } from './LandscapeQuiz';
import { EndScreen } from '../components/EndScreen';
import quizzes from '../data/quizzes.json';
import config from '../data/config.json';
import { QuizData } from '../types';
import { TIMING } from '../styles/theme';
import { IntroHook } from '../components/IntroHook';
import { InteractiveLine } from '../components/InteractiveLine';

export const FullLandscapeVideo: React.FC = () => {
    // Interactive Line settings
    const interactiveLineIdx = ((config as any).interactiveQuestionIndex || 0) - 1; // Convert 1-based to 0-based
    const hasInteractiveLine = (config as any).interactiveLine && interactiveLineIdx >= 0 && interactiveLineIdx < quizzes.length;

    return (
        <Series>
            {config.introHook && (
                <Series.Sequence durationInFrames={TIMING.introHookDuration}>
                    <IntroHook />
                </Series.Sequence>
            )}

            {(quizzes as QuizData[]).map((quiz, index) => {
                const elements = [];

                // If this is the interactive line index, add it BEFORE the question
                if (hasInteractiveLine && index === interactiveLineIdx) {
                    elements.push(
                        <Series.Sequence key="interactive-line" durationInFrames={TIMING.introHookDuration}>
                            <InteractiveLine />
                        </Series.Sequence>
                    );
                }

                elements.push(
                    <Series.Sequence key={index} durationInFrames={TIMING.questionDuration}>
                        <LandscapeQuiz
                            quiz={quiz}
                            audioUrls={{
                                question: `audio/q_${index}.mp3`,
                                answer: `audio/a_${index}.mp3`
                            }}
                            questionIndex={index}
                            totalQuestions={quizzes.length}
                        />
                    </Series.Sequence>
                );

                return elements;
            })}

            <Series.Sequence durationInFrames={TIMING.endCardDuration}>
                <EndScreen />
            </Series.Sequence>
        </Series>
    );
};
