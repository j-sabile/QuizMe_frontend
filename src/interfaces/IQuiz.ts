import type { Question } from "./IQuestion";

interface Quiz {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  userId: { username: string; id: string };
  isOwner: boolean;
  questions: Question[];
  type: string[];
  createdAt: number;
}

export type { Quiz };
