import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./MyNavBar";

function QuizResult() {
  const navigate = useNavigate();
  const { quizRecordId } = useParams();
  const [username, setUsername] = useState("");
  const [quizRecordInfo, setQuizRecordInfo] = useState();
  const [quizInfo, setQuizInfo] = useState();
  const [scoreHidden, setScoreHidden] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    document.title = "Quiz Me";
    axios.post(`${process.env.REACT_APP_API}/getusername`, {}, { withCredentials: true }).then((res) => setUsername(res.data));
    axios.post(`${process.env.REACT_APP_API}/getquizrecordinfo`, { quizRecordId: quizRecordId }, { withCredentials: true }).then((res) => {
      setQuizRecordInfo(res.data);
      axios.post(`${process.env.REACT_APP_API}/getquizinfo`, { quizId: res.data.quiz_id }, { withCredentials: true }).then((res) => {
        setQuizInfo(res.data);
      });
    });
  }, []);

  const handleChoiceStyle = (questionIndex, choiceIndex) => {
    if (
      showAnswers &&
      quizRecordInfo.user_answers[questionIndex] !== quizRecordInfo.correct_answers[questionIndex] &&
      quizRecordInfo.correct_answers[questionIndex] === choiceIndex
    )
      return { backgroundColor: "#b6d7a8" };
  };

  return (
    <>
      <NavBar />

      <div className="d-flex flex-column align-items-center" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container d-flex flex-column py-5" style={{ maxWidth: "750px" }}>
          <div className="d-flex flex-row justify-content-between align-items-start">
            <div>
              <div className="mx-3 fs-3 fw-semibold mt-2">{quizInfo?.title}</div>
              <div className="my-2 mx-3">{quizInfo?.description}</div>
            </div>
            <div className="d-flex flex-column align-items-end gap-3">
              <div className="d-flex fs-5 fw-semibold align-items-center gap-2">
                <div>Score: </div>
                {scoreHidden ? (
                  <button className="btn btn-secondary px-3" onClick={() => setScoreHidden(false)}>
                    Show
                  </button>
                ) : (
                  <div>{quizRecordInfo?.score + "/" + quizRecordInfo?.questions?.length}</div>
                )}
              </div>
              {!showAnswers && (
                <button className="btn btn-secondary" onClick={() => setShowAnswers(true)}>
                  Show answers
                </button>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between"></div>
          <hr />

          <div className="px-0 px-sm-4 py-3">
            {quizInfo?.questions?.map((item, index) => (
              <div className="card my-3" key={index}>
                {showAnswers && (
                  <>
                    {quizRecordInfo.user_answers[index] === quizRecordInfo.correct_answers[index] ? (
                      <svg className="position-absolute mx-3 my-0 mx-sm-2 my-sm-4" width="36px" height="36px" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" fill="none" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L12.0243 14.3899C11.4586 14.9556 10.5414 14.9556 9.97568 14.3899L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
                          fill="#93c47d"
                        />
                      </svg>
                    ) : (
                      <svg className="position-absolute mx-3 my-0 mx-sm-2 my-sm-4" width="36px" height="36px" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" fill="none" />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM9.70711 8.29289C9.31658 7.90237 8.68342 7.90237 8.29289 8.29289C7.90237 8.68342 7.90237 9.31658 8.29289 9.70711L10.5858 12L8.29289 14.2929C7.90237 14.6834 7.90237 15.3166 8.29289 15.7071C8.68342 16.0976 9.31658 16.0976 9.70711 15.7071L12 13.4142L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L13.4142 12L15.7071 9.70711C16.0976 9.31658 16.0976 8.68342 15.7071 8.29289C15.3166 7.90237 14.6834 7.90237 14.2929 8.29289L12 10.5858L9.70711 8.29289Z"
                          fill="#e06666"
                        />
                      </svg>
                    )}
                  </>
                )}

                <div className="px-3 py-4 px-sm-5 py-sm-4">
                  <div className="fs-5 fw-semibold mb-1">{index + 1 + ". " + item.question}</div>
                  {item.choices.map((choice, choiceIndex) => (
                    <label className="d-flex gap-2 mt-1 ps-3 border border-0 rounded-pill" style={handleChoiceStyle(index, choiceIndex)} key={choiceIndex}>
                      <input type="radio" checked={choiceIndex === quizRecordInfo.user_answers[index]} onChange={() => {}} />
                      {choice}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button className="btn btn-secondary px-4" onClick={() => navigate("/")}>
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuizResult;
