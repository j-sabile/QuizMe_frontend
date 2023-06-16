import "./App.css";
import { Routes, Route } from "react-router-dom";
import TakeQuiz from "./pages/TakeQuiz";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import UserProfile from "./pages/UserProfile";
import Test from "./component/Test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quiz/:quizId" element={<Quiz />} />
      <Route path="/takequiz/:quizRecordId" element={<TakeQuiz />} />
      <Route path="/quizresult/:quizRecordId" element={<QuizResult />} />
      <Route path="/u/:username" element={<UserProfile />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;
