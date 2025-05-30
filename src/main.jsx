import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

import TakeQuiz from "./pages/TakeQuiz";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import UserProfile from "./pages/UserProfile";
import Test from "./components/Test";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />,
      <Route path="/login" element={<LogIn />} />,
      <Route path="/register" element={<Register />} />,
      <Route path="/quiz/:quizId" element={<Quiz />} />,
      <Route path="/takequiz/:quizRecordId" element={<TakeQuiz />} />,
      <Route path="/quizresult/:quizRecordId" element={<QuizResult />} />,
      <Route path="/u/:username" element={<UserProfile />} />,
      <Route path="/test" element={<Test />} />,
    </Routes>
  </BrowserRouter>
);
