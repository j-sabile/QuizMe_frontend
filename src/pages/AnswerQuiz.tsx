import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Quiz } from "../interfaces/IQuiz";
import QuestionWithChoices from "../components/QuestionWithChoices";

const AnswerQuiz = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultId, setResultId] = useState<string>("");

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) return;
      const res = await fetch(`${import.meta.env.VITE_API}/quiz?id=${quizId}`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      setQuiz(data.quiz);
      setAnswers(new Array(data.quiz.questions?.length).fill(-1));
      setTotalQuestions(data.quiz.questions?.length || 0);
    };
    loadQuiz();
  }, [quizId]);

  const handleNext = async () => {
    if (answers[currentQuestionIndex] === -1) return alert("Please choose from the choices.");
    if (currentQuestionIndex + 1 >= totalQuestions!) {
      setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API}/quizzes/${quizId}/submissions`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ userAnswers: answers, questionIds: quiz!.questions?.map((q) => q.id) }),
      });
      if (!res.ok) return;
      setHasAnswered(true);
      const data = await res.json();
      setResultId(data.resultId);
    } else {
      setCurrentQuestionIndex((e) => e + 1);
    }
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((e) => e - 1);
  };

  const handleSelectChoice = (choice: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = choice;
      return updated;
    });
  };

  if (!quiz || !totalQuestions) return;

  if (totalQuestions === 0) return <>There are no questions to answer.</>;

  if (hasAnswered)
    return (
      <div className="flex flex-col justify-start items-center gap-4 max-w-[1080px] w-full h-full mx-auto pt-12">
        <h4 className="text-3xl font-semibold text-center w-full mb-6"> You have successfully submitted!</h4>
        <Link to={`/quiz/${quizId}`} className="bg-neutral-200 hover:bg-neutral-300 text-black rounded-lg shadow px-7 py-2">
          Go back
        </Link>
        <Link to={`/result/${resultId}`} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow px-7 py-2">
          View result
        </Link>
      </div>
    );

  return (
    <form className="flex flex-col justify-start items-start gap-8 max-w-[1080px] w-full h-full mx-auto p-4">
      {/* Progress bar */}
      <div className="w-full mt-4 mb-6 lg:mt-8 lg:mb-12">
        {totalQuestions && (
          <div className="flex justify-between mb-2 text-lg font-medium text-gray-700">
            <span>
              {currentQuestionIndex + 1}/{totalQuestions} questions
            </span>
            <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${totalQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : "0"}%` }}
          />
        </div>
      </div>

      <QuestionWithChoices
        isAnswering={true}
        question={quiz.questions![currentQuestionIndex]}
        questionNumber={currentQuestionIndex}
        selectChoice={handleSelectChoice}
        userAnswer={answers[currentQuestionIndex]}
      />

      {/* Back & Next buttons */}
      <div className="flex justify-end gap-4 w-full font-semibold">
        {currentQuestionIndex > 0 && !isSubmitting && (
          <button type="button" onClick={handlePrev} className="bg-neutral-200 hover:bg-neutral-300 text-black rounded-lg shadow px-7 py-2" tabIndex={1}>
            Back
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          className={`text-white rounded-lg shadow px-7 py-2 ${!isSubmitting ? "hover:bg-blue-600 bg-blue-500" : "bg-blue-300 !cursor-default"}`}
          tabIndex={1}
          disabled={isSubmitting}
        >
          {currentQuestionIndex + 1 >= totalQuestions! ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
        </button>
      </div>
    </form>
  );
};

export default AnswerQuiz;
