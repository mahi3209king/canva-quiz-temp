import { registerRoot, Composition, staticFile } from 'remotion';
import { QuizVideo } from './compositions/QuizVideo';
import { FullQuizVideo } from './compositions/FullQuizVideo';
import { TIMING } from './styles/theme';
import quizData from './data/quizzes.json';
import config from './data/config.json';
import './index.css';

import { LandscapeQuiz } from './compositions/LandscapeQuiz';
import { FullLandscapeVideo } from './compositions/FullLandscapeVideo';

registerRoot(() => {
  // Check for interactive line
  const interactiveLineIdx = ((config as any).interactiveQuestionIndex || 0) - 1;
  const hasInteractiveLine = (config as any).interactiveLine && interactiveLineIdx >= 0 && interactiveLineIdx < quizData.length;

  const totalDuration = (quizData.length * TIMING.questionDuration) +
    TIMING.endCardDuration +
    (config.introHook ? TIMING.introHookDuration : 0) +
    (hasInteractiveLine ? TIMING.introHookDuration : 0);

  return (
    <>
      {/* Short Videos (9:16) */}
      <Composition
        id="SingleQuiz"
        component={QuizVideo}
        durationInFrames={TIMING.questionDuration}
        fps={TIMING.fps}
        width={1080}
        height={1920}
        defaultProps={{
          quiz: quizData[0],
          audioUrls: {
            question: "audio/q_0.mp3",
            answer: "audio/a_0.mp3"
          }
        }}
      />

      <Composition
        id="FullQuiz"
        component={FullQuizVideo}
        durationInFrames={totalDuration}
        fps={TIMING.fps}
        width={1080}
        height={1920}
      />

      {/* Long Videos (16:9) */}
      <Composition
        id="SingleLandscapeQuiz"
        component={LandscapeQuiz}
        durationInFrames={TIMING.questionDuration}
        fps={TIMING.fps}
        width={1920}
        height={1080}
        defaultProps={{
          quiz: quizData[0],
          audioUrls: {
            question: "audio/q_0.mp3",
            answer: "audio/a_0.mp3"
          },
          questionIndex: 0,
          totalQuestions: quizData.length
        }}
      />


      <Composition
        id="FullLandscapeQuiz"
        component={FullLandscapeVideo}
        durationInFrames={totalDuration}
        fps={TIMING.fps}
        width={1920}
        height={1080}
      />
    </>
  );
});

