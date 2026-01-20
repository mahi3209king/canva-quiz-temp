import { registerRoot, Composition, staticFile } from 'remotion';
import { QuizVideo } from './compositions/QuizVideo';
import { FullQuizVideo } from './compositions/FullQuizVideo';
import { TIMING } from './styles/theme';
import quizData from './data/quizzes.json';
import './index.css';

registerRoot(() => {


  return (
    <>
      {/* Single Question Composition */}
      <Composition
        id="SingleQuiz"
        component={QuizVideo}
        durationInFrames={300}
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
        durationInFrames={quizData.length * 300}
        fps={TIMING.fps}
        width={1080}
        height={1920}
      />
    </>
  );
});
