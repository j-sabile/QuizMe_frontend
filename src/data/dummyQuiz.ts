import type { Quiz } from "../interfaces/IQuiz";

const dummyQuiz: Quiz = {
  id: "quiz-001",
  title: "World Capitals Quiz",
  shortDescription: "Test your capital city knowledge!",
  longDescription: "Challenge yourself with this quiz on world capitals. Can you name the capital of countries from every continent? From Paris to Canberra, prove your geography skills.",
  image: "https://picsum.photos/id/222/800",
  ownerUsername: "geoGuru",
  createdAt: "2025-06-03T05:03:57.615+00:00",
  questions: [
    {
      question: "What is the capital of France?",
      choices: ["Paris", "Lyon", "Marseille", "Nice"],
      correctAnswer: 0,
    },
    {
      question: "Which city is the capital of Japan?",
      choices: ["Osaka", "Tokyo", "Kyoto", "Hiroshima"],
      correctAnswer: 1,
    },
    {
      question: "What is the capital of Australia?",
      choices: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
      correctAnswer: 2,
    },
    {
      question: "Which of these cities is the capital of Canada?",
      choices: ["Toronto", "Ottawa", "Vancouver", "Montreal"],
      correctAnswer: 1,
    },
    {
      question: "What is the capital of Brazil?",
      choices: ["São Paulo", "Brasília", "Rio de Janeiro", "Salvador"],
      correctAnswer: 1,
    },
  ],
  isOwner: false
};

export default dummyQuiz;
