import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Spinner } from "react-bootstrap";
import NavBar from "./MyNavBar";
import axios from "axios";
import dayjs from "dayjs";

function HomePage() {
  const navigate = useNavigate();

  // modals
  const [showModalCreateQuiz, setShowModalCreateQuiz] = useState(false);
  const [showModalLogInFirst, setShowModalLogInFirst] = useState(false);
  const [showModalQuizCreated, setShowModalQuizCreated] = useState(false);

  // loading
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [quizFeedLoading, setQuizFeedLoading] = useState(true);

  // forms
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [privacy, setPrivacy] = useState("Only Me");

  // data
  const [quizId, setQuizId] = useState("");
  const [quizFeed, setQuizFeed] = useState([]);

  // loading quizFeed
  useEffect(() => {
    const e = async () =>
      await axios.post(`${process.env.REACT_APP_API}/getquizfeed`, {}, { withCredentials: true }).then((res) => {
        console.log(res.data);
        setQuizFeed(res.data.quizFeed);
        setQuizFeedLoading(false);
      });
    e();
  }, []);

  // formating time
  const formatTime = (timestamp) => {
    const createdAt = dayjs(timestamp);
    const diff = dayjs().diff(createdAt, "second");
    if (diff < 60) return `${diff}s ago`;
    else if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    else if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    else if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    else return createdAt.format("MMM D, YYYY");
  };

  // handling create quiz
  const handleCreateQuiz = async () => {
    setCreatingQuiz(true);
    await axios.post(`${process.env.REACT_APP_API}/isloggedin`, {}, { withCredentials: true }).then((res) => {
      if (res.data)
        axios.post(`${process.env.REACT_APP_API}/createquiz`, { title: quizTitle, description: quizDescription, privacy: privacy }, { withCredentials: true }).then((res) => {
          setQuizId(res.data.quizId);
          setShowModalQuizCreated(true);
        });
      else setShowModalLogInFirst(true);
    });
    setShowModalCreateQuiz(false);
    setCreatingQuiz(false);
  };

  // handling take quiz
  const handleTakeQuiz = (quizId) => async (event) => {
    event.stopPropagation();
    await axios.post(`${process.env.REACT_APP_API}/generatequizrecord`, { quizId: quizId }, { withCredentials: true }).then((res) => {
      if (res.data.code === 201) navigate(`/takequiz/${res.data.quizRecordId}`);
      else if (res.data.code === 401) setShowModalLogInFirst(true);
    });
  };

  const handleProfile = (str) => (event) => {
    event.stopPropagation();
    navigate(str);
  };

  return (
    <>
      <NavBar />
      <div className="d-flex flex-column align-items-center" style={{ backgroundColor: "#eeeeee" }}>
        <div className="container d-flex flex-column py-3" style={{ maxWidth: "650px" }}>
          {/* Create quiz button */}
          <div className="card p-3 my-3">
            <button type="button" className="btn btn-primary" onClick={() => setShowModalCreateQuiz(true)}>
              Create a quiz
            </button>
          </div>

          {/* Quiz Feed */}
          {quizFeedLoading ? (
            <div className="card d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            quizFeed.map((quiz, index) => (
              <div key={index} className="card p-3 my-1 d-flex flex-column gap-2" onClick={() => navigate(`/quiz/${quiz._id}`)}>
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <div className="d-flex flex-row gap-2 align-items-center position-relative">
                    <div className="aspect-ratio aspect-ratio-1x1 clickable rounded-circle border border-1 p-1" onClick={handleProfile(`/u/${quiz.owner_id.username}`)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" className="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                      </svg>
                    </div>
                    <div className="d-flex flex-column">
                      <div className="fw-semibold clickable" onClick={handleProfile(`/u/${quiz.owner_id.username}`)}>
                        {quiz.owner_id.username}
                      </div>
                      <div>{formatTime(quiz.createdAt)}</div>
                    </div>
                  </div>
                  <button className="btn btn-primary px-3" onClick={handleTakeQuiz(quiz._id)}>
                    Take Quiz
                  </button>
                </div>
                <div className="px-3">
                  <div className="fw-semibold">{quiz.title}</div>
                  <div>{quiz.description}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Quiz Modal */}
      <Modal show={showModalCreateQuiz} aria-labelledby="contained-modal-title-vcenter" centered onHide={() => setShowModalCreateQuiz(false)}>
        <Modal.Header closeButton>
          <div className="fs-4 fw-semibold ms-3">Create a quiz</div>
        </Modal.Header>
        <Modal.Body>
          <form className="d-flex flex-column gap-2 mx-0 mx-sm-5">
            <input type="text" className="form-control" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder="Quiz Title" />
            <input type="text" className="form-control" value={quizDescription} onChange={(e) => setQuizDescription(e.target.value)} placeholder="Quiz Description" />
            <div className="input-group">
              <label className="input-group-text" htmlFor="inputGroupSelect01">
                Privacy
              </label>
              <select className="form-select" id="inputGroupSelect01" onChange={(e) => setPrivacy(e.target.value)} value={privacy}>
                <option value="OnlyMe">Only Me</option>
                <option value="Friends">Friends</option>
                <option value="Public">Public</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalCreateQuiz(false)}>
            Close
          </Button>
          <Button variant="primary" disabled={creatingQuiz} onClick={creatingQuiz ? null : handleCreateQuiz}>
            {creatingQuiz ? (
              <>
                <Spinner size="sm" />
                Creating...
              </>
            ) : (
              "Create Quiz"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalLogInFirst} onHide={() => setShowModalLogInFirst(false)} centered>
        <div className="d-flex flex-column px-5 py-4 align-items-center gap-4">
          <div className="fs-5 text-center fw-semibold">Please log in to create and take a quiz.</div>
          <button className="btn text-white fw-semibold my-1 px-4" style={{ background: "#38761d" }} onClick={() => setShowModalLogInFirst(false)}>
            Continue
          </button>
        </div>
      </Modal>

      <Modal show={showModalQuizCreated} onHide={() => setShowModalQuizCreated(false)} centered>
        <div className="d-flex flex-column px-5 py-4 align-items-center gap-4">
          <div className="fs-5 text-center fw-semibold">{`Successfully created ${quizTitle}.`}</div>
          <button className="btn text-white fw-semibold my-1 px-4" style={{ background: "#777777" }} onClick={() => navigate(`/quiz/${quizId}`)}>
            Continue
          </button>
        </div>
      </Modal>
    </>
  );
}

export default HomePage;
