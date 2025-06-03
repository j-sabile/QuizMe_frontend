interface Question {
  id?: string;
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation?: string;
}

export type { Question };
