import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import QuestionTable from "../component/QuestionTable";
import MyNavBar from "./MyNavBar";
import { Modal } from "react-bootstrap";

function Quiz() {
  const navigate = useNavigate();

  const max = 4000;
  const { quizId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [quizInfo, setQuizInfo] = useState();
  const [selected, setSelected] = useState("questions");

  const [showPopupAddQuestion, setshowPopupAddQuestion] = useState(false);
  const [showPopupEditQuestion, setshowPopupEditQuestion] = useState(false);
  const [showPopupAutoQuestion, setShowPopupAutoQuestion] = useState(false);
  const [showPopupLoginFirst, setShowPopupLoginFirst] = useState(false);
  const [showPopupError, setShowPopupError] = useState(false);
  const [editQuestionInfo, setEditQuestionInfo] = useState(["", ["", "", "", ""], -1]);

  const [notes, setNotes] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState();
  const [generating, setGenerating] = useState(false);

  const [privacy, setPrivacy] = useState();
  const [saving, setSaving] = useState(false);

  const letters = ["a. ", "b. ", "c. ", "d. ", "e. ", "f. ", "g. ", "h. ", "i. ", "j. ", "k. ", "l. ", "m. ", "n. ", "o. ", "p. "];

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API}/getquizinfo`, { quizId: quizId }, { withCredentials: true }).then((res) => {
      setQuizInfo(res.data);
      setIsLoading(false);
      setPrivacy(res.data.privacy);
    });
    // eslint-disable-next-line
  }, []);

  const getQuizInfo = async () => {
    await axios.post(`${process.env.REACT_APP_API}/getquizinfo`, { quizId: quizId }, { withCredentials: true }).then((res) => {
      setQuizInfo(res.data);
      setIsLoading(false);
      setPrivacy(res.data.privacy);
    });
  };

  const handleEdit = (item) => {
    setshowPopupEditQuestion(true);
    setEditQuestionInfo([item._id, item.question, item.choices, item.correct_answer]);
  };

  const deleteQuestion = async (questionId) => {
    await axios.post(`${process.env.REACT_APP_API}/deletequestion`, { quizId: quizId, questionId: questionId }, { withCredentials: true }).then((res) => {
      getQuizInfo();
    });
  };
  const addQuestion = async (questionItem) => {
    await axios.post(`${process.env.REACT_APP_API}/addquestion`, { quizId: quizId, questionItem: questionItem }, { withCredentials: true }).then((res) => {
      setshowPopupAddQuestion(false);
      getQuizInfo();
    });
  };
  const editQuestion = async (questionItem) => {
    await axios.post(`${process.env.REACT_APP_API}/editquestion`, { quizId: quizId, questionItem: questionItem }, { withCredentials: true }).then((res) => {
      setshowPopupEditQuestion(false);
      getQuizInfo();
    });
  };

  const handleTakeQuiz = async () => {
    await axios.post(`${process.env.REACT_APP_API}/generatequizrecord`, { quizId: quizId }, { withCredentials: true }).then((res) => {
      if (res.data.code === 201) navigate(`/takequiz/${res.data.quizRecordId}`);
      else if (res.data.code === 401) setShowPopupLoginFirst(true);
    });
  };

  const handleDeleteQuiz = async () => {
    await axios.post(`${process.env.REACT_APP_API}/deletequiz`, { quizId: quizId }, { withCredentials: true }).then((res) => {
      navigate("/");
    });
  };

  const handleGenerate = async () => {
    if (notes.length >= 300) {
      setGenerating(true);
      await axios.post(`${process.env.REACT_APP_API}/generateaiquestions`, { quizId: quizId, text: notes, numberOfQuestions: numberOfQuestions }).then((res) => {
        if (res.data.code === 200) {
          setGenerating(false);
          setShowPopupAutoQuestion(false);
          getQuizInfo();
        } else if (res.data.code === 500) {
          setGenerating(false);
          setShowPopupAutoQuestion(false);
          getQuizInfo();
          setShowPopupError(true);
        }
      });
    }
  };

  const handleSaveInEdit = async () => {
    setSaving(true);
    await axios.post(`${process.env.REACT_APP_API}/editquiz`, { quizId: quizId, privacy: privacy }, { withCredentials: true }).then((res) => {
      setSaving(false);
    });
  };

  if (isLoading)
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...{quizId}</span>
      </div>
    );

  return (
    <>
      <MyNavBar />
      <div className="d-flex flex-column align-items-center" style={{ backgroundColor: "#EEEEEE" }}>
        <div className="container d-flex flex-column py-5" style={{ maxWidth: "800px" }}>
          <div className="d-flex flex-row gap-2 mx-3 justify-content-between align-items-center">
            <div className="fs-3 fw-semibold my-2" style={{ maxWidth: "550px" }}>
              {quizInfo.title}
            </div>
            <button className="btn btn-primary fw-semibold fs-5 px-4 py-2 rounded-3" onClick={handleTakeQuiz}>
              Take Quiz
            </button>
          </div>
          <div className="my-2 mx-3">{quizInfo.description}</div>
          <hr />
          {quizInfo.admin && (
            <>
              <div className="d-flex justify-content-center">
                <div className="d-flex flex-row flex-wrap justify-content-between align-items-center" style={{ maxWidth: "500px", width: "100%" }}>
                  <div className="d-flex flex-row align-items-center gap-1">
                    <div className="fs-4"></div>
                    <div className="btn m-0 p-0 border-0" onClick={() => {}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                      </svg>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center gap-1">
                    <div className="fs-4"></div>
                    <div className="btn m-0 p-0 border-0" onClick={() => {}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z" />
                      </svg>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center gap-1">
                    <div className="fs-4">{quizInfo.questions.length}</div>
                    <div className="btn m-0 p-0 border-0" onClick={() => setSelected("questions")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-question-square-fill" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.496 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z" />
                      </svg>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center gap-1">
                    <div className="fs-4"></div>
                    <div className="btn m-0 p-0 border-0" onClick={() => {}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-up-right-square-fill" viewBox="0 0 16 16">
                        <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12zM5.904 10.803 10 6.707v2.768a.5.5 0 0 0 1 0V5.5a.5.5 0 0 0-.5-.5H6.525a.5.5 0 1 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 .707.707z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ms-2">
                    <div className="btn m-0 p-0 border-0" onClick={() => {}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-clipboard2-data-fill" viewBox="0 0 16 16">
                        <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z" />
                        <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5ZM10 7a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0V7Zm-6 4a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0v-1Zm4-3a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ms-2">
                    <div className="btn m-0 p-0 border-0" onClick={() => setSelected("settings")}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-gear-fill" viewBox="0 0 16 16">
                        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {selected === "questions" && (
                <div className="px-0 px-sm-3 my-5">
                  <div className="d-flex flex-row justify-content-end">
                    <div className="btn-group radius-3">
                      <button className="btn btn-primary ps-4" onClick={() => setshowPopupAddQuestion(true)}>
                        Add a question
                      </button>
                      <button type="button" className="btn btn-sm btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                        <span className="visually-hidden">Toggle Dropdown</span>
                      </button>
                      <ul className="dropdown-menu px-3 py-0">
                        <li>
                          <button className="btn" onClick={() => setShowPopupAutoQuestion(true)}>
                            {"Auto Generate Questions (experimental)"}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="accordion my-3" id="accordionPanelsStayOpenExample">
                    {quizInfo.questions.map((item, index) => (
                      <div className="d-flex align-items-start" key={index}>
                        <div className="accordion-item flex-grow-1">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={"#panelsStayOpen-" + index}
                              aria-expanded="false"
                              aria-controls={"panelsStayOpen-" + index}>
                              {"Question #" + (index + 1)}
                            </button>
                          </h2>
                          <div id={"panelsStayOpen-" + index} className="accordion-collapse collapse">
                            <div className="accordion-body d-flex justify-content-between align-items-start">
                              <div>
                                <div className="fw-bold my-2 mx-sm-0 mx-md-5">{item.question}</div>
                                {item.choices.map((choice, indexChoice) => (
                                  <div className={indexChoice === item.correct_answer ? "mx-sm-0 mx-md-5 fw-bold" : "mx-sm-0 mx-md-5"} key={indexChoice}>
                                    {letters[indexChoice] + choice}
                                  </div>
                                ))}
                              </div>
                              <button className="btn btn-primary px-3" onClick={() => handleEdit(item)}>
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                        <button className="btn btn-danger px-3 m-2" onClick={() => deleteQuestion(item._id)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selected === "settings" && (
                <div className="d-flex justify-content-center">
                  <div className="d-flex flex-column align-items-center gap-2 my-3" style={{ width: "300px" }}>
                    <div className="fw-semibold fs-4 my-2">Settings</div>
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
                    <div className="d-flex justify-content-end w-100 my-2 gap-2">
                      <button className="btn btn-danger fw-semibold" onClick={handleDeleteQuiz}>
                        Delete Quiz
                      </button>
                      {saving ? (
                        <button className="btn px-4 fw-semibold text-white" style={{ backgroundColor: "#38761d" }} type="button" disabled>
                          <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true" />
                          Saving...
                        </button>
                      ) : (
                        <button className="btn px-4 fw-semibold text-white" style={{ backgroundColor: "#38761d" }} onClick={handleSaveInEdit}>
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Modal show={showPopupAddQuestion}>
        <QuestionTable props={["Add a Question", setshowPopupAddQuestion, addQuestion, ["", "", ["", "", "", ""], -1], "Add"]} />
      </Modal>
      <Modal show={showPopupEditQuestion}>
        <QuestionTable props={["Edit Question", setshowPopupEditQuestion, editQuestion, editQuestionInfo, "Edit"]} />
      </Modal>
      <Modal show={showPopupAutoQuestion}>
        <div className="d-flex flex-row justify-content-between align-items-start ps-4 pe-3 pt-3 gap-4" style={{ width: "100%" }}>
          <div className="fs-4 fw-semibold">Automatically generate questions</div>
          <button className="btn btn-close" onClick={() => setShowPopupAutoQuestion(false)} />
        </div>
        <hr />
        <div className="d-flex flex-column p-4 pt-2 gap-3">
          <div className="d-flex flex-column w-100 align-items-end">
            <textarea
              type="text"
              className="form-control"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your notes here, I will automatically generate questions for you. Your notes must be between 300-2000 characters."
              rows="8"
              maxLength={max}
            />
            <span>{notes.length + "/" + max}</span>
          </div>
          <div>
            {notes.length >= 300 && (
              <>
                <div className="form-outline d-flex align-items-center justify-content-end gap-2">
                  <label className="form-label" htmlFor="typeNumber">
                    Number of questions:
                  </label>
                  <input
                    type="number"
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(e.target.value)}
                    id="typeNumber"
                    min="2"
                    step="1"
                    max={Math.floor(notes.length / 150)}
                    className="form-control"
                    style={{ width: "75px" }}
                  />
                </div>
                <span className="d-flex justify-content-end">{`min: 2, max: ${Math.floor(notes.length / 150)}`}</span>
              </>
            )}
          </div>
          {generating ? (
            <button className="btn border border-0 text-white px-2" style={{ backgroundColor: "#38761d" }} type="button" disabled>
              <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true" />
              Generating...
            </button>
          ) : (
            <button className={notes.length >= 300 ? "btn border border-0 text-white px-4" : "btn border border-0 text-white px-4 disabled"} style={{ backgroundColor: "#38761d" }} onClick={handleGenerate}>
              Generate
            </button>
          )}
        </div>
      </Modal>
      <Modal show={showPopupLoginFirst}>
        <div className="d-flex flex-column px-5 py-4 align-items-center gap-4" style={{ maxWidth: "400px" }}>
          <div className="fs-5 text-center fw-semibold">Please log in to take the exam.</div>
          <button className="btn text-white fw-semibold my-1 px-4" style={{ background: "#38761d" }} onClick={() => setShowPopupLoginFirst(false)}>
            Continue
          </button>
        </div>
      </Modal>
      <Modal show={showPopupError}>
        <div className="d-flex flex-column px-5 py-4 align-items-center gap-4" style={{ maxWidth: "400px" }}>
          <div className="fs-5 text-center fw-semibold">Sorry, an error has occured. Contact Jerico.</div>
          <button className="btn text-white fw-semibold my-1 px-4 btn-secondary" onClick={() => setShowPopupError(false)}>
            Continue
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Quiz;
