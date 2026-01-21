export interface QuizData {
  question: string;
  options?: string[];
  correctIndex?: number;

  category: string;
  image?: string;
  Answer?: string;
}



export interface QuizVideoProps {
  quiz: QuizData;
  audioUrls?: {
    question: string;
    answer: string;
  };
  questionIndex?: number;
  totalQuestions?: number;
  allQuizzes?: QuizData[];
}

