import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import type { Quiz } from "../interfaces/IQuiz";
import type { Question } from "../interfaces/IQuestion";
import { Edit, Plus, Save, Sparkles, Trash2 } from "lucide-react";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const QuizHomePage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newQuestion, setNewQuestion] = useState<Question>({ question: "", choices: ["", "", "", ""], correctAnswer: -1 });

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    if (!quizId) return;
    const res = await fetch(`${import.meta.env.VITE_API}/quiz?id=${quizId}`, { credentials: "include" });
    const data = await res.json();
    setQuiz(data.quiz);
    setIsOwner(data.quiz.isOwner);
    setNewTitle(data.quiz.title);
    setNewDescription(data.quiz.shortDescription);
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question.trim()) return;

    const hasValidChoices = newQuestion.choices.every((choice) => choice.trim() !== "");
    if (!hasValidChoices) return;

    await fetch(`${import.meta.env.VITE_API}/quizzes/${quizId}/questions`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        question: newQuestion.question,
        choices: newQuestion.choices,
        correctAnswer: newQuestion.correctAnswer,
        explanation: newQuestion.explanation,
      }),
    });

    setQuiz((prev) => {
      if (!prev || !prev.questions) return prev;
      return {
        ...prev,
        questions: [...prev.questions, { question: newQuestion.question, choices: newQuestion.choices, correctAnswer: newQuestion.correctAnswer }],
      };
    });
    setNewQuestion({ question: "", choices: ["", "", "", ""], correctAnswer: -1, explanation: "" });
    setIsAddingQuestion(false);
    setActiveTab("questions");
  };

  const handleGenerateAI = async () => {
    const res = await fetch(`${import.meta.env.VITE_API}/generateaiquestions`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ quizId, text: aiPrompt }),
    });
    if (!res.ok) alert("An error has occured. Please try again.");
    setIsGeneratingAI(false);
    loadQuiz();
  };

  const startEditQuestion = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setEditingQuestionIndex(index);
  };

  const handleDeleteQuestion = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const res = await fetch(`${import.meta.env.VITE_API}/quizzes/${quizId}/questions/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) return alert("Something went wrong. Please try again later.");
    loadQuiz();
  };

  const handleCancelEditQuizInfo = () => {
    setNewTitle(quiz!.title);
    setNewDescription(quiz!.shortDescription);
  };

  const handleEditQuizInfo = async () => {
    await fetch(`${import.meta.env.VITE_API}/quiz?id=${quizId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ title: newTitle, shortDescription: newDescription }),
    });
    loadQuiz();
  };

  if (!quiz || !quizId) return;

  return (
    <div className="flex flex-col justify-start items-start max-w-[720px] lg:max-w-[1024px] w-full mx-auto">
      <img className="h-60 lg:h-80 object-cover w-full max-w-[720px] lg:max-w-[1024px] rounded-b-2xl" src={quiz.image} alt={`${quiz.title} thumbnail`} />
      <div className="flex flex-col justify-start items-start p-4 w-full gap-4">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className={`text-4xl font-semibold mt-2 outline-0 border-b-[1px] border-transparent w-full px-2 py-1 focus:border-neutral-600 ${
            isOwner ? "hover:border-neutral-600" : ""
          }`}
          disabled={!isOwner}
        />
        <textarea
          value={newDescription}
          className={`outline-0 border-b-[1px] border-transparent w-full px-2 py-1 focus:border-neutral-600 ${isOwner ? "hover:border-neutral-600" : ""}`}
          onChange={(e) => setNewDescription(e.target.value)}
          disabled={!isOwner}
        />
        {(quiz.title != newTitle || quiz.shortDescription != newDescription) && (
          <div className="flex justify-end gap-2 mb-8 w-full">
            <Button variant="outline" size="lg" className="text-base" onClick={handleCancelEditQuizInfo}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleEditQuizInfo} className="bg-blue-600 hover:bg-blue-700 text-base">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        )}

        <Link to={`/quiz/${quizId}/answer`} className="bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-xl shadow px-12 py-3">
          Start Quiz
        </Link>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4 sm:mb-6 w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-gray-100 rounded-2xl gap-2 max-w-[500px]">
            <TabsTrigger value="overview" className="text-lg py-2 px-2 rounded-xl break-words whitespace-normal text-center data-[state=active]:bg-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="questions" className="text-lg py-2 px-2 rounded-xl break-words whitespace-normal text-center data-[state=active]:bg-white">
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <Card className="border-gray-200">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-xl font-medium">Quiz Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-500">Title</Label>
                  <div className="font-medium">{quiz.title}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Description</Label>
                  <div className="text-sm sm:text-base">{quiz.shortDescription}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Created by</Label>
                  <Link to={`/user/${quiz.userId.id}`} className="text-sm sm:text-base">
                    {quiz.userId.username}
                  </Link>
                </div>
                <div>
                  <Label className="text-md text-gray-500">Statistics</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-md text-gray-500">Questions</div>
                      <div className="text-2xl font-medium">{quiz.questions?.length}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-md text-gray-500">Takes</div>
                      <div className="text-2xl font-medium">{10}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-md text-gray-500">Avg. Score</div>
                      <div className="text-2xl font-medium">{72}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-4">
            {/* Actions - Only show if user is owner */}
            {quiz.isOwner && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                <Dialog open={isAddingQuestion} onOpenChange={setIsAddingQuestion}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="text-gray-700 w-full sm:w-auto text-base">
                      <Plus className="mr-2 h-4 w-4" /> Add Question
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-medium">New Question</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Textarea
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        placeholder="Enter your question..."
                        className="min-h-[80px] border-gray-200 text-base"
                      />
                      <div className="space-y-3">
                        <Label className="text-base text-gray-600">Answer choices</Label>
                        <RadioGroup
                          value={newQuestion.correctAnswer.toString()}
                          onValueChange={(value) => {
                            setNewQuestion({ ...newQuestion, correctAnswer: Number.parseInt(value) });
                          }}
                        >
                          {newQuestion.choices.map((choice, idx) => (
                            <div key={idx} className="flex items-center space-x-3">
                              <RadioGroupItem value={idx.toString()} id={`choice-${idx}`} />
                              <Input
                                value={choice}
                                onChange={(e) => {
                                  const updatedChoices = [...newQuestion.choices];
                                  updatedChoices[idx] = e.target.value;
                                  setNewQuestion({ ...newQuestion, choices: updatedChoices });
                                }}
                                placeholder={`Choice ${idx + 1}`}
                                className="flex-1 border-gray-200 text-base"
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="lg" onClick={() => setIsAddingQuestion(false)} className="w-full sm:w-auto text-base">
                        Cancel
                      </Button>
                      <Button onClick={handleAddQuestion} size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-base">
                        Add Question
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isGeneratingAI} onOpenChange={setIsGeneratingAI}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-base">
                      <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-medium">Generate Questions</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Paste your notes here..."
                        className="min-h-[100px] max-h-[50vh] border-gray-200 text-base"
                      />
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="lg" onClick={() => setIsGeneratingAI(false)} className="w-full sm:w-auto text-base">
                        Cancel
                      </Button>
                      <Button onClick={handleGenerateAI} size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-base">
                        Generate
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Questions Accordion */}
            <Accordion type="multiple" className="w-full">
              {quiz.questions?.map((question, qIndex) => (
                <AccordionItem key={qIndex} value={qIndex.toString()} className="border-b border-gray-200">
                  <AccordionTrigger className="py-3 hover:no-underline text-left">
                    <div className="flex items-center justify-between w-full sm:pr-4">
                      <div className="text-left font-normal flex-1 min-w-0">
                        <span className="text-gray-500 mr-2 text-base sm:text-lg">{qIndex + 1}.</span>
                        <span className="text-base sm:text-lg break-words">{question.question}</span>
                      </div>
                      {quiz.isOwner && (
                        <div className="flex items-center sm:gap-2 flex-shrink-0">
                          <div
                            onClick={(e) => startEditQuestion(e, qIndex)}
                            className="flex items-center h-5 w-5 sm:h-7 sm:w-7 p-[2px] text-gray-500 hover:bg-gray-50"
                          >
                            <Edit className="h-5 w-5" />
                          </div>
                          <div
                            onClick={(e) => handleDeleteQuestion(e, question.id!)}
                            className="flex items-center h-5 w-5 sm:h-7 sm:w-7 p-[2px] text-gray-500 hover:bg-gray-50 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {editingQuestionIndex === qIndex ? (
                      <EditQuestionForm question={question} onSuccess={loadQuiz} quizId={quizId} onClose={() => setEditingQuestionIndex(null)} />
                    ) : (
                      <div className="py-2 pl-3 sm:pl-6">
                        {/* Mobile: Single column, Desktop: Two columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {question.choices.map((choice, idx) => (
                            <div
                              key={idx}
                              className={`p-2 sm:p-3 rounded-md text-sm ${
                                idx === question.correctAnswer ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <span className="text-gray-500 mr-1 text-sm sm:text-base">{String.fromCharCode(65 + idx)}.</span>
                              <span className="text-sm sm:text-base break-words">{choice}</span>
                              {idx === question.correctAnswer && <span className="text-blue-500 ml-1">✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )) || []}
            </Accordion>

            {(!quiz.questions || quiz.questions.length === 0) && (
              <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-500 text-sm sm:text-base">No questions yet</p>
                {quiz.isOwner && <p className="text-xs sm:text-sm text-gray-400 mt-1">Add your first question to get started</p>}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuizHomePage;

// Edit Question Form Component
function EditQuestionForm({ question, quizId, onSuccess, onClose }: { question: Question; quizId: string; onSuccess: () => void; onClose: () => void }) {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);

  const handleEditQuestion = async () => {
    await fetch(`${import.meta.env.VITE_API}/quizzes/${quizId}/questions/${question.id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ ...editedQuestion }),
    });
    onSuccess();
    onClose();
  };

  return (
    <div className="py-2 space-y-4">
      <Textarea
        value={editedQuestion.question}
        onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
        className="border-gray-200 text-base"
      />
      <div className="space-y-3">
        <RadioGroup
          value={editedQuestion.correctAnswer.toString()}
          onValueChange={(value) => {
            setEditedQuestion({ ...editedQuestion, correctAnswer: Number.parseInt(value) });
          }}
        >
          {editedQuestion.choices.map((choice, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <RadioGroupItem value={idx.toString()} id={`edit-choice-${idx}`} />
              <Input
                value={choice}
                onChange={(e) => {
                  const updatedChoices = [...editedQuestion.choices];
                  updatedChoices[idx] = e.target.value;
                  setEditedQuestion({ ...editedQuestion, choices: updatedChoices });
                }}
                className="flex-1 border-gray-200 text-base"
              />
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="default" className="text-base" onClick={onClose}>
          Cancel
        </Button>
        <Button size="default" onClick={handleEditQuestion} className="bg-blue-600 hover:bg-blue-700 text-base">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
