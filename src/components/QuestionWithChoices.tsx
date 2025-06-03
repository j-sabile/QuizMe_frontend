import { CheckCircle, XCircle } from "lucide-react";
import type { Question } from "../interfaces/IQuestion";
import { Badge } from "./ui/badge";
interface BaseProps {
  question: Question;
  userAnswer: number;
  questionNumber: number;
}

interface AnsweringProps extends BaseProps {
  isAnswering: true;
  selectChoice: (choice: number, questionNumber: number) => void;
}

interface ReadOnlyProps extends BaseProps {
  isAnswering: false;
  selectChoice?: undefined;
}

type Props = AnsweringProps | ReadOnlyProps;

const QuestionWithChoices: React.FC<Props> = ({ question, userAnswer, questionNumber, isAnswering = true, selectChoice }) => {
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div key={question.id} className="flex flex-col space-y-8 w-full">
      {/* Question Header */}
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-3">
          {!isAnswering && (
            <div className="flex-shrink-0">{isCorrect ? <CheckCircle className="w-8 h-8 text-green-600" /> : <XCircle className="w-8 h-8 text-red-600" />}</div>
          )}
          <span className="text-lg font-semibold text-gray-500">Question {questionNumber + 1}</span>
          {!isAnswering && (
            <Badge className={`text-sm px-3 py-1 ${isCorrect ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
              {isCorrect ? "Correct" : "Incorrect"}
            </Badge>
          )}
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold text-center w-full text-gray-900 leading-tight">{question.question}</h2>
      </div>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.choices.map((option, optionIndex) => {
          const isUserAnswer = optionIndex === userAnswer;
          const isCorrectAnswer = optionIndex === question.correctAnswer;
          let optionClass = "px-3 sm:px-6 py-3 rounded-2xl border-2 transition-all duration-150";

          if (isAnswering) {
            if (userAnswer === optionIndex) optionClass += "border-blue-600 bg-blue-50 ";
            optionClass +=
              "hover:bg-blue-50 hover:border-blue-800 focus:outline-blue-800 focus:bg-blue-50 focus:border-blue-800 cursor-pointer px-4 py-3 w-full rounded-lg text-lg";
          } else {
            if (isCorrectAnswer) {
              optionClass += "bg-green-50 border-green-300 text-green-900";
            } else if (isUserAnswer && !isCorrect) {
              optionClass += "bg-red-50 border-red-300 text-red-900";
            } else {
              optionClass += "bg-gray-50 border-gray-200 text-gray-700";
            }
          }

          return (
            <div
              key={optionIndex}
              className={optionClass}
              onFocus={() => isAnswering && selectChoice!(optionIndex, questionNumber)}
              onClick={() => isAnswering && selectChoice!(optionIndex, questionNumber)}
              tabIndex={1}
            >
              <div className="flex items-center w-full">
                <input className="mr-4" type="radio" name="question" required tabIndex={-1} checked={userAnswer === optionIndex} />
                <div className="flex flex-col sm:flex-row justify-between  w-full">
                  <span className="text-xl font-medium">{option}</span>
                  {!isAnswering && (
                    <div className="flex items-center gap-3 ml-auto">
                      {isCorrectAnswer && <Badge className="text-sm bg-green-100 text-green-700 border-green-300">Correct Answer</Badge>}
                      {isUserAnswer && !isCorrect && <Badge className="text-sm bg-red-100 text-red-700 border-red-300">Your Answer</Badge>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {!isAnswering && question.explanation && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-6 py-4">
          <h4 className="text-lg font-bold text-blue-900 mb-3">Explanation</h4>
          <p className="text-base text-blue-800 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionWithChoices;
