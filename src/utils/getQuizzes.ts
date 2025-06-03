import type { Quiz } from "../interfaces/IQuiz";

const QUIZ_TYPE = {
  FEATURED: "featured",
  ALL: "all",
} as const;

const QUIZ_SORT = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;

type QUIZ_TYPE = (typeof QUIZ_TYPE)[keyof typeof QUIZ_TYPE];
type QUIZ_SORT = (typeof QUIZ_SORT)[keyof typeof QUIZ_SORT];

const getQuizzes = async (type?: QUIZ_TYPE, sort: QUIZ_SORT = QUIZ_SORT.NEWEST): Promise<Quiz[]> => {
  const params: { type?: string; sort: string } = { sort };
  if (type) params.type = type;
  const queryString = new URLSearchParams(params).toString();
  const res = await fetch(`${import.meta.env.VITE_API}/quizzes?${queryString}`, { credentials: "include" });
  const data = await res.json();
  return data.quizzes as Quiz[];
};

export { getQuizzes, QUIZ_TYPE, QUIZ_SORT };
