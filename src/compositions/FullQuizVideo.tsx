import React from 'react';
import { Series } from 'remotion';
import { QuizVideo } from './QuizVideo';
import { EndScreen } from '../components/EndScreen';
import quizzes from '../data/quizzes.json';
import { QuizData } from '../types';
import { TIMING } from '../styles/theme';

export const FullQuizVideo: React.FC = () => {
    return (
        <Series>
            {quizzes.map((quiz: QuizData, index: number) => (
                <Series.Sequence key={index} durationInFrames={TIMING.questionDuration}>
                    <QuizVideo
                        quiz={quiz}
                        audioUrls={{
                            question: `audio/q_${index}.mp3`,
                            answer: `audio/a_${index}.mp3`
                        }}
                        questionIndex={index}
                        totalQuestions={quizzes.length}
                        allQuizzes={quizzes as QuizData[]}
                    />

                </Series.Sequence>
            ))}
            <Series.Sequence durationInFrames={TIMING.endCardDuration}>
                <EndScreen />
            </Series.Sequence>
        </Series>
    );
};
