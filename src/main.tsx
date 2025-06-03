import { createRoot, type Container } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";

import LandingPage from "./pages/LandingPage";
import Layout from "./pages/Layout";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SIgnUp";
import LayoutAndProtectedRoute from "./LayoutAndProtectedRoute";
import Explore from "./pages/Explore";
import QuizHomePage from "./pages/QuizHomePage";
import AnswerQuiz from "./pages/AnswerQuiz";
import QuizResult from "./pages/QuizResult";

createRoot(document.getElementById("root") as Container).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />,
        <Route path="/sign-in" element={<LogIn />} />,
        <Route path="/sign-up" element={<SignUp />} />,
      </Route>
      <Route element={<LayoutAndProtectedRoute />}>
        <Route path="/home" element={<Explore />} />
        <Route path="/quiz/:quizId" element={<QuizHomePage />} />
        <Route path="/quiz/:quizId/answer" element={<AnswerQuiz />} />
        <Route path="/result/:resultId" element={<QuizResult />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
