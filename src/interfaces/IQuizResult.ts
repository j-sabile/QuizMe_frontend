import type { Question } from "./IQuestion";

interface IQuizResult {
  quizId: string;
  questions: Question[];
  userAnswers: number[];
  score: number;
  scorePercentage: number;
}

export type { IQuizResult };
