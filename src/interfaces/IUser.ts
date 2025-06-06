import type { Quiz } from "./IQuiz";
import type { IQuizResult } from "./IQuizResult";

interface IUser {
  id: string;
  username: string;
  bio: string;
  createdAt: number;
  quizzesCreated: Quiz[];
  quizzesTaken: IQuizResult[];
  aveScorePercent: number;
  quizzesTakenCount: number;
  quizzesCreatedCount: number;
  isOwner: boolean;
}

export type { IUser };
