import type { Question } from "./IQuestion";

interface Quiz {
  id: string,
  title: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  ownerUsername: string;
  isOwner: boolean;
  questions?: Question[];
  createdAt: string;
}

export type { Quiz };
