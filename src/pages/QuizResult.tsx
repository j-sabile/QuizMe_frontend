import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Link, useParams } from "react-router";
import type { IQuizResult } from "@/interfaces/IQuizResult";
import QuestionWithChoices from "@/components/QuestionWithChoices";

const QuizResult = () => {
  const { resultId } = useParams();
  const [scoreVisible, setScoreVisible] = useState(false);
  const [quizResult, setQuizResult] = useState<IQuizResult | null>(null);

  useEffect(() => {
    const loadQuizResult = async () => {
      if (!resultId) return;
      const res = await fetch(`${import.meta.env.VITE_API}/result/${resultId}`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();

      setQuizResult({ ...data.quizResult, scorePercentage: Math.round((data.quizResult.score / data.quizResult.questions.length) * 100) });
    };
    loadQuizResult();
  }, []);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  if (!quizResult) return;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header with Score */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Results</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">Review your answers and learn from detailed explanations</p>
          </div>

          {/* Score Section */}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-8 w-full">
            <Collapsible open={scoreVisible} onOpenChange={setScoreVisible}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <h3 className="text-2xl font-bold text-gray-900">Quiz Complete!</h3>
                      <p className="text-lg text-gray-600">Click to view your score</p>
                    </div>
                  </div>
                  {scoreVisible ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap sm:flex-row items-center gap-6">
                    <div className={`text-6xl font-bold ${getScoreColor(quizResult.scorePercentage)}`}>{quizResult.scorePercentage}%</div>
                    <div className="text-lg text-gray-600">
                      <div className="mb-1">
                        {quizResult.score} out of {quizResult.questions.length} correct
                      </div>
                      <div>{quizResult.questions.length - quizResult.score} incorrect</div>
                    </div>
                  </div>
                  <Badge className={`text-base px-4 py-2 ml-auto ${getScoreBadgeColor(quizResult.scorePercentage)}`}>
                    {quizResult.scorePercentage >= 80 ? "Excellent!" : quizResult.scorePercentage >= 60 ? "Good Job!" : "Keep Learning!"}
                  </Badge>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Questions Results */}
        <div className="space-y-12">
          {quizResult.questions.map((question, ind) => (
            <QuestionWithChoices isAnswering={false} question={question} questionNumber={ind} userAnswer={quizResult.userAnswers[ind]} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8 py-4 h-auto flex items-center gap-3">
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </Button>
          <Link to="/home">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto">
              View More Quizzes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;