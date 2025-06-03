import { useNavigate } from "react-router";
import Quizzes from "../components/Quizzes";
import createQuiz from "../utils/createQuiz";
import { useEffect, useState } from "react";
import { getQuizzes, QUIZ_TYPE } from "../utils/getQuizzes";
import type { Quiz } from "../interfaces/IQuiz";

const tags = ["All", "Trending", "Following", "For you", "Music", "Geography"];

const Explore = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [newQuizzes, setNewQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const loadQuizzes = async () => {
      let data = await getQuizzes(QUIZ_TYPE.FEATURED);
      setQuizzes(data);
      data = await getQuizzes();
      setNewQuizzes(data);
    };
    loadQuizzes();
  }, []);

  return (
    <main className="flex flex-col justify-start items-start gap-8 max-w-[1440px] w-full h-full mx-auto p-4">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-4xl font-semibold">Explore Quizzes</h1>
        <button onClick={() => createQuiz(navigate)} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow px-7 py-2">
          Create quiz
        </button>
      </div>
      <div className="flex flex-wrap gap-4 my-8">
        {tags.map((tag, ind) => (
          <div key={ind} className="rounded-xl bg-neutral-200 px-4 py-2">
            {tag}
          </div>
        ))}
      </div>
      <Quizzes quizzes={quizzes} title="Featured Quizzes" />
      <Quizzes quizzes={newQuizzes} title="Newest Quizzes" />
    </main>
  );
};

export default Explore;
