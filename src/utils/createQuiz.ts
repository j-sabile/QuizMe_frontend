import type { NavigateFunction } from "react-router";

const createQuiz = async (navigate: NavigateFunction) => {
  const res = await fetch(`${import.meta.env.VITE_API}/quiz`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({}),
  });
  if (!res.ok) return alert("An error has occured. Please try again later.");
  const data = await res.json();
  if (!data.quizId) return alert("An error has occured. Please try again later.");
  navigate(`/quiz/${data.quizId}`);
};

export default createQuiz;
