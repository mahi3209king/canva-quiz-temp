import { registerRoot, Composition, staticFile } from 'remotion';
import { QuizVideo } from './compositions/QuizVideo';
import { FullQuizVideo } from './compositions/FullQuizVideo';
import { TIMING } from './styles/theme';
import quizData from './data/quizzes.json';
import config from './data/config.json';
import './index.css';

registerRoot(() => {
  const totalDuration = (quizData.length * TIMING.questionDuration) +
    TIMING.endCardDuration +
    (config.introHook ? TIMING.introHookDuration : 0);

  return (
    <>
      {/* Single Question Composition */}
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

      {/* All Questions Composition */}
      <Composition
        id="FullQuiz"
        component={FullQuizVideo}
        durationInFrames={totalDuration}
        fps={TIMING.fps}
        width={1080}
        height={1920}
      />
    </>
  );
});
