import type { Question } from "./IQuestion";
import type { Quiz } from "./IQuiz";

interface IQuizResult {
  id: string;
  quizId: string | Quiz;
  questions: Question[];
  userAnswers: number[];
  score: number;
  scorePercentage: number;
  durationSeconds: number;
  dateTaken: number;
}

export type { IQuizResult };
