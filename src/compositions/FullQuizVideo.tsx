import React from 'react';
import { Series, useVideoConfig } from 'remotion';
import { QuizVideo } from './QuizVideo';
import quizzes from '../data/quizzes.json';
import { QuizData } from '../types';

export const FullQuizVideo: React.FC = () => {
    return (
        <Series>
            {quizzes.map((quiz: QuizData, index: number) => (
                <Series.Sequence key={index} durationInFrames={300}>
                    <QuizVideo
                        quiz={quiz}
                        audioUrls={{
                            question: `audio/q_${index}.mp3`,
                            answer: `audio/a_${index}.mp3`
                        }}
                        questionIndex={index}
                        totalQuestions={quizzes.length}
                    />
                </Series.Sequence>
            ))}
        </Series>
    );
};
