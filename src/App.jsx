import "./App.css";
import TakeQuiz from "./pages/TakeQuiz";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import UserProfile from "./pages/UserProfile";
import Test from "./components/Test";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/login", element: <LogIn /> },
  { path: "/register", element: <Register /> },
  { path: "/quiz/:quizId", element: <Quiz /> },
  { path: "/takequiz/:quizRecordId", element: <TakeQuiz /> },
  { path: "/quizresult/:quizRecordId", element: <QuizResult /> },
  { path: "/u/:username", element: <UserProfile /> },
  { path: "/test", element: <Test /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}