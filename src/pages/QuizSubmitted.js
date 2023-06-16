import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function QuizSubmitted() {
  const { quizRecordId } = useParams();
  const [username, setUsername] = useState("");
  const [quizInfo, setQuizInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const e = async () => {
      await axios.post(`${process.env.REACT_APP_API}/getusername`, {}, { withCredentials: true }).then((res) => setUsername(res.data));
      await axios.post(`${process.env.REACT_APP_API}/getquizinfo`, { quizRecordId: quizRecordId }, { withCredentials: true }).then((res) => {
        setQuizInfo(res.data);
        setIsLoading(false);
      });
    };
    e();
  }, []);

  if (isLoading) return <div />;

  return (
    <>
      <div className="bg-primary py-3">
        <div className="container d-flex flex-row justify-content-between align-items-center">
          <div className="fs-3 text-white fw-semibold">Quiz Me</div>
          <div className="d-flex align-items-center gap-1">
            <div className="fs-6 text-white">{username}</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="white" className="bi bi-person-fill" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column align-items-center" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container d-flex flex-column py-5" style={{ maxWidth: "750px" }}>
          <div className="mx-3 fs-3 fw-semibold">{quizInfo.title}</div>
          <div className="my-2 mx-3">{quizInfo.description}</div>
          <hr />
        </div>
      </div>
    </>
  );
}

export default QuizSubmitted;
