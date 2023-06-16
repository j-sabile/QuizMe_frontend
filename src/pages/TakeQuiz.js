import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import axios from "axios";
import NavBar from "./MyNavBar";

function TakeQuiz() {
  const navigate = useNavigate();
  const { quizRecordId } = useParams();
  const [quizInfo, setQuizInfo] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState();

  const [showPopupSubmissionConfirmation, setShowPopupSubmissionConfirmation] = useState(false);

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API}/takequiz`, { quizRecordId: quizRecordId }, { withCredentials: true }).then((res) => {
      setQuizInfo(res.data.quizRecord);
      setUserAnswers(Array(res.data.quizRecord.questions.length).fill(-1));
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  const handleChoiceChange = (questionNumber, choiceIndex) => {
    const tempAnswers = [...userAnswers];
    tempAnswers[questionNumber] = choiceIndex;
    setUserAnswers(tempAnswers);
  };

  const handleSubmit = async () => {
    await axios.post(`${process.env.REACT_APP_API}/submitquiz`, { quizRecordId: quizRecordId, userAnswers: userAnswers }, { withCredentials: true }).then((res) => {
      navigate(`/quizresult/${quizRecordId}`);
    });
  };

  if (isLoading) return <div />;

  return (
    <>
      <NavBar />

      <div className="d-flex flex-column align-items-center" style={{ backgroundColor: "#f9f9f9" }}>
        <div className="container d-flex flex-column py-5" style={{ maxWidth: "750px" }}>
          <div className="mx-3 fs-3 fw-semibold">{quizInfo.title}</div>
          <div className="my-2 mx-3">{quizInfo.description}</div>
          <hr />
          <div className="px-0 px-sm-4 py-3">
            {quizInfo.questions.map((item, index) => (
              <div className="card p-3 px-sm-5 py-sm-4 my-3" key={index}>
                <div className="fs-5 fw-semibold mb-1">{index + 1 + ". " + item.question}</div>
                {item.choices.map((choice, choiceIndex) => (
                  <label className="d-flex gap-2 mt-1 ms-3" key={choiceIndex}>
                    <input type="radio" checked={choiceIndex === userAnswers[index]} onChange={() => handleChoiceChange(index, choiceIndex)} />
                    {choice}
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div className="d-flex flex-row justify-content-end">
            <button className="btn btn-primary fw-semibold px-4" onClick={() => setShowPopupSubmissionConfirmation(true)}>
              Submit
            </button>
          </div>
        </div>
      </div>
      <Modal show={showPopupSubmissionConfirmation}>
        <div className="d-flex flex-row justify-content-between align-items-start ps-4 pe-3 pt-3" style={{ width: "100%" }}>
          <div className="fs-4 fw-semibold">Submission confirmation</div>
          <div style={{ width: "50px" }} />
          <button className="btn btn-close" onClick={() => setShowPopupSubmissionConfirmation(false)} />
        </div>
        <hr />
        <div className="d-flex justify-content-center align-items-center py-3">
          <div className="fs-5 ">Are you sure you want to submit?</div>
        </div>
        <div className="d-flex justify-content-end me-4 my-3 gap-2">
          <button className="btn px-4 fw-semibold" onClick={() => setShowPopupSubmissionConfirmation(false)}>
            Cancel
          </button>
          <button className="btn btn-primary fw-semibold px-4" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </Modal>
    </>
  );
}

export default TakeQuiz;
