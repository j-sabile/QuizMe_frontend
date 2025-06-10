import type React from "react";
import type { Quiz } from "../interfaces/IQuiz";
import { Link } from "@tanstack/react-router";

const Quizzes: React.FC<{ quizzes: Quiz[]; title: string }> = ({ quizzes, title }) => {
  return (
    <section className="flex flex-col gap-6 mt-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="flex flex-wrap gap-6 gap-y-8">
        {quizzes.map((quiz, ind) => (
          <Link to={`/quiz/$quizId`} params={{quizId: quiz.id}} key={ind} className="flex flex-col w-[250px]">
            <div className="h-[150px] rounded-xl overflow-hidden mb-2 shadow">
              <img className="object-cover w-full h-full" src={quiz.image} />
            </div>
            <h3 className="text-xl font-semibold">{quiz.title}</h3>
            <p className="text-neutral-600">{quiz.shortDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Quizzes;
